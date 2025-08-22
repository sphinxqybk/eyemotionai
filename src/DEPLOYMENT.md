# EyeMotion Deployment Guide

## 🚀 **Google Cloud Deployment**

This guide covers deploying EyeMotion to Google Cloud Platform using Cloud Run, Cloud Build, and related services.

## 📋 **Prerequisites**

### Required Tools
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js 20+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Google Cloud Setup
- Google Cloud Project with billing enabled
- Required APIs enabled (Cloud Run, Cloud Build, etc.)
- Service account with appropriate permissions

## 🛠️ **Initial Setup**

### 1. Clone Repository
```bash
git clone https://github.com/eyemotion/eyemotion-web.git
cd eyemotion-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### 4. Run Setup Script
```bash
# Make script executable
chmod +x scripts/setup-gcloud.sh

# Run Google Cloud setup
./scripts/setup-gcloud.sh
```

## 🔧 **Configuration**

### Environment Variables

#### Production Environment (.env.production)
```bash
NODE_ENV=production
REACT_APP_ENV=production
REACT_APP_BASE_URL=https://eyemotion.ai
REACT_APP_API_URL=https://api.eyemotion.ai
GOOGLE_CLOUD_PROJECT_ID=eyemotion-production
GOOGLE_CLOUD_REGION=asia-southeast1
```

#### Local Development (.env.local)
```bash
NODE_ENV=development
REACT_APP_ENV=development
REACT_APP_BASE_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:3001/api
```

## 🚀 **Deployment Methods**

### Method 1: Automated CI/CD (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

2. **GitHub Actions automatically:**
- Runs tests and linting
- Builds Docker image
- Deploys to Cloud Run
- Configures domain mapping
- Runs health checks

### Method 2: Manual Deployment

#### Build and Deploy
```bash
# Build for production
npm run build:production

# Deploy using Cloud Build
npm run cloud:deploy

# Or deploy directly
npm run deploy:production
```

#### Docker Deployment
```bash
# Build Docker image
npm run docker:build

# Push to Container Registry
npm run docker:push

# Deploy to Cloud Run
gcloud run deploy eyemotion-web \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT_ID/eyemotion-web \
  --region asia-southeast1 \
  --platform managed
```

### Method 3: Local Docker Testing

```bash
# Build and run locally
npm run docker:build
npm run docker:run

# Test the application
curl http://localhost:3000/health
```

## 🌐 **Domain Configuration**

### Custom Domain Setup

1. **Configure DNS Records**
```bash
# Add CNAME record to your DNS provider
# Name: @
# Value: ghs.googlehosted.com
```

2. **Map Domain to Service**
```bash
gcloud run domain-mappings create \
  --service eyemotion-web \
  --domain eyemotion.ai \
  --region asia-southeast1
```

3. **Verify SSL Certificate**
```bash
# Check certificate status
gcloud run domain-mappings describe eyemotion.ai \
  --region asia-southeast1
```

## 📊 **Monitoring & Logging**

### Setup Monitoring
```bash
# Create monitoring alerts
gcloud alpha monitoring policies create monitoring/alerts.yaml

# View logs
gcloud logs tail --service=eyemotion-web

# Monitor performance
gcloud run services describe eyemotion-web \
  --region asia-southeast1 \
  --format="table(status.url,status.latestCreatedRevisionName)"
```

### Health Checks
```bash
# Manual health check
curl https://eyemotion.ai/health

# Automated health monitoring
npm run health:check
```

## 🔧 **Maintenance**

### Scaling Configuration
```bash
# Update service configuration
gcloud run services update eyemotion-web \
  --region asia-southeast1 \
  --memory 4Gi \
  --cpu 4 \
  --max-instances 200
```

### Rolling Updates
```bash
# Deploy new version
gcloud run deploy eyemotion-web \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT_ID/eyemotion-web:new-version \
  --region asia-southeast1
```

### Rollback Deployment
```bash
# List revisions
gcloud run revisions list --service eyemotion-web

# Rollback to specific revision
gcloud run services update-traffic eyemotion-web \
  --to-revisions REVISION-NAME=100
```

## 🛡️ **Security**

### Environment Secrets
```bash
# Create secrets
echo "your-secret" | gcloud secrets create app-secret --data-file=-

# Use in Cloud Run
gcloud run deploy eyemotion-web \
  --set-secrets=APP_SECRET=app-secret:latest
```

### Security Headers
- HTTPS enforcement
- HSTS headers
- Content Security Policy
- CORS configuration

## 📈 **Performance Optimization**

### Build Optimization
```bash
# Analyze bundle size
npm run analyze

# Optimize dependencies
npm run optimize
```

### CDN Configuration
- Cloud CDN for static assets
- Image optimization
- Compression enabled
- Caching strategies

## 🔍 **Troubleshooting**

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
npm run clean
npm ci
npm run build
```

#### Memory Issues
```bash
# Increase memory allocation
gcloud run services update eyemotion-web \
  --memory 4Gi \
  --region asia-southeast1
```

#### DNS Issues
```bash
# Verify DNS propagation
nslookup eyemotion.ai

# Check domain mapping status
gcloud run domain-mappings describe eyemotion.ai \
  --region asia-southeast1
```

### Debugging

#### Application Logs
```bash
# Stream logs
gcloud logs tail --service=eyemotion-web --follow

# Filter logs
gcloud logs read --service=eyemotion-web \
  --filter="severity >= ERROR"
```

#### Performance Debugging
```bash
# Check service metrics
gcloud run services describe eyemotion-web \
  --region asia-southeast1 \
  --format="table(status.url,status.conditions[].type:label=TYPE,status.conditions[].status:label=STATUS)"
```

## 📚 **Additional Resources**

### Documentation
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Container Registry Documentation](https://cloud.google.com/container-registry/docs)

### Monitoring
- [Google Cloud Monitoring](https://cloud.google.com/monitoring)
- [Performance Monitoring](https://cloud.google.com/appengine/docs/legacy/standard/python/how-requests-are-handled#performance-monitoring)

### Support
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-cloud-platform)
- [Google Cloud Community](https://cloud.google.com/community)
- [EyeMotion Support](mailto:support@eyemotion.ai)

## 🚦 **Deployment Checklist**

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Domain DNS records updated
- [ ] SSL certificates ready
- [ ] Monitoring alerts configured
- [ ] Backup strategy in place

### Post-Deployment
- [ ] Health checks passing
- [ ] Performance metrics normal
- [ ] SSL certificate valid
- [ ] Domain mapping working
- [ ] Monitoring alerts active
- [ ] Log aggregation functioning

### Production Readiness
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] Performance optimized
- [ ] Monitoring dashboard configured
- [ ] Backup and recovery tested
- [ ] Team access configured

---

**🎬 EyeMotion Professional AI Film Ecosystem**
*Transforming creative vision into cinema-grade reality*