#!/bin/bash

echo "🚀 EcoSkin AI - Vercel Deployment Setup"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo ""
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please update with your actual values."
    exit 1
fi

# Check if GEMINI_API_KEY is set
if ! grep -q "GEMINI_API_KEY=" .env.local; then
    echo "⚠️  GEMINI_API_KEY not found in .env.local"
    echo "Please add your Google Gemini API key to .env.local"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️  Building project..."
npm run build

echo ""
echo "✅ Build successful!"
echo ""
echo "🎯 Next steps:"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. Login to Vercel: vercel login"
echo "3. Deploy: vercel --prod"
echo ""
echo "Or push to GitHub and connect repository to Vercel dashboard"
echo "https://vercel.com/new"
