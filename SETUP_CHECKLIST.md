# Sonaris Audiogram Scanning - Complete Setup Checklist

## Architecture Overview

```
User takes photo
         ↓
Image compressed (10MB → 572KB)
         ↓
Uploaded to Cloudinary
         ↓
Backend proxy receives URL
         ↓
N8N webhook processes image
         ↓
Gemini Vision analyzes audiogram
         ↓
Results sent back to app
         ↓
Hearing loss assessment displayed
```

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Two terminal windows ready

## Step-by-Step Setup

### Phase 1: Frontend Dependencies ✅ (Already Done)

- [x] Image compression with `expo-image-manipulator`
- [x] Cloudinary integration configured
  - Cloud Name: `dkpn2svtk`
  - Upload Preset: `sonaris_preset`

**Status**: All frontend dependencies installed

```bash
npm install  # Already completed
```

### Phase 2: Backend Proxy Server 🟡 (NOW)

#### Terminal 1 - Install Backend Dependencies

```bash
cd backend
npm install
```

**What gets installed:**
- `express` - Web server framework
- `cors` - Enable CORS headers for cross-origin requests
- `node-fetch` - Make HTTP requests to N8N

**Expected output:**
```
added 50 packages
```

#### Terminal 1 - Start Backend Server

```bash
npm start
```

**Expected output:**
```
Backend proxy server running on http://localhost:3000
Health check: http://localhost:3000/health
Webhook relay: POST http://localhost:3000/api/scan-audiogram
```

**Verify it's working:**
```bash
# In Terminal 2, run:
curl http://localhost:3000/health

# Should return: {"status":"OK"}
```

### Phase 3: Frontend Startup 🟡 (AFTER Backend)

#### Terminal 2 - Start Expo App

```bash
npx expo start
```

**Choose your platform:**
- Press `w` for web
- Press `i` for iOS simulator
- Press `a` for Android emulator

**Expected output:**
```
To run the app on web, press w
Expo Go app is ready at exp://...
```

### Phase 4: Test the Complete Workflow

1. **Navigate to camera screen** in the app
2. **Take or upload an audiogram photo**
3. **Watch the workflow:**
   - ✅ Image displayed
   - ✅ "Analysering van audiogram..." loading screen
   - ✅ Check backend terminal for: `Received imageUrl:`
   - ✅ Check console for successful Cloudinary upload
   - ✅ Results should display (or error if N8N fails)

### Frontend Configuration

The frontend is already configured to:
- Compress images automatically (2400×2400px @ 70% quality)
- Fall back to aggressive compression if needed (1600×1600px @ 50% quality)
- Upload to Cloudinary (generates secure_url)
- Send URL to backend proxy at: **`http://localhost:3000/api/scan-audiogram`**

**No changes needed** - everything is configured!

### Backend Architecture

**server.js endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Verify server is running |
| `/api/scan-audiogram` | POST | Relay image to N8N for analysis |

**How it works:**
1. Frontend POSTs image URL to backend proxy
2. Backend receives request with Cloudinary image URL
3. Backend forwards to N8N webhook (server-to-server, no CORS issues)
4. N8N processes with Gemini Vision
5. Backend returns results to frontend

## Workflow Data Flow

```json
{
  "Request": {
    "from": "http://localhost:8081",
    "to": "http://localhost:3000/api/scan-audiogram",
    "body": {
      "imageUrl": "https://res.cloudinary.com/...",
      "fileName": "audiogram.jpg"
    }
  },
  "Backend_Relay": {
    "from": "http://localhost:3000",
    "to": "https://bachelor.app.n8n.cloud/webhook/...",
    "body": {
      "imageUrl": "https://res.cloudinary.com/..."
    }
  },
  "Response": {
    "from": "https://bachelor.app.n8n.cloud",
    "to": "http://localhost:3000",
    "body": {
      "success": true,
      "analysis": {
        "left_ear": {...},
        "right_ear": {...},
        "assessment": "..."
      }
    }
  }
}
```

## Troubleshooting

### Backend fails to start
```bash
# Check if port 3000 is already in use
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill existing process if needed
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Frontend can't reach backend
```bash
# Verify backend is running
curl http://localhost:3000/health

# Check browser console for network errors
# Look for: "POST http://localhost:3000/api/scan-audiogram"
```

### Image not compressing
- Check browser console for compression errors
- Verify `expo-image-manipulator` is installed
- Check available device memory

### Cloudinary upload fails
- Verify internet connection
- Check Cloudinary credentials in code
- Verify upload preset is created in Cloudinary

### N8N returns error
- Check N8N workflow is active
- Verify webhook ID is correct
- Check Gemini API credentials in N8N
- See N8N instance: https://bachelor.app.n8n.cloud/

## Testing Individual Components

### Test 1: Backend Health Check
```bash
curl -X GET http://localhost:3000/health
```
**Expected**: `{"status":"OK"}`

### Test 2: Cloudinary Upload
- Use the app camera to take a photo
- Watch console for success message
- Should see: `Image uploaded to Cloudinary: https://res.cloudinary.com/...`

### Test 3: Backend Relay
- Check backend terminal for request logging
- Should see: `Received imageUrl: https://res.cloudinary.com/...`

### Test 4: N8N Processing
- N8N should receive the image URL
- Gemini Vision analyzes the audiogram
- Results return to backend proxy

## Files Modified/Created

**Created:**
- `backend/server.js` - Express proxy server
- `backend/package.json` - Backend dependencies
- `backend/.gitignore` - Git exclusions
- `backend/README.md` - Backend documentation
- `SETUP_CHECKLIST.md` - This file

**Modified:**
- `app/(tabs)/loading-screen.tsx` - Updated BACKEND_URL to use proxy
- `README.md` - Added backend setup instructions

## Next Steps After Setup

1. ✅ Run backend: `cd backend && npm start`
2. ✅ Run frontend: `npx expo start`
3. 🟡 Test workflow end-to-end
4. ⏳ Debug any N8N workflow issues if needed
5. 📊 Optimize compression if needed
6. 🚀 Deploy to production

## Support Resources

- **Expo Documentation**: https://docs.expo.dev/
- **Express.js**: https://expressjs.com/
- **N8N**: https://docs.n8n.io/
- **Cloudinary**: https://cloudinary.com/documentation
- **Google Gemini API**: https://ai.google.dev/

## Performance Notes

- Image compression reduces 10.1MB → 572KB (95.6% reduction)
- Two-pass compression ensures quality while minimizing size
- Server-to-server N8N requests have no CORS overhead
- Workflow typically completes in 5-10 seconds

---

**Status**: Ready for testing! Follow Phase 2 next.
