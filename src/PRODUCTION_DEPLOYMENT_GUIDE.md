# EyeMotion Production Deployment Guide

## 🎬 Complete Production Deployment for eyemotionai.com

This guide provides step-by-step instructions for deploying EyeMotion to production with the domain `eyemotionai.com`.

## 📋 Prerequisites

### Required Accounts & Services
- [x] **Supabase Account** - Database and backend services
- [x] **Vercel Account** - Frontend hosting and CDN
- [x] **Domain Registrar Access** - DNS management for eyemotionai.com
- [x] **Stripe Account** - Payment processing (optional for MVP)
- [x] **Email Service** - For notifications (Zoho/Gmail/SendGrid)

### Required Tools
```bash
# Install required CLI tools
npm install -g vercel
npm install -g supabase
npm install -g tsx
```

### Environment Variables
Create `.env.production` with the following:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Vite Environment Variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ENVIRONMENT=production
VITE_DOMAIN=eyemotionai.com

# Payment Configuration (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# AI Services (Optional)
OPENAI_API_KEY=your_openai_api_key

# Monitoring (Optional)
SLACK_WEBHOOK_URL=your_slack_webhook_url
EMERGENCY_PHONE=your_emergency_phone_number
```

## 🚀 Deployment Steps

### Step 1: Prepare Repository
```bash
# Clone and prepare the repository
git clone [your-repo-url]
cd eyemotion-ecosystem

# Install dependencies
npm install

# Make deployment script executable
chmod +x deploy-production-eyemotionai.sh
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env.production

# Edit .env.production with your actual values
nano .env.production
```

### Step 3: Setup Supabase Backend
```bash
# Login to Supabase
supabase login

# Initialize project (if not already done)
supabase init

# Deploy database schema
supabase db push

# Deploy edge functions
supabase functions deploy
```

### Step 4: Deploy Frontend
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Add custom domain
vercel domains add eyemotionai.com
vercel domains add www.eyemotionai.com
```

### Step 5: Configure DNS
Update your DNS records with the following configuration:

```
Type    Name                Value                       TTL
A       eyemotionai.com     76.76.19.61                3600
CNAME   www                 cname.vercel-dns.com       3600
CNAME   api                 [project-id].supabase.co  3600
```

See `dns-configuration-eyemotionai.md` for complete DNS setup.

### Step 6: Run Automated Deployment
```bash
# Run the complete deployment script
./deploy-production-eyemotionai.sh
```

### Step 7: Verify Deployment
```bash
# Run verification script
npm run verify:deployment

# Check health endpoint
curl https://eyemotionai.com/health

# Test main website
curl https://eyemotionai.com
```

## 🔧 Manual Deployment (Alternative)

If you prefer manual deployment or the automated script fails:

### 1. Build Application
```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

### 2. Deploy to Vercel Manually
```bash
# Deploy built application
vercel --prod --confirm

# Set environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

### 3. Setup Database Manually
```bash
# Run database initialization
npm run deploy:database
```

### 4. Configure Domain Manually
```bash
# Add domains in Vercel dashboard
# Configure DNS records as specified
# Wait for SSL certificate provisioning
```

## 📊 Monitoring Setup

### Health Monitoring
```bash
# Start monitoring (optional)
npm run monitor:start

# Check health status
npm run health:check
```

### Performance Monitoring
- **Vercel Analytics** - Automatic performance monitoring
- **Supabase Dashboard** - Database performance
- **Custom Monitoring** - See `monitoring/production-monitoring.yaml`

## 🔒 Security Configuration

### SSL Certificates
- **Auto-provisioned** by Vercel for all domains
- **Let's Encrypt** certificates with auto-renewal
- **HTTPS redirect** automatically configured

### Security Headers
Configured in `vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security
- Content Security Policy

### Database Security
- **Row Level Security (RLS)** enabled
- **API key restrictions** configured
- **Service role** secured for backend only

## 🧪 Testing Production

### Automated Tests
```bash
# Run production tests
npm run test:production

# Health check
curl -f https://eyemotionai.com/health

# API health check
curl -f https://eyemotionai.com/api/health
```

### Manual Testing Checklist
- [ ] Main website loads (https://eyemotionai.com)
- [ ] WWW redirect works (https://www.eyemotionai.com)
- [ ] Health endpoint responds (https://eyemotionai.com/health)
- [ ] SSL certificate is valid
- [ ] Mobile responsiveness
- [ ] Language switching (Thai/English)
- [ ] Navigation works properly
- [ ] Error pages display correctly

### Load Testing
```bash
# Basic load test with curl
for i in {1..10}; do
  curl -w "%{http_code} %{time_total}s\n" -o /dev/null -s https://eyemotionai.com
done
```

## 🔄 Deployment Rollback

If deployment fails or issues are found:

### Quick Rollback
```bash
# Rollback in Vercel
vercel rollback [deployment-url]

# Or redeploy previous version
vercel --prod
```

### Database Rollback
```bash
# Restore from backup (if needed)
npm run backup:restore [backup-id]
```

## 📈 Post-Deployment Tasks

### Immediate (0-24 hours)
- [ ] Verify all functionality works
- [ ] Check error rates in monitoring
- [ ] Test payment processing (if enabled)
- [ ] Verify email notifications
- [ ] Check SSL certificate status
- [ ] Monitor performance metrics

### Short-term (1-7 days)
- [ ] Setup backup automation
- [ ] Configure error alerting
- [ ] Monitor user feedback
- [ ] Review security logs
- [ ] Optimize performance based on metrics
- [ ] Test disaster recovery procedures

### Long-term (7+ days)
- [ ] Setup automated testing
- [ ] Configure capacity monitoring
- [ ] Review and optimize costs
- [ ] Plan feature releases
- [ ] Setup user analytics
- [ ] Document operational procedures

## 🆘 Troubleshooting

### Common Issues

#### Domain Not Accessible
```bash
# Check DNS propagation
dig eyemotionai.com
nslookup eyemotionai.com

# Check SSL
openssl s_client -connect eyemotionai.com:443
```

#### API Not Working
```bash
# Check Supabase status
curl -I $SUPABASE_URL/rest/v1/

# Check edge functions
curl -I $SUPABASE_URL/functions/v1/make-server-7dc8476e/health
```

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Support Contacts
- **Technical Issues**: dev@eyemotionai.com
- **Domain Issues**: admin@eyemotionai.com
- **Emergency**: Use monitoring alerts configuration

## 📚 Additional Resources

### Documentation
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Supabase Production Guide](https://supabase.com/docs/guides/platform/going-to-prod)
- [React Production Build](https://react.dev/reference/react-dom/client/createRoot#building-for-production)

### Monitoring & Analytics
- [Vercel Analytics](https://vercel.com/analytics)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Google Search Console](https://search.google.com/search-console)

### Performance Optimization
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)

---

## 🎉 Deployment Complete!

Once all steps are completed successfully:

🌐 **Live Site**: https://eyemotionai.com
🔗 **Health Check**: https://eyemotionai.com/health
📊 **Dashboard**: https://vercel.com/dashboard
🗄️ **Database**: https://supabase.com/dashboard

Your EyeMotion Adaptive Visual Storytelling & Verification Ecosystem is now live and ready for users!

---

**Last Updated**: $(date)
**Deployment Version**: 1.0.0
**Status**: ✅ Production Ready