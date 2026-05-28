const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const zlib = require('zlib');

const app = express();
const PORT = process.env.PORT || 3000;

const N8N_URL = 'https://bachelor.app.n8n.cloud/webhook/852c2c14-861a-426e-8eee-067e2a079a9d';
const N8N_TIMEOUT_MS = 30000; // 30s per attempt
const N8N_MAX_ATTEMPTS = 2;

const VALID_SEVERITIES = new Set(['normal', 'mild', 'moderate', 'moderately_severe', 'severe', 'profound']);

// Normalize AI-returned severity to a known value
function normalizeSeverity(raw) {
  if (!raw || typeof raw !== 'string') return 'unknown';
  const s = raw.toLowerCase().trim().replace(/[\s-]+/g, '_');
  if (VALID_SEVERITIES.has(s)) return s;
  if (s.includes('profound')) return 'profound';
  if (s.includes('severe') && s.includes('mod')) return 'moderately_severe';
  if (s.includes('severe')) return 'severe';
  if (s.includes('moderate')) return 'moderate';
  if (s.includes('mild')) return 'mild';
  if (s.includes('normal')) return 'normal';
  return 'unknown';
}

// Repair truncated JSON by closing unclosed strings, arrays, and objects
function repairJson(text) {
  // Fast path
  try { return JSON.parse(text); } catch (_) {}

  let s = text;
  let inString = false, escaped = false;
  let openBraces = 0, openBrackets = 0;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escaped) { escaped = false; continue; }
    if (c === '\\' && inString) { escaped = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === '{') openBraces++;
    else if (c === '}') openBraces--;
    else if (c === '[') openBrackets++;
    else if (c === ']') openBrackets--;
  }

  // Close unclosed string, then arrays, then objects
  if (inString) s += '"';
  if (openBrackets > 0) s += ']'.repeat(openBrackets);
  if (openBraces > 0) s += '}'.repeat(openBraces);

  try { return JSON.parse(s); } catch (_) {}

  // Strip last incomplete key-value pair after the last comma, then close
  const lastComma = s.lastIndexOf(',');
  if (lastComma > 0) {
    let trimmed = s.substring(0, lastComma);
    let ob = 0, cb = 0;
    for (const c of trimmed) {
      if (c === '{') ob++; else if (c === '}') cb++;
    }
    trimmed += '}'.repeat(Math.max(0, ob - cb));
    try { return JSON.parse(trimmed); } catch (_) {}
  }

  return null;
}

// Call N8N with timeout and retry
async function callN8N(imageUrl) {
  let lastError;
  for (let attempt = 1; attempt <= N8N_MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);
    try {
      console.log(`N8N attempt ${attempt}...`);
      const response = await fetch(N8N_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      // Decompress if gzip
      let buf = await response.buffer();
      if (response.headers.get('content-encoding') === 'gzip') {
        try {
          buf = await new Promise((resolve, reject) =>
            zlib.gunzip(buf, (err, d) => (err ? reject(err) : resolve(d)))
          );
        } catch (_) { /* fallthrough to raw buffer */ }
      }
      const text = buf.toString('utf-8');
      console.log(`N8N attempt ${attempt} — status: ${response.status}, length: ${text.length}`);

      // Retry on 5xx or empty body
      if ((response.status >= 500 || !text.trim()) && attempt < N8N_MAX_ATTEMPTS) {
        console.warn(`Retrying (status ${response.status}, empty=${!text.trim()})`);
        lastError = new Error(`N8N returned ${response.status}`);
        continue;
      }

      return { ok: response.ok, status: response.status, text };
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < N8N_MAX_ATTEMPTS) {
        console.warn(`N8N attempt ${attempt} failed (${err.message}), retrying...`);
        continue;
      }
    }
  }
  throw lastError || new Error('N8N request failed after retries');
}

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

    const { ok, status, text: responseText } = await callN8N(imageUrl);
    console.log('N8N final response length:', responseText.length);
    console.log('N8N raw response:', responseText.substring(0, 500));

    // Parse response
    let responseData;
    try {
      if (!responseText.trim()) throw new Error('Empty response from N8N');

      let parsedResponse = JSON.parse(responseText);

      // Handle Gemini candidates array format
      let extractedText = null;
      if (Array.isArray(parsedResponse) && parsedResponse[0]?.content?.parts) {
        console.log('Detected Gemini candidates format');
        extractedText = parsedResponse[0].content.parts.map(p => p.text || '').join('');
      } else if (parsedResponse.text && typeof parsedResponse.text === 'string') {
        extractedText = parsedResponse.text;
      }

      if (extractedText !== null) {
        console.log('Extracted text:', extractedText.substring(0, 300));

        // Strip markdown code fences
        const fenceMatch = extractedText.match(/```(?:json)?\s*([\s\S]*?)(?:\s*```|$)/);
        const jsonText = fenceMatch ? fenceMatch[1].trim() : extractedText.trim();

        // Try parse → repair → regex fallback
        let analysisData = repairJson(jsonText);

        if (!analysisData) {
          console.warn('JSON repair failed, falling back to regex extraction');
          const boolMatch   = jsonText.match(/"hearingLossDetected"\s*:\s*(true|false)/);
          const summaryMatch   = jsonText.match(/"summary"\s*:\s*"((?:[^"\\]|\\.)*)"/);
          const severityMatch  = jsonText.match(/"severity"\s*:\s*"([^"]*)"/);
          const explanationMatch = jsonText.match(/"explanation"\s*:\s*"((?:[^"\\]|\\.)*)"/);
          const whyMatch       = jsonText.match(/"whyHearingLoss"\s*:\s*"((?:[^"\\]|\\.)*)"/);
          const howMatch       = jsonText.match(/"howAnalysis"\s*:\s*"((?:[^"\\]|\\.)*)"/);
          analysisData = {
            hearingLossDetected: boolMatch ? boolMatch[1] === 'true' : null,
            summary: summaryMatch ? summaryMatch[1] : 'Analysis available but response was truncated.',
            severity: severityMatch ? severityMatch[1] : 'unknown',
            ...(explanationMatch ? { explanation: explanationMatch[1] } : {}),
            ...(whyMatch       ? { whyHearingLoss: whyMatch[1] }       : {}),
            ...(howMatch       ? { howAnalysis: howMatch[1] }           : {}),
          };
        }

        // Normalize severity to a known value
        analysisData.severity = normalizeSeverity(analysisData.severity);
        console.log('Normalized severity:', analysisData.severity);

        // Sanitize threshold values — ensure they are numbers or null
        if (analysisData.thresholds && typeof analysisData.thresholds === 'object') {
          for (const ear of ['leftEar', 'rightEar']) {
            if (analysisData.thresholds[ear] && typeof analysisData.thresholds[ear] === 'object') {
              for (const freq of Object.keys(analysisData.thresholds[ear])) {
                const v = Number(analysisData.thresholds[ear][freq]);
                analysisData.thresholds[ear][freq] = isNaN(v) ? null : v;
              }
            }
          }
        }

        // Detect non-audiogram images: empty thresholds + summary indicates it's not an audiogram
        const leftEarEmpty = !analysisData.thresholds?.leftEar || Object.keys(analysisData.thresholds.leftEar).length === 0;
        const rightEarEmpty = !analysisData.thresholds?.rightEar || Object.keys(analysisData.thresholds.rightEar).length === 0;
        const summaryLower = (analysisData.summary || '').toLowerCase();
        const notAudiogramPhrases = ['not an audiogram', 'not a valid audiogram', 'photograph', 'no audiogram', 'not possible', 'cannot analyze', 'cannot be analyzed'];
        const summaryIndicatesNotAudiogram = notAudiogramPhrases.some(p => summaryLower.includes(p));
        if (leftEarEmpty && rightEarEmpty && summaryIndicatesNotAudiogram) {
          analysisData.isAudiogram = false;
          console.log('Detected non-audiogram image, flagging isAudiogram=false');
        }

        responseData = { success: true, analysis: analysisData };
      } else {
        responseData = parsedResponse;
      }

      console.log('Final responseData:', JSON.stringify(responseData).substring(0, 300));
    } catch (parseError) {
      console.error('Failed to parse N8N response:', parseError.message);
      responseData = {
        error: 'Failed to parse analysis response',
        details: parseError.message,
      };
    }

    if (ok) {
      res.json(responseData);
    } else {
      res.status(status).json(responseData);
    }
  } catch (error) {
    console.error('Error in proxy:', error);
    const isTimeout = error.name === 'AbortError' || error.message?.includes('abort');
    res.status(503).json({
      error: isTimeout
        ? 'Analysis timed out — please try again'
        : 'Failed to process audiogram',
      details: error.message,
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
