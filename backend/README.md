# Sonaris Backend Proxy Server

This backend proxy server relays requests from the Expo frontend to the N8N webhook, bypassing browser CORS restrictions.

## Architecture

```
Browser (localhost:8081)
    ↓ (POST to http://localhost:3000/api/scan-audiogram)
Express Proxy Server (localhost:3000)
    ↓ (no CORS restrictions - server-to-server)
N8N Webhook (bachelor.app.n8n.cloud)
    ↓
Gemini Processing
    ↓
Results returned through proxy to frontend
```

## Setup

### 1. Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

This installs:
- **express**: Web framework
- **cors**: Enable CORS headers for frontend requests
- **node-fetch**: Make HTTP requests to N8N

### 2. Run the Backend Server

Start the proxy server:

```bash
npm start
```

Or with auto-reload during development:

```bash
npm run dev
```

You should see:
```
Backend proxy server running on http://localhost:3000
Health check: http://localhost:3000/health
Webhook relay: POST http://localhost:3000/api/scan-audiogram
```

## Endpoints

### Health Check
- **URL**: `GET http://localhost:3000/health`
- **Response**: `{ status: "OK" }`
- **Purpose**: Verify server is running

### Scan Audiogram (Main Proxy)
- **URL**: `POST http://localhost:3000/api/scan-audiogram`
- **Request Body**:
  ```json
  {
    "imageUrl": "https://res.cloudinary.com/...",
    "fileName": "audiogram.jpg"
  }
  ```
- **Response**: N8N webhook response containing analysis results
- **Purpose**: Relay audiogram image to N8N for Gemini processing

## How It Works

1. **Frontend** (Expo app) captures and compresses an image
2. **Frontend** uploads compressed image to Cloudinary
3. **Frontend** sends Cloudinary URL to proxy: `POST localhost:3000/api/scan-audiogram`
4. **Backend Proxy** receives request and forwards to N8N webhook with full URL
5. **N8N Webhook** processes the image:
   - Fetches image from Cloudinary URL
   - Sends to Gemini Vision API for analysis
   - Returns hearing loss assessment
6. **Backend Proxy** receives N8N response and returns to frontend
7. **Frontend** displays results

## Why This Approach?

**Problem**: Browser CORS policy blocks direct frontend → N8N requests
```
Access to fetch at 'https://bachelor.app.n8n.cloud/webhook/...' 
has been blocked by CORS policy
```

**Solution**: Relay through backend server
- Server-to-server requests have NO CORS restrictions
- Frontend-to-server requests configured with proper CORS headers
- Maintains security while enabling workflow

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

## Next Steps

Once backend is working:
1. ✅ Image compression (already working)
2. ✅ Cloudinary upload (already working)
3. ✅ Backend proxy (in progress)
4. ⏳ N8N webhook relay (will work with backend)
5. ⏳ Gemini analysis (handled by N8N)
6. ⏳ Results display (frontend)

---

For issues or questions about the N8N workflow, check the N8N instance at: https://bachelor.app.n8n.cloud/
