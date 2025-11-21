# EcoSkin AI - Deployment Guide

## Overview
EcoSkin AI is an AI-powered skincare and beauty advisory web application built with React, TypeScript, and Vite. This guide provides instructions for deploying the project to Vercel.

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Vercel account (free at https://vercel.com)
- Google Gemini API Key

## Environment Setup

### 1. Local Development Setup

```bash
# Install dependencies
npm install

# Create .env.local file with your API keys
GEMINI_API_KEY=your_gemini_api_key_here

# Run development server
npm run dev
```

### 2. Build for Production

```bash
npm run build
npm run preview
```

## Vercel Deployment

### Method 1: Deploy via CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy project
vercel

# Deploy to production
vercel --prod
```

### Method 2: Deploy via GitHub

1. Push your repository to GitHub
2. Go to https://vercel.com/new
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Configure project settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. Add Environment Variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key

7. Click "Deploy"

### Method 3: Deploy via Vercel Dashboard

1. Connect your GitHub account to Vercel
2. Click "New Project"
3. Select your repository
4. Configure settings and deploy

## Environment Variables

### Required Variables
- `GEMINI_API_KEY` - Google Gemini API key for AI functionality

### Optional Variables
- `VITE_APP_NAME` - Application name (default: "EcoSkin AI Skincare Advisor")
- `VITE_ENABLE_ANALYTICS` - Enable analytics (default: false)
- `VITE_ENABLE_ERROR_REPORTING` - Enable error reporting (default: true)
- `VITE_LOG_LEVEL` - Logging level: "debug", "info", "warn", "error" (default: "info")

## Project Structure

```
ecoskin-ai-skincare-advisor-v/
├── index.html                 # Entry point with SEO tags
├── index.tsx                 # React root component
├── App.tsx                   # Main app component with routing
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── package.json             # Project dependencies
├── vercel.json              # Vercel deployment configuration
├── .vercelignore            # Files to exclude from deployment
├── .env.example             # Environment variables template
├── .env.production          # Production environment variables
│
├── components/
│   ├── AnalysisDisplay.tsx
│   ├── CameraCapture.tsx
│   ├── ChatInterface.tsx
│   ├── HairAnalysisDisplay.tsx
│   ├── SkincareMap.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── AppLayout.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── ThemeToggle.tsx
│
├── pages/
│   ├── Dashboard.tsx
│   ├── SkinAnalysis.tsx
│   ├── HairAnalysis.tsx
│   ├── ProductAnalyzer.tsx
│   ├── ColorAdvisor.tsx
│   ├── MakeupAdvisor.tsx
│   ├── SkincareRoutinePlanner.tsx
│   ├── SkinJournal.tsx
│   └── ChatInterface.tsx
│
├── services/
│   └── geminiService.ts      # Google Gemini API integration
│
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/
│   └── useAuth.ts
│
├── types.ts                 # TypeScript type definitions
├── i18n.ts                  # i18next configuration (6+ languages)
│
└── public/
    ├── manifest.json        # PWA manifest
    ├── favicon.ico
    └── metadata.config.ts   # Metadata configuration
```

## Key Configuration Files

### `vercel.json`
Specifies build commands, output directory, and environment variables for Vercel deployment.

### `.vercelignore`
Excludes unnecessary files from deployment to reduce build size.

### `vite.config.ts`
- Configured with production optimization
- Code splitting for vendor libraries
- Source maps disabled in production
- CSS code splitting enabled

### `tsconfig.json`
- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Strict type checking enabled

## Build Optimization

### File Splitting
The project is configured to split bundles into:
- `vendor.js` - React, React DOM, React Router
- `gemini.js` - Google Gemini API
- `i18n.js` - Internationalization libraries
- `main.js` - Application code

### Performance Features
- CSS code splitting
- Minification with Terser
- Console logging disabled in production
- Asset compression

## Deployment Checklist

- [ ] Environment variables set in Vercel dashboard
- [ ] `GEMINI_API_KEY` is valid and active
- [ ] Build passes locally: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] All tests pass (if applicable)
- [ ] `.vercelignore` file is in place
- [ ] `vercel.json` configuration is correct
- [ ] Git repository is connected to Vercel

## Security Considerations

1. **API Keys**: Never commit `.env.local` to version control
2. **CORS**: Configure CORS properly for Gemini API calls
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Input Validation**: Validate all user inputs before sending to API
5. **HTTPS**: All traffic is encrypted with HTTPS by default on Vercel

## Performance Optimization

- Images are cached for 30 days
- CSS and JS are cached for 1 year with versioning
- API responses cached for 5 minutes
- Gzip compression enabled by default

## Monitoring & Analytics

Monitor your deployment in the Vercel dashboard:
- Build times and status
- Function execution times
- Error rates
- Page performance metrics

## Troubleshooting

### Build Fails
1. Check Node.js version: `node --version` (should be 16.x or higher)
2. Clear build cache: `vercel env pull`
3. Check environment variables are set correctly

### API Not Working
1. Verify `GEMINI_API_KEY` is set in Vercel
2. Check API key quota and limits
3. Verify API is enabled in Google Cloud Console

### Slow Performance
1. Check bundle size: `npm run build` and examine `dist/` folder
2. Review Network tab in browser DevTools
3. Check Vercel Analytics for bottlenecks

## Support & Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Google Gemini API](https://ai.google.dev)
- [i18next Documentation](https://www.i18next.com)

## License

This project is licensed under the MIT License.

## Team

EcoSkin AI Development Team
