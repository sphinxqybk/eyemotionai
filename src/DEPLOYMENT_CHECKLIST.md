# EyeMotion Deployment Checklist

## Pre-Deployment Checklist

### ✅ 1. Environment Setup
- [ ] Copy `.env.local` to `.env` and update with production values
- [ ] Verify `VITE_SUPABASE_URL` is set correctly
- [ ] Verify `VITE_SUPABASE_ANON_KEY` is set correctly
- [ ] Test environment variables locally with `npm run dev`

### ✅ 2. Build Test
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run type-check` to check TypeScript errors
- [ ] Run `npm run build` to test production build
- [ ] Verify `dist/` folder is created successfully
- [ ] Test build locally with `npm run preview`

### ✅ 3. Code Quality
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] All components render without errors
- [ ] Navigation works correctly
- [ ] Authentication flow works (if enabled)
- [ ] Mobile responsiveness tested

## Vercel Deployment Steps

### ✅ 1. Initial Setup
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Run initial deployment: `vercel`
- [ ] Follow prompts to link repository

### ✅ 2. Environment Variables
Go to Vercel Dashboard → Project → Settings → Environment Variables

**Required Variables:**
- [ ] `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = `your_supabase_anon_key`

**Optional Variables:**
- [ ] `VITE_APP_URL` = `https://your-domain.vercel.app`
- [ ] `VITE_DEMO_MODE` = `false` (for production)

### ✅ 3. Build Settings
Verify in Vercel Dashboard → Project → Settings → Build & Development Settings:
- [ ] Framework Preset: `Vite`
- [ ] Build Command: `npm run build` (auto-detected)
- [ ] Output Directory: `dist` (auto-detected)
- [ ] Install Command: `npm install` (auto-detected)
- [ ] Node.js Version: `18.x` or `20.x`

### ✅ 4. Domain Configuration
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] DNS settings properly configured

## Post-Deployment Verification

### ✅ 1. Functionality Test
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Supabase connection status shows "Connected"
- [ ] No console errors in browser
- [ ] Mobile version works correctly

### ✅ 2. Performance Check
- [ ] Page load speed is acceptable (< 3 seconds)
- [ ] Images and assets load correctly
- [ ] No broken links or 404 errors
- [ ] SEO meta tags are correct

### ✅ 3. Authentication Test (if enabled)
- [ ] Sign up process works
- [ ] Sign in process works
- [ ] User dashboard loads correctly
- [ ] Protected routes work correctly

## Common Issues & Solutions

### Build Errors
- **"useRoutes() may be used only in the context of a <Router> component"**
  - ✅ Fixed: BrowserRouter is properly placed in AppRouter component

- **Environment variables not found**
  - Ensure all `VITE_` prefixed variables are set in Vercel dashboard
  - Don't use Vercel Secrets for build-time variables

- **TypeScript errors**
  - Run `npm run type-check` locally
  - Fix all TypeScript errors before deployment

### Runtime Errors
- **White screen on deployment**
  - Check browser console for errors
  - Verify environment variables are set correctly
  - Check Vercel function logs

- **Navigation not working**
  - Verify `vercel.json` has correct rewrites configuration
  - Check React Router setup

### Performance Issues
- **Slow loading**
  - Optimize images and assets
  - Enable gzip compression (automatic in Vercel)
  - Use lazy loading for components

## Rollback Plan

If deployment fails:

1. **Quick Rollback**
   ```bash
   vercel --prod --rollback
   ```

2. **Debug Build Locally**
   ```bash
   npm run build
   npm run preview
   ```

3. **Check Logs**
   - Vercel Dashboard → Project → Functions
   - Browser Developer Console
   - Network tab for failed requests

## Production Monitoring

After successful deployment:

- [ ] Set up Vercel Analytics
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Set up uptime monitoring
- [ ] Configure alerts for critical issues

---

**Last Updated:** January 2025  
**Version:** 1.0.0