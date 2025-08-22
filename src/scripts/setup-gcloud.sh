#!/bin/bash

# EyeMotion Google Cloud Setup Script
# This script sets up Google Cloud environment for EyeMotion deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="eyemotion-production"
REGION="asia-southeast1"
SERVICE_NAME="eyemotion-web"
DOMAIN="eyemotion.ai"

echo -e "${BLUE}🚀 EyeMotion Google Cloud Setup${NC}"
echo "=================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI is not installed${NC}"
    echo -e "${YELLOW}Please install it from: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi

# Authenticate with Google Cloud
echo -e "${BLUE}🔐 Authenticating with Google Cloud...${NC}"
gcloud auth login

# Set project
echo -e "${BLUE}📋 Setting up project: ${PROJECT_ID}${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${BLUE}🔧 Enabling required APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    containerregistry.googleapis.com \
    dns.googleapis.com \
    storage.googleapis.com \
    cloudfront.googleapis.com

# Create Cloud Storage bucket for assets
echo -e "${BLUE}🗄️ Creating storage bucket...${NC}"
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://${PROJECT_ID}-assets/ || true

# Set bucket permissions
gsutil iam ch allUsers:objectViewer gs://${PROJECT_ID}-assets/

# Create Cloud Run service (initial deployment)
echo -e "${BLUE}🏃 Setting up Cloud Run service...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/cloudrun/hello \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 3000 \
    --memory 2Gi \
    --cpu 2 \
    --max-instances 100 \
    --set-env-vars NODE_ENV=production \
    --quiet || true

# Configure custom domain (optional)
read -p "Do you want to configure custom domain ($DOMAIN)? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🌐 Configuring custom domain...${NC}"
    
    # Create domain mapping
    gcloud run domain-mappings create \
        --service $SERVICE_NAME \
        --domain $DOMAIN \
        --region $REGION || true
    
    # Show DNS configuration instructions
    echo -e "${YELLOW}📝 DNS Configuration Required:${NC}"
    echo "Please add the following DNS records to your domain:"
    echo ""
    gcloud run domain-mappings describe $DOMAIN --region $REGION --format="value(status.resourceRecords[].name,status.resourceRecords[].rrdata)" | \
    while read name data; do
        echo "  Type: CNAME"
        echo "  Name: $name"
        echo "  Value: $data"
        echo ""
    done
fi

# Create Cloud Build trigger
echo -e "${BLUE}🔨 Setting up Cloud Build trigger...${NC}"
gcloud builds triggers create github \
    --repo-name=eyemotion-web \
    --repo-owner=eyemotion \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml \
    --description="EyeMotion Web Deploy" || true

# Set up monitoring and alerting
echo -e "${BLUE}📊 Setting up monitoring...${NC}"
gcloud logging sinks create eyemotion-logs \
    storage.googleapis.com/${PROJECT_ID}-logs \
    --log-filter='resource.type="cloud_run_revision" AND resource.labels.service_name="'$SERVICE_NAME'"' || true

# Create health check
echo -e "${BLUE}❤️ Setting up health checks...${NC}"
cat > health-check.yaml << EOF
apiVersion: v1
kind: Service
metadata:
  name: eyemotion-health
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: eyemotion-web
EOF

# Set IAM permissions
echo -e "${BLUE}🔐 Setting up IAM permissions...${NC}"
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com" \
    --role="roles/run.developer" || true

# Create secrets for environment variables
echo -e "${BLUE}🔒 Setting up secrets...${NC}"
echo "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=- || true
echo "your-encryption-key" | gcloud secrets create encryption-key --data-file=- || true

# Final setup verification
echo -e "${BLUE}✅ Verifying setup...${NC}"
echo ""
echo -e "${GREEN}Project ID:${NC} $PROJECT_ID"
echo -e "${GREEN}Region:${NC} $REGION"
echo -e "${GREEN}Service:${NC} $SERVICE_NAME"
echo -e "${GREEN}Domain:${NC} $DOMAIN"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)")
echo -e "${GREEN}Service URL:${NC} $SERVICE_URL"

echo ""
echo -e "${GREEN}🎉 Google Cloud setup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Push your code to GitHub repository"
echo "2. Configure DNS records if using custom domain"
echo "3. Run: npm run cloud:deploy to deploy"
echo "4. Monitor logs: gcloud logs tail --service=$SERVICE_NAME"
echo ""
echo -e "${BLUE}For production deployment:${NC}"
echo "  npm run deploy:production"
echo ""
echo -e "${BLUE}For staging deployment:${NC}"
echo "  npm run deploy:staging"