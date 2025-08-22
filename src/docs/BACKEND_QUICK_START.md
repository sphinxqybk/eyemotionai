# EyeMotion Backend Quick Start Guide

## 🚀 5-Minute Setup

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Required variables (get from Supabase dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 2. One-Command Initialization
```bash
# Complete backend setup
deno run --allow-net --allow-env --allow-write scripts/init-backend.tsx init
```

### 3. Verify Installation
```bash
# Check system health
deno run --allow-net --allow-env scripts/init-backend.tsx health

# Expected output: "Overall status: HEALTHY"
```

## 🛠️ Essential Commands

### Backend Management
```bash
# Complete initialization
deno run --allow-net --allow-env --allow-write scripts/init-backend.tsx init

# Health check only
deno run --allow-net --allow-env scripts/init-backend.tsx health

# Create backup
deno run --allow-net --allow-env scripts/init-backend.tsx backup

# Start monitoring
deno run --allow-net --allow-env scripts/init-backend.tsx monitor

# Generate report
deno run --allow-net --allow-env scripts/init-backend.tsx report
```

### Local Development
```bash
# Start Supabase locally
supabase start

# Serve functions locally  
supabase functions serve --env-file .env

# Deploy to production
supabase functions deploy server
```

## 📊 Quick Health Check

### Test Backend Health
```bash
# Local development
curl http://localhost:8000/make-server-7dc8476e/health

# Production
curl https://your-project.supabase.co/functions/v1/make-server-7dc8476e/health
```

### Expected Response
```json
{
  "status": "healthy",
  "service": "eyemotion-backend",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "database": "healthy",
  "uptime": 12345
}
```

## 🔧 Common Tasks

### User Registration Test
```bash
curl -X POST http://localhost:8000/make-server-7dc8476e/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "companyName": "Test Company"
  }'
```

### Database Tables Check
```sql
-- Connect to your Supabase database and verify tables exist:
\dt

-- Should show:
-- user_profiles
-- subscription_plans  
-- user_subscriptions
-- projects
-- project_files
-- payment_transactions
-- credits_usage
-- activity_logs
-- kv_store_7dc8476e
```

### Storage Buckets Check
```bash
# Check if storage buckets are created
curl -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  "https://your-project.supabase.co/storage/v1/bucket"
```

## 🚨 Troubleshooting

### Issue: Environment Variables Missing
```bash
# Solution: Check environment
deno run --allow-env -e "console.log('SUPABASE_URL:', Deno.env.get('SUPABASE_URL'))"

# If undefined, check .env file and reload environment
```

### Issue: Database Connection Failed
```bash
# Solution: Verify Supabase credentials
curl -H "apikey: YOUR_ANON_KEY" \
  "https://your-project.supabase.co/rest/v1/"

# Should return API documentation
```

### Issue: Functions Not Deploying
```bash
# Solution: Check Supabase CLI
supabase --version

# Login and link project
supabase login
supabase link --project-ref your-project-ref

# Deploy again
supabase functions deploy server
```

### Issue: Permission Errors
```bash
# Solution: Check service role key has proper permissions
# Go to Supabase Dashboard > Settings > API
# Verify SERVICE_ROLE_KEY is correct
```

## 📈 Monitoring Dashboard

### Quick Health Overview
```typescript
// Check overall system health
import { performHealthCheck } from './scripts/health-monitor.tsx';

const health = await performHealthCheck();
console.log(`Status: ${health.overall}`);
console.log(`Response Time: ${health.metrics.responseTime}ms`);
console.log(`Components: ${Object.keys(health.components).length}`);
```

### Component Status Check
```typescript
// Check specific components
const components = health.components;
console.log(`Database: ${components.database.status}`);
console.log(`Auth: ${components.auth.status}`);
console.log(`Storage: ${components.storage.status}`);
console.log(`Payments: ${components.payments.status}`);
```

## 💾 Backup & Recovery

### Create Backup
```typescript
import { createFullBackup } from './scripts/backend-backup.tsx';

const backup = await createFullBackup();
if (backup.success) {
  console.log(`Backup created: ${backup.data.metadata.totalSize}`);
}
```

### List Backups
```typescript
import { listBackups } from './scripts/backend-backup.tsx';

const backups = await listBackups();
backups.backups.forEach(b => {
  console.log(`${b.timestamp}: ${b.totalSize}`);
});
```

### Restore Backup
```typescript
import { restoreFromBackup } from './scripts/backend-backup.tsx';

// Restore latest backup
await restoreFromBackup();

// Restore specific backup
await restoreFromBackup('backup:full:2024-01-01T00:00:00.000Z');
```

## 🔐 Security Checklist

### ✅ Environment Security
- [ ] Service role key not exposed in frontend
- [ ] Environment variables properly configured  
- [ ] CORS settings restrictive for production
- [ ] API keys rotated regularly

### ✅ Database Security
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Proper user permissions configured
- [ ] Admin access restricted
- [ ] Audit logging enabled

### ✅ Authentication Security
- [ ] JWT tokens properly validated
- [ ] OAuth providers configured securely
- [ ] Password policies enforced
- [ ] Session management secure

## 📞 Getting Help

### Logs & Debugging
```bash
# View Supabase logs
supabase logs

# View function logs
supabase functions logs server

# View database logs
supabase db logs
```

### Health Report Generation
```bash
# Generate comprehensive report
deno run --allow-net --allow-env scripts/init-backend.tsx report

# Output saved to /tmp/eyemotion-report-[timestamp].txt
```

### Support Resources
- **Documentation**: `/docs/BACKEND_SYSTEMS.md`
- **API Reference**: Built-in endpoint documentation
- **Health Monitoring**: Real-time system status
- **Error Logging**: Comprehensive error tracking

---

**EyeMotion Professional AI Film Ecosystem**  
Backend Quick Start Guide v1.0.0

*Ready to build amazing film experiences! 🎬*