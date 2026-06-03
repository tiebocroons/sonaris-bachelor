# Sonaris Backend Proxy Server

Express proxy server that relays audiogram image analysis requests from the Expo frontend to the N8N webhook, handling CORS, response parsing, JSON repair, and severity normalization.

## Architecture

```
Browser / Expo app (localhost:8081)
    ↓  POST /api/scan-audiogram  { imageUrl }
Express Proxy Server (localhost:3000)
    ↓  POST (server-to-server, no CORS restrictions)
N8N Webhook (bachelor.app.n8n.cloud)
    ↓
Gemini Vision API
    ↓
Parsed & normalized JSON results → frontend
```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

Dependencies:
- **express** — web framework
- **cors** — CORS headers for frontend requests
- **node-fetch** — HTTP requests to N8N

Dev dependencies:
- **nodemon** — auto-reload on file changes

### 2. Run the Server

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

The server starts on `http://localhost:3000`.

## Endpoints

### `GET /health`
Returns `{ "status": "OK" }`. Used to verify the server is running.

### `POST /api/scan-audiogram`

Proxies an audiogram image to N8N for Gemini Vision analysis.

**Request body:**
```json
{ "imageUrl": "https://res.cloudinary.com/..." }
```

**Success response:**
```json
{
  "success": true,
  "analysis": {
    "hearingLossDetected": true,
    "severity": "moderate",
    "summary": "...",
    "explanation": "...",
    "whyHearingLoss": "...",
    "howAnalysis": "...",
    "thresholds": {
      "leftEar": { "500": 40, "1000": 50, ... },
      "rightEar": { "500": 35, "1000": 45, ... }
    },
    "isAudiogram": true
  }
}
```

**Error / timeout response:**
```json
{ "error": "Analysis timed out — please try again", "details": "..." }
```

## Request Pipeline

1. Frontend uploads a compressed image to Cloudinary and gets a URL.
2. Frontend sends `POST /api/scan-audiogram` with `{ imageUrl }`.
3. Proxy forwards the URL to N8N (up to **2 attempts**, 50 s timeout each).
4. N8N fetches the image and runs Gemini Vision analysis.
5. Proxy parses the response:
   - Handles gzip decompression.
   - Strips markdown code fences from the Gemini output.
   - Attempts `JSON.parse`, then a structural JSON repair, then regex field extraction as a last resort.
   - Normalizes the `severity` field to one of: `normal`, `mild`, `moderate`, `moderately_severe`, `severe`, `profound`, or `unknown`.
   - Sanitizes numeric threshold values (non-numbers become `null`).
   - Sets `isAudiogram: false` when thresholds are empty and the summary indicates a non-audiogram image.
6. Normalized result is returned to the frontend.

## Why a Proxy?

Direct browser → N8N requests are blocked by CORS policy:
```
Access to fetch at 'https://bachelor.app.n8n.cloud/webhook/...'
has been blocked by CORS policy
```

The proxy sits server-side, where CORS does not apply, and adds proper `Access-Control-Allow-Origin` headers for the frontend.

## Environment Configuration

### For Web Testing (localhost)
No changes needed. Backend runs on `http://localhost:3000`

### For Mobile Testing (Android/iOS on Local Network)

The frontend needs to know your machine's IP address:

1. Find your machine IP:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```
   Look for IPv4 address (e.g., `192.168.x.x`)

2. Update `BACKEND_URL` in [app/(tabs)/loading-screen.tsx](../app/(tabs)/loading-screen.tsx):
   ```typescript
   // Change this:
   const BACKEND_URL = 'http://localhost:3000/api/scan-audiogram';
   
   // To this (for mobile):
   const BACKEND_URL = 'http://192.168.x.x:3000/api/scan-audiogram';
   ```

3. Ensure backend server is running on port 3000

## Troubleshooting

### Backend won't start
- Verify Node.js is installed: `node --version`
- Check port 3000 isn't in use: `lsof -i :3000` (Mac/Linux)
- Check dependencies: `npm install`

### Frontend can't reach backend
- Verify backend is running: `curl http://localhost:3000/health`
- Check firewall settings
- For mobile: ensure machine IP is correct in BACKEND_URL
- Check both frontend and backend are on same network (for mobile)

### N8N returns error
- Verify webhook URL is correct in server.js
- Check N8N workflow is active
- Verify Gemini API has sufficient credits
- Check image URL is publicly accessible (Cloudinary URL should be)

### CORS errors still appearing
- Ensure Express CORS middleware is enabled
- Check frontend is properly sending requests to proxy URL
- Verify headers are correct in requests

## Testing the Complete Workflow

1. **Start backend** (Terminal 1):
   ```bash
   npm start
   ```

2. **In new terminal, start frontend** (Terminal 2):
   ```bash
   npm start
   ```

3. **In browser/app**, navigate to camera screen and take/upload an audiogram

4. **Watch console output** in backend terminal to see:
   - Request received
   - N8N webhook called
   - Response from N8N
   - Data returned to frontend

5. **Expected result**: Hearing loss assessment displayed on results screen

## File Structure

```
backend/
├── server.js           # Main proxy server (Express)
├── package.json        # Node.js dependencies
└── README.md          # This file
```