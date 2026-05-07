# Sonaris Bachelor - Audiogram Scanner 👋

A React Native Expo app for scanning and analyzing audiograms with professional-grade code analysis and remediation powered by the React Native MCP Server.

## Features

- 📱 Multi-screen audiogram scanning interface
- 🔧 Expert code analysis and automatic remediation
- ✅ Automated testing and quality assurance
- 🛡️ Security vulnerability detection and fixing
- ⚡ Performance optimization with memory leak prevention
- ♿ Accessibility compliance checking

## Get started

### Frontend Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

### Backend Proxy Server Setup (Required for Audiogram Scanning)

The backend proxy server bridges frontend requests to the N8N webhook, bypassing CORS restrictions.

1. Install backend dependencies

   ```bash
   cd backend
   npm install
   ```

2. Start the backend server

   ```bash
   npm start
   ```

   Server runs on `http://localhost:3000`

3. For mobile testing on local network

   Update `BACKEND_URL` in `app/(tabs)/loading-screen.tsx` with your machine's IP address (see [backend/README.md](backend/README.md) for details)

For more backend configuration details, see [backend/README.md](backend/README.md)