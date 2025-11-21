@echo off
REM EcoSkin AI - Vercel Deployment Setup for Windows

echo.
echo 🚀 EcoSkin AI - Vercel Deployment Setup
echo ==========================================
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo ❌ .env.local file not found!
    echo.
    echo Creating .env.local from .env.example...
    copy .env.example .env.local
    echo ✅ .env.local created. Please update with your actual values.
    pause
    exit /b 1
)

REM Check if GEMINI_API_KEY is set
findstr /M "GEMINI_API_KEY" .env.local >nul
if errorlevel 1 (
    echo ⚠️  GEMINI_API_KEY not found in .env.local
    echo Please add your Google Gemini API key to .env.local
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

echo.
echo 🏗️  Building project...
call npm run build

echo.
echo ✅ Build successful!
echo.
echo 🎯 Next steps:
echo 1. Install Vercel CLI: npm install -g vercel
echo 2. Login to Vercel: vercel login
echo 3. Deploy: vercel --prod
echo.
echo Or push to GitHub and connect repository to Vercel dashboard
echo https://vercel.com/new
echo.
pause
