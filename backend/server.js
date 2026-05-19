const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const zlib = require('zlib');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Proxy endpoint for N8N webhook
app.post('/api/scan-audiogram', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    console.log('Received imageUrl:', imageUrl);
    console.log('Forwarding to N8N webhook...');

    // Forward request to N8N webhook
    const n8nResponse = await fetch(
      'https://bachelor.app.n8n.cloud/webhook/852c2c14-861a-426e-8eee-067e2a079a9d',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      }
    );

    // Log response status
    console.log('N8N response status:', n8nResponse.status);
    console.log('N8N response headers:', n8nResponse.headers.raw());

    // Handle gzip compression with fallback
    let responseBuffer = await n8nResponse.buffer();
    const encoding = n8nResponse.headers.get('content-encoding');
    let responseText = '';
    
    if (encoding === 'gzip') {
      console.log('Response has gzip encoding header, attempting decompression...');
      try {
        responseBuffer = await new Promise((resolve, reject) => {
          zlib.gunzip(responseBuffer, (err, decompressed) => {
            if (err) reject(err);
            else resolve(decompressed);
          });
        });
        console.log('Successfully decompressed gzip');
      } catch (decompressError) {
        console.warn('Gzip decompression failed, treating as plain text:', decompressError.message);
        // If decompression fails, assume it's already plain text
      }
    }
    
    responseText = responseBuffer.toString('utf-8');
    console.log('N8N raw response length:', responseText.length);
    console.log('N8N raw response:', responseText);

    // Try to parse as JSON
    let responseData;
    try {
      if (!responseText) {
        throw new Error('Empty response from N8N');
      }

      let parsedResponse = JSON.parse(responseText);

      // --- Handle Gemini candidates array format ---
      // Shape: [{ content: { parts: [{ text: "..." }] }, finishReason, index }]
      let extractedText = null;
      if (Array.isArray(parsedResponse) && parsedResponse[0]?.content?.parts) {
        console.log('Detected Gemini candidates response format');
        extractedText = parsedResponse[0].content.parts
          .map(p => p.text || '')
          .join('');
      } else if (parsedResponse.text && typeof parsedResponse.text === 'string') {
        extractedText = parsedResponse.text;
      }

      if (extractedText !== null) {
        console.log('Extracted text from response:', extractedText.substring(0, 300));

        // Strip markdown code fences if present
        const fenceMatch = extractedText.match(/```(?:json)?\s*([\s\S]*?)(?:\s*```|$)/);
        const jsonText = fenceMatch ? fenceMatch[1].trim() : extractedText.trim();

        // Try to parse extracted JSON; if truncated, attempt to complete it
        let analysisData = null;
        try {
          analysisData = JSON.parse(jsonText);
        } catch (_) {
          // Attempt to close truncated JSON by appending closing braces
          let repaired = jsonText;
          for (let attempt = 0; attempt < 5; attempt++) {
            repaired += '}';
            try {
              analysisData = JSON.parse(repaired);
              console.log('Repaired truncated JSON after adding', attempt + 1, 'closing brace(s)');
              break;
            } catch (_) {}
          }

          // Fallback: extract key fields via regex
          if (!analysisData) {
            console.warn('JSON repair failed, extracting fields via regex');
            const boolMatch = jsonText.match(/"hearingLossDetected"\s*:\s*(true|false)/);
            const summaryMatch = jsonText.match(/"summary"\s*:\s*"([^"]*)"/);
            const severityMatch = jsonText.match(/"severity"\s*:\s*"([^"]*)"/);
            const freqMatch = jsonText.match(/"affectedFrequencies"\s*:\s*(\[[^\]]*\])/);
            analysisData = {
              hearingLossDetected: boolMatch ? boolMatch[1] === 'true' : null,
              summary: summaryMatch ? summaryMatch[1] : 'Analysis available but response was truncated.',
              severity: severityMatch ? severityMatch[1] : 'unknown',
              affectedFrequencies: freqMatch ? JSON.parse(freqMatch[1]) : [],
            };
          }
        }

        responseData = { success: true, analysis: analysisData };
      } else {
        // Already in expected format
        responseData = parsedResponse;
      }

      console.log('Final responseData:', JSON.stringify(responseData).substring(0, 300));
    } catch (parseError) {
      console.error('Failed to parse N8N response:', parseError.message);
      console.error('Raw response was:', responseText.substring(0, 500));
      responseData = { 
        error: 'Failed to parse N8N response',
        details: parseError.message,
        rawResponse: responseText.substring(0, 1000)
      };
    }

    // Forward N8N response back to frontend
    if (n8nResponse.ok) {
      res.json(responseData);
    } else {
      res.status(n8nResponse.status).json(responseData);
    }
  } catch (error) {
    console.error('Error in proxy:', error);
    res.status(500).json({ 
      error: 'Failed to process audiogram',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Backend proxy server running on http://localhost:${PORT}`);
});
