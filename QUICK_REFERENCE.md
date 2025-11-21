# 🚀 Vercel Deployment - Quick Reference

## Installation & Setup (5 minutes)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your GEMINI_API_KEY
```

## Deployment Options

### Option A: CLI Deployment (1 minute)
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Option B: GitHub Integration (Recommended)
```bash
# Push to GitHub
git push origin main

# Then import at https://vercel.com/new
# - Select your GitHub repo
# - Add GEMINI_API_KEY env variable
# - Click Deploy
```

### Option C: Deployment Script
```bash
# Windows
./deploy.bat

# Linux/Mac
bash deploy.sh
```

---

## Essential Environment Variables

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional (already in .env.production)
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_LOG_LEVEL=warn
```

---

## Pre-Deployment Checklist

- [ ] Build locally: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Git committed: `git add . && git commit -m "message"`
- [ ] API key valid in `.env.local`
- [ ] All features tested

---

## Important Files

| File | Purpose |
|------|---------|
| `vercel.json` | Deployment config |
| `.vercelignore` | Excluded files |
| `vite.config.ts` | Build optimization |
| `.env.example` | Env template |
| `.github/workflows/deploy.yml` | Auto-deploy |

---

## Deployment URLs

```
Preview: https://ecoskin-ai-[random].vercel.app
Production: https://your-domain.vercel.app
```

---

## Post-Deployment Checks

1. ✅ Website loads without errors
2. ✅ Images and styling render correctly
3. ✅ API calls work (Gemini integration)
4. ✅ Features functional (skin/hair analysis)
5. ✅ Mobile responsive
6. ✅ No console errors

---

## Common Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Type checking
npm run type-check

# Deploy to production
npm run deploy

# Deploy preview
npm run deploy:preview
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Node.js version, clear cache: `npm ci` |
| API not working | Verify GEMINI_API_KEY in Vercel dashboard |
| Environment vars not loading | Check variable names, redeploy |
| Slow performance | Review bundle size, check Vercel Analytics |

---

## Documentation Files

| File | Read For |
|------|----------|
| `VERCEL_DEPLOYMENT.md` | Complete guide |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |
| `DEPLOYMENT_FILES_SUMMARY.md` | File overview |

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Gemini API:** https://ai.google.dev
- **Vite:** https://vitejs.dev
- **React:** https://react.dev

---

## Quick Decision Tree

**Want the fastest deployment?**
→ Use GitHub + Vercel dashboard (2 minutes setup, automatic deploys)

**Want manual control?**
→ Use Vercel CLI (`vercel --prod`)

**Want to test locally first?**
→ Run `npm run build` then `npm run preview`

**Want automatic on every push?**
→ Set up `.github/workflows/deploy.yml` (already included)

---

**Ready to deploy? Run:** `vercel --prod`
