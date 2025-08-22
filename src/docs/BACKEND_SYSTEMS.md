# EyeMotion Backend Systems Documentation

## 📋 Overview

EyeMotion Professional AI Film Ecosystem backend is a comprehensive, production-ready system built on Supabase with Deno Edge Functions. It provides authentication, payment processing, file management, and complete data backup/monitoring capabilities.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Edge Functions │    │   Database      │
│   (React/TS)    │───▶│   (Deno/Hono)    │───▶│   (PostgreSQL)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Supabase       │
                       │   Storage        │
                       └──────────────────┘
```

## 🗂️ Backend Components

### 1. Core Server (`/supabase/functions/server/`)

#### Main Entry Point
- **File**: `index.tsx`
- **Purpose**: Main Hono server with all routes and middleware
- **Features**: CORS, logging, error handling, route organization

#### Authentication Service
- **File**: `auth-service.tsx`
- **Features**:
  - User registration with profile creation
  - Email/password authentication
  - OAuth (Google, GitHub) integration
  - JWT token management
  - Profile management
  - Account deletion

#### Database Management
- **File**: `database-setup.tsx`
- **Features**:
  - Schema creation and migration
  - User profile management
  - Project and file tracking
  - Analytics and health checks

#### Payment Processing
- **File**: `payment-service.tsx`
- **Features**:
  - Stripe integration
  - Subscription management
  - Credit purchasing
  - Webhook handling
  - Payment history tracking

#### File Management
- **File**: `file-service.tsx`
- **Features**:
  - Supabase Storage integration
  - Upload URL generation
  - File processing pipeline
  - Storage bucket management
  - Usage tracking

#### Admin Dashboard
- **File**: `admin-service.tsx`
- **Features**:
  - User management
  - Financial analytics
  - System health monitoring
  - Access control

#### KV Store
- **File**: `kv_store.tsx`
- **Purpose**: Key-value storage interface for configuration and caching
- **Operations**: get, set, del, mget, mset, mdel, getByPrefix

### 2. Database Schema (`/database/`)

#### Core Tables

**User Profiles**
```sql
- id (UUID, references auth.users)
- full_name, company_name, industry, country
- role (user/admin/super_admin)
- preferences (JSONB)
- timestamps and metadata
```

**Subscription Plans**
```sql
- id, name, display_name, description
- price (in satang), currency, billing_interval
- credits_included, storage_gb
- features (JSONB array)
- stripe_price_id
```

**User Subscriptions**
```sql
- user_id, plan_id
- stripe_subscription_id, stripe_customer_id
- status, billing periods
- credits tracking (included, used, extra)
- storage usage tracking
```

**Projects**
```sql
- user_id, name, description, type
- status (draft/in_progress/review/completed/archived)
- settings, collaboration_settings (JSONB)
- file_count, total_duration, export_count
- timestamps
```

**Project Files**
```sql
- project_id, user_id
- filename, file_type, file_size
- storage_path, thumbnail_url
- video metadata (duration, resolution, fps, codec)
- processing_status
- credits_cost, tags
```

**Payment Transactions**
```sql
- user_id, stripe_payment_intent_id
- amount, currency, status
- transaction_type (subscription/credit_purchase/one_time/refund)
- invoice_url, receipt_url
- metadata (JSONB)
```

**Credits Usage**
```sql
- user_id, subscription_id
- credits_used, action, resource_type
- resource_id, details (JSONB)
- timestamp tracking
```

**Activity Logs**
```sql
- user_id, action, resource_type, resource_id
- details (JSONB), ip_address, user_agent
- session_id, timestamp
- Auto-cleanup (90 days retention)
```

### 3. Management Scripts (`/scripts/`)

#### Backend Backup System
- **File**: `backend-backup.tsx`
- **Features**:
  - Complete system backup (database, KV store, storage)
  - Automated backup scheduling
  - Backup restoration
  - Backup health monitoring
  - Compression and metadata tracking

#### Health Monitoring
- **File**: `health-monitor.tsx`
- **Features**:
  - Real-time component health checking
  - Performance metrics tracking
  - Alert generation and management
  - Health history tracking
  - Automated monitoring with configurable intervals

#### Initialization Tool
- **File**: `init-backend.tsx`
- **Features**:
  - Complete backend setup automation
  - Environment validation
  - Database schema creation
  - Storage bucket initialization
  - Health verification
  - CLI interface for management

## 🚀 Getting Started

### Prerequisites

```bash
# Required Environment Variables
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (for full functionality)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
OPENAI_API_KEY=your_openai_key
```

### Installation & Setup

1. **Clone and Setup Environment**
```bash
git clone <repository>
cd eyemotion
cp .env.example .env
# Edit .env with your values
```

2. **Initialize Backend**
```bash
# Complete initialization
deno run --allow-net --allow-env --allow-write scripts/init-backend.tsx init

# Or individual components
deno run --allow-net --allow-env scripts/init-backend.tsx health
deno run --allow-net --allow-env scripts/init-backend.tsx backup
```

3. **Deploy Edge Functions**
```bash
# Deploy to Supabase
supabase functions deploy server

# Test deployment
curl https://your-project.supabase.co/functions/v1/make-server-7dc8476e/health
```

### Development Workflow

1. **Local Development**
```bash
# Start Supabase locally
supabase start

# Serve functions locally
supabase functions serve --env-file .env

# Run health check
deno run --allow-net --allow-env scripts/init-backend.tsx health
```

2. **Testing**
```bash
# Test health endpoint
curl http://localhost:8000/make-server-7dc8476e/health

# Test authentication
curl -X POST http://localhost:8000/make-server-7dc8476e/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","fullName":"Test User"}'
```

## 📊 Monitoring & Maintenance

### Health Monitoring

The system includes comprehensive health monitoring:

```typescript
// Start continuous monitoring (every 5 minutes)
import { startMonitoring } from './scripts/health-monitor.tsx';
startMonitoring(5);

// Get current health status
const health = await performHealthCheck();
console.log(health.overall); // 'healthy' | 'warning' | 'critical'
```

### Backup Management

Automated backup system with multiple strategies:

```typescript
// Create full backup
const backup = await createFullBackup();

// List available backups
const backups = await listBackups();

// Restore from backup
await restoreFromBackup('backup:full:2024-01-01T00:00:00.000Z');
```

### Performance Monitoring

Key metrics tracked:
- **Response Times**: All API endpoints
- **Database Performance**: Query execution times
- **Storage Usage**: File storage and bandwidth
- **Error Rates**: Component-specific error tracking
- **User Activity**: Authentication and usage patterns

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based authentication** with Supabase Auth
- **Row Level Security (RLS)** on all database tables
- **Role-based access control** (user/admin/super_admin)
- **OAuth integration** with major providers
- **Session management** with automatic refresh

### Data Protection
- **Encrypted storage** via Supabase
- **Environment variable protection** for secrets
- **API key management** with proper scoping
- **Audit logging** for all user actions
- **GDPR compliance** with account deletion

### Payment Security
- **PCI compliance** via Stripe
- **Webhook signature verification**
- **Secure token handling**
- **Fraud detection** integration
- **Subscription security** with proper validation

## 📈 Scalability Features

### Database Optimization
- **Proper indexing** on all frequently queried columns
- **Partitioning** for large tables (activity_logs)
- **Connection pooling** via Supabase
- **Query optimization** with explain plans
- **Automated cleanup** for old data

### Storage Management
- **CDN integration** via Supabase Storage
- **File compression** and optimization
- **Bandwidth monitoring**
- **Storage quotas** per subscription tier
- **Automatic file lifecycle management**

### Performance Optimization
- **Edge function deployment** for global performance
- **Caching strategies** via KV store
- **Database query optimization**
- **API response compression**
- **Resource usage monitoring**

## 🛠️ API Reference

### Authentication Endpoints

```typescript
POST /make-server-7dc8476e/auth/register
POST /make-server-7dc8476e/auth/signin
POST /make-server-7dc8476e/auth/oauth/:provider
GET  /make-server-7dc8476e/auth/me
PUT  /make-server-7dc8476e/auth/profile
POST /make-server-7dc8476e/auth/signout
```

### Payment Endpoints

```typescript
POST /make-server-7dc8476e/payments/checkout
POST /make-server-7dc8476e/payments/credits
POST /make-server-7dc8476e/payments/cancel
GET  /make-server-7dc8476e/payments/history
POST /make-server-7dc8476e/payments/webhook
```

### Project & File Management

```typescript
POST /make-server-7dc8476e/projects
GET  /make-server-7dc8476e/projects/:id/files
POST /make-server-7dc8476e/files/upload-url
POST /make-server-7dc8476e/files/:id/confirm
```

### Admin Endpoints

```typescript
GET /make-server-7dc8476e/admin/dashboard
GET /make-server-7dc8476e/admin/users
GET /make-server-7dc8476e/admin/analytics/financial
GET /make-server-7dc8476e/admin/system
```

### System Management

```typescript
GET  /make-server-7dc8476e/health
POST /make-server-7dc8476e/init/database
POST /make-server-7dc8476e/init/storage
POST /make-server-7dc8476e/init/plans
POST /make-server-7dc8476e/init/complete
```

## 🔧 Configuration

### Subscription Plans

Default plans configured automatically:

```typescript
{
  freemium: { price: 0, credits: 100, storage: 1GB },
  creator: { price: 299, credits: 1000, storage: 5GB },
  pro: { price: 999, credits: 5000, storage: 50GB },
  studio: { price: 2999, credits: 20000, storage: 500GB }
}
```

### Feature Flags

Configurable via KV store:

```typescript
{
  authEnabled: true,
  paymentsEnabled: true,
  storageEnabled: true,
  analyticsEnabled: true,
  backupEnabled: true
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
```bash
# Check configuration
deno run --allow-env scripts/init-backend.tsx health
```

2. **Database Connection Issues**
```bash
# Verify database health
curl https://your-project.supabase.co/functions/v1/make-server-7dc8476e/health
```

3. **Storage Permission Issues**
```bash
# Reinitialize storage buckets
deno run --allow-net --allow-env scripts/init-backend.tsx init
```

4. **Payment Webhook Issues**
```bash
# Verify webhook endpoint
curl -X POST https://your-project.supabase.co/functions/v1/make-server-7dc8476e/payments/webhook \
  -H "stripe-signature: test" \
  -d "test payload"
```

### Health Check Diagnostics

```typescript
// Generate comprehensive health report
const report = await generateHealthReport();
console.log(report);

// Check specific component
const dbHealth = await checkDatabaseHealth();
if (dbHealth.status !== 'healthy') {
  console.log('Database issues:', dbHealth.errors);
}
```

## 📞 Support

For additional support:
- **Health Monitoring**: Built-in health checks and alerts
- **Backup System**: Automatic data protection
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Real-time system monitoring

---

**EyeMotion Professional AI Film Ecosystem**  
Backend Systems Documentation v1.0.0