# Sonaris — Audiogram Scanner

A React Native / Expo web app that lets clinicians photograph or upload an audiogram, analyse it with Google Gemini AI via an N8N workflow, and display hearing loss results with severity classification.

**Live:** https://sonaris.tiebocroons.be

---

## Features

- Upload or photograph an audiogram from any device
- AI-powered analysis via Google Gemini (N8N webhook)
- Severity classification: normal, mild, moderate, moderately severe, severe, profound
- Hearing thresholds per ear (dB HL) per frequency
- Explanation, recommendations, and analysis details
- Runs as a web app in the browser (Expo web export)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native + Expo (web export) |
| Fonts | Barlow Condensed (Google Fonts via expo-google-fonts) |
| Backend proxy | Node.js + Express |
| AI pipeline | N8N → Google Gemini Vision |
| Image hosting | Cloudinary |
| Web server | nginx on CentOS VPS |
| Process manager | PM2 |

---

## App Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Home | `/` | Landing page with logo and navigation |
| Scan instructions | `/scan-instructions` | How-to guide before scanning |
| Upload audiogram | `/upload-audiogram` | Camera or gallery image picker |
| Loading | `/loading-screen` | Uploads to Cloudinary, calls backend, polls N8N |
| Results | `/hearing-loss-results` | Displays severity, thresholds, and explanation |
| Error | `/error-screen` | Shown when analysis fails |

---

## Local Development

### 1. Frontend

```bash
npm install
npx expo start
```

### 2. Backend proxy

The backend proxies requests from the app to the N8N webhook and parses the Gemini response.

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:3000`.

For local development, temporarily change `BACKEND_URL` in `app/(tabs)/loading-screen.tsx` to `http://localhost:3000/api/scan-audiogram` (or your machine's LAN IP for mobile testing). In production, nginx proxies `/api/` directly to the backend, so the frontend only needs the domain.

---

## Configuration

| File | Constant | Description |
|------|----------|-------------|
| `app/(tabs)/loading-screen.tsx` | `BACKEND_URL` | Backend proxy URL (`https://sonaris.tiebocroons.be/api/scan-audiogram` in prod) |
| `app/(tabs)/loading-screen.tsx` | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `app/(tabs)/loading-screen.tsx` | `CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name |
| `backend/server.js` | `N8N_URL` | Your N8N webhook endpoint |
| `backend/server.js` | `N8N_TIMEOUT_MS` | Per-attempt timeout in ms (default 50 000) |
| `backend/server.js` | `N8N_MAX_ATTEMPTS` | Number of retry attempts (default 2) |

---

## Deployment

The app is hosted on a VPS at `37.97.169.128` behind nginx with HTTPS via Let's Encrypt.

### Deploy script

Run from the project root to build and deploy everything in one command:

```powershell
.\deploy.ps1
```

This will:
1. Build the Expo web export (`dist/`)
2. Upload the frontend to `/var/www/sonaris` on the VPS
3. Upload `backend/server.js` to `/opt/sonaris-backend`
4. Fix file permissions and restart the backend via PM2

### Manual VPS commands

```bash
# Restart backend
pm2 restart sonaris-backend

# Fix permissions after upload
chmod -R 755 /var/www/sonaris
restorecon -Rv /var/www/sonaris

# Reload nginx
systemctl reload nginx
```

---

## N8N Prompt

The Gemini node in N8N should use this prompt:

```
You are an expert audiologist. Analyze this audiogram image and respond ONLY with a valid JSON object — no markdown, no code fences, no extra text. Respond in English only.

{
  "hearingLossDetected": true or false,
  "severity": one of "normal", "mild", "moderate", "moderately_severe", "severe", "profound",
  "thresholds": {
    "leftEar": {"250": 0, "500": 0, "1000": 0, "2000": 0, "4000": 0, "8000": 0},
    "rightEar": {"250": 0, "500": 0, "1000": 0, "2000": 0, "4000": 0, "8000": 0}
  },
  "summary": "One sentence summary (max 20 words)",
  "explanation": "2-3 sentence explanation of findings",
  "whyHearingLoss": "Why hearing loss is present or not based on the audiogram",
  "howAnalysis": "Brief explanation of how you read this audiogram",
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Fill in the threshold values (dB HL) from the audiogram. If a value is not visible, omit that key. Keep all text fields concise. Respond with JSON only.
```

Set `maxOutputTokens` to at least `1500` in the Gemini node options.