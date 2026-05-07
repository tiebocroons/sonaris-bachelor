const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

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

    // Parse response
    const responseData = await n8nResponse.json();
    console.log('N8N response:', responseData);

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
