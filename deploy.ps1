# deploy.ps1 — Build and deploy Sonaris to VPS
# Usage: .\deploy.ps1

$VPS_USER = "root"
$VPS_IP = "37.97.169.128"
$VPS_WEB_PATH = "/var/www/sonaris"
$VPS_BACKEND_PATH = "/opt/sonaris-backend"
$LOCAL_DIST = "dist"
$LOCAL_BACKEND = "backend\server.js"

Write-Host "==> Building web app..." -ForegroundColor Cyan
npx expo export --platform web
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Aborting." -ForegroundColor Red
    exit 1
}

Write-Host "==> Uploading frontend..." -ForegroundColor Cyan
scp -r $LOCAL_DIST "${VPS_USER}@${VPS_IP}:${VPS_WEB_PATH}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend upload failed. Aborting." -ForegroundColor Red
    exit 1
}

Write-Host "==> Uploading backend..." -ForegroundColor Cyan
scp $LOCAL_BACKEND "${VPS_USER}@${VPS_IP}:${VPS_BACKEND_PATH}/server.js"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend upload failed. Aborting." -ForegroundColor Red
    exit 1
}

Write-Host "==> Applying permissions and restarting backend on VPS..." -ForegroundColor Cyan
ssh "${VPS_USER}@${VPS_IP}" "chmod -R 755 ${VPS_WEB_PATH} && restorecon -Rv ${VPS_WEB_PATH} && pm2 restart sonaris-backend"
if ($LASTEXITCODE -ne 0) {
    Write-Host "VPS post-deploy steps failed." -ForegroundColor Red
    exit 1
}

Write-Host "==> Deploy complete! https://sonaris.tiebocroons.be" -ForegroundColor Green
