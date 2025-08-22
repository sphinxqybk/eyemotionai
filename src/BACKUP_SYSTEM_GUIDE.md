# EyeMotion Comprehensive Backup System Guide

## 🎬 Complete Backup Solution for EyeMotion Ecosystem

This guide covers the complete backup system for the EyeMotion Adaptive Visual Storytelling & Verification Ecosystem, including automated backups, restoration procedures, and disaster recovery.

---

## 📋 Table of Contents

1. [Backup System Overview](#backup-system-overview)
2. [Backup Types](#backup-types)
3. [Quick Start](#quick-start)
4. [Automated Backup Setup](#automated-backup-setup)
5. [Restoration Procedures](#restoration-procedures)
6. [Disaster Recovery](#disaster-recovery)
7. [Maintenance and Monitoring](#maintenance-and-monitoring)

---

## 🎯 Backup System Overview

The EyeMotion backup system provides comprehensive protection for:

### **What's Protected**
- ✅ **Complete source code** (React + TypeScript application)
- ✅ **Database schemas** (Supabase + PostgreSQL)
- ✅ **Configuration files** (Environment, deployment, monitoring)
- ✅ **Documentation** (Business plans, technical guides, legal docs)
- ✅ **Deployment scripts** (Production deployment automation)
- ✅ **Monitoring configs** (Health checks, alerting, analytics)
- ✅ **Assets and styles** (CSS, images, design system)
- ✅ **Business data** (User data, subscriptions, payments)

### **Backup Architecture**
```
EyeMotion Backup System
├── Full Backups (Complete snapshots)
├── Incremental Backups (Changed files only)
├── Database Backups (Schema + data)
└── Automated Management (Scheduling, cleanup, monitoring)
```

---

## 🔄 Backup Types

### 1. **Full Backup** (`complete-backup.sh`)
Complete snapshot of entire EyeMotion ecosystem.

**Includes:**
- All source code and components
- Database schemas and configurations
- Deployment scripts and documentation
- Environment templates and examples
- Monitoring and security configurations

**When to use:**
- Before major deployments
- Weekly automated backups
- Before significant code changes
- Milestone releases

**Execution:**
```bash
# Manual full backup
./scripts/complete-backup.sh

# Via backup manager
./scripts/backup-manager.sh full
```

### 2. **Incremental Backup** (`incremental-backup.sh`)
Backs up only files changed since last backup.

**Includes:**
- Modified source files
- Updated configurations
- New documentation
- Changed deployment scripts

**When to use:**
- Daily automated backups
- After development sessions
- Continuous protection during active development

**Execution:**
```bash
# Manual incremental backup
./scripts/incremental-backup.sh

# Via backup manager
./scripts/backup-manager.sh incremental
```

### 3. **Database Backup** (`database-backup.sh`)
Specialized backup for database and backend services.

**Includes:**
- Complete database schemas
- Data exports from key tables
- Edge function code
- Supabase configurations
- Connection and security settings

**When to use:**
- Before database migrations
- Every 6 hours (automated)
- Before major data operations
- User data protection

**Execution:**
```bash
# Manual database backup
./scripts/database-backup.sh

# Via backup manager
./scripts/backup-manager.sh database
```

---

## 🚀 Quick Start

### Step 1: Setup Backup System
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Initialize backup system
./scripts/backup-manager.sh status
```

### Step 2: Create Your First Backup
```bash
# Create complete backup
./scripts/backup-manager.sh full

# Check backup was created
./scripts/backup-manager.sh list
```

### Step 3: Test Restoration
```bash
# List available backups
./scripts/backup-manager.sh list

# Restore from backup
./scripts/backup-manager.sh restore eyemotion_backup_YYYYMMDD_HHMMSS
```

### Step 4: Setup Automation
```bash
# Setup automated backup schedule
./scripts/backup-manager.sh schedule
```

---

## ⚙️ Automated Backup Setup

### Automated Schedule
The backup system includes automated scheduling:

```bash
# Full backup: Sundays at 2:00 AM
0 2 * * 0 cd /path/to/eyemotion && ./scripts/backup-manager.sh full

# Incremental backup: Daily at 4:00 AM (Mon-Sat)
0 4 * * 1-6 cd /path/to/eyemotion && ./scripts/backup-manager.sh incremental

# Database backup: Every 6 hours
0 */6 * * * cd /path/to/eyemotion && ./scripts/backup-manager.sh database

# Cleanup: Saturdays at 1:00 AM
0 1 * * 6 cd /path/to/eyemotion && ./scripts/backup-manager.sh cleanup
```

### Setup Automation
```bash
# Install automated schedule
./scripts/backup-manager.sh schedule

# Verify cron jobs
crontab -l | grep eyemotion
```

### Monitoring Automated Backups
```bash
# Check backup logs
tail -f backups/logs/backup.log
tail -f backups/logs/cron.log

# Check backup status
./scripts/backup-manager.sh status
```

---

## 🔄 Restoration Procedures

### Quick Restoration (Using restore script)
```bash
# List available backups
./scripts/backup-manager.sh list

# Restore using backup manager
./scripts/backup-manager.sh restore [backup-name]

# Example
./scripts/backup-manager.sh restore eyemotion_backup_20241214_150230
```

### Manual Restoration Steps

#### From Full Backup
```bash
# Navigate to backup directory
cd backups/full/eyemotion_backup_YYYYMMDD_HHMMSS

# Run restoration script
./restore-eyemotion.sh /path/to/restore/location

# Or manual steps
cp -r 01_source_code/* /path/to/restore/
cp -r 02_configurations/* /path/to/restore/
cp -r 03_database_schemas/* /path/to/restore/
# ... continue for all directories
```

#### From Database Backup
```bash
# Navigate to database backup
cd backups/database/eyemotion_database_backup_YYYYMMDD_HHMMSS

# Restore database schema
supabase db push

# Import data
psql -f data_exports/subscription_plans.sql
psql -f data_exports/ai_models.sql
# ... continue for all data files

# Deploy edge functions
supabase functions deploy
```

### Post-Restoration Checklist
- [ ] **Environment Setup**: Configure .env.production with actual values
- [ ] **Dependencies**: Run `npm install`
- [ ] **Build**: Run `npm run build`
- [ ] **Database**: Verify database connectivity
- [ ] **Deploy**: Run deployment script if needed
- [ ] **Test**: Verify all functionality works
- [ ] **Monitor**: Check health endpoints

---

## 🆘 Disaster Recovery

### Complete System Recovery

#### Scenario 1: Server Failure
```bash
# 1. Setup new server environment
# 2. Install required tools (Node.js, npm, etc.)
# 3. Restore from latest full backup
./scripts/backup-manager.sh restore [latest-full-backup]

# 4. Configure environment
cp config/production.env.template .env.production
# Edit .env.production with actual values

# 5. Deploy to production
./deploy-production-eyemotionai.sh
```

#### Scenario 2: Database Corruption
```bash
# 1. Create new Supabase project
# 2. Restore from latest database backup
cd backups/database/[latest-database-backup]

# 3. Deploy schema
supabase db push

# 4. Import data
psql -f data_exports/*.sql

# 5. Update connection strings in application
```

#### Scenario 3: Code Repository Loss
```bash
# 1. Initialize new repository
git init

# 2. Restore from full backup
./scripts/backup-manager.sh restore [latest-full-backup]

# 3. Add files to git
git add .
git commit -m "Restore from backup - $(date)"

# 4. Push to new remote
git remote add origin [new-repo-url]
git push -u origin main
```

### Recovery Time Objectives (RTO)
- **Full System Recovery**: 2-4 hours
- **Database Recovery**: 30-60 minutes
- **Application Recovery**: 1-2 hours
- **Configuration Recovery**: 15-30 minutes

### Recovery Point Objectives (RPO)
- **Code Changes**: Maximum 4 hours data loss
- **Database**: Maximum 6 hours data loss
- **Configurations**: Maximum 24 hours data loss

---

## 🔧 Maintenance and Monitoring

### Regular Maintenance Tasks

#### Daily
```bash
# Check backup status
./scripts/backup-manager.sh status

# Review backup logs
tail -20 backups/logs/backup.log
```

#### Weekly
```bash
# Test restoration process
./scripts/backup-manager.sh restore [recent-backup] --test

# Cleanup old backups
./scripts/backup-manager.sh cleanup

# Verify backup integrity
find backups -name "*.sh" -exec bash -n {} \;
```

#### Monthly
```bash
# Full disaster recovery test
# Create test environment and restore complete system

# Review and update backup retention policy
# Update backup-manager.sh if needed

# Review storage usage
du -sh backups/
```

### Monitoring and Alerting

#### Backup Health Checks
```bash
# Create monitoring script
cat > scripts/backup-health-check.sh << 'EOF'
#!/bin/bash

# Check if backups are recent
LAST_FULL=$(find backups/full -name "eyemotion_backup_*" -mtime -7 | wc -l)
LAST_INCREMENTAL=$(find backups/incremental -name "eyemotion_incremental_*" -mtime -1 | wc -l)
LAST_DATABASE=$(find backups/database -name "eyemotion_database_backup_*" -mtime -1 | wc -l)

if [ "$LAST_FULL" -eq 0 ]; then
    echo "WARNING: No full backup in last 7 days"
fi

if [ "$LAST_INCREMENTAL" -eq 0 ]; then
    echo "WARNING: No incremental backup in last 24 hours"
fi

if [ "$LAST_DATABASE" -eq 0 ]; then
    echo "WARNING: No database backup in last 24 hours"
fi
EOF

chmod +x scripts/backup-health-check.sh
```

#### Integration with Monitoring System
```bash
# Add to monitoring config
echo "
  - name: \"Backup System Health\"
    url: \"file://$(pwd)/scripts/backup-health-check.sh\"
    method: \"EXEC\"
    interval: \"1h\"
    expected_output: \"All backups current\"
" >> monitoring/production-monitoring.yaml
```

### Storage Management

#### Backup Storage Optimization
```bash
# Compress old backups
find backups -name "eyemotion_*" -mtime +30 -type d | while read dir; do
    tar -czf "${dir}.tar.gz" "$dir"
    rm -rf "$dir"
done

# Monitor storage usage
df -h backups/
du -sh backups/*
```

#### Cloud Storage Integration
```bash
# Sync to cloud storage (example with AWS S3)
aws s3 sync backups/ s3://eyemotion-backups/$(date +%Y%m%d)/

# Or Google Cloud Storage
gsutil -m rsync -r backups/ gs://eyemotion-backups/$(date +%Y%m%d)/
```

---

## 📊 Backup System Commands Reference

### Backup Manager Commands
```bash
# Create backups
./scripts/backup-manager.sh full              # Complete backup
./scripts/backup-manager.sh incremental       # Incremental backup
./scripts/backup-manager.sh database          # Database backup

# Manage backups
./scripts/backup-manager.sh list              # List all backups
./scripts/backup-manager.sh status            # System status
./scripts/backup-manager.sh cleanup           # Remove old backups

# Restoration
./scripts/backup-manager.sh restore [name]    # Restore from backup

# Automation
./scripts/backup-manager.sh schedule          # Setup automation
```

### Individual Backup Scripts
```bash
# Direct execution
./scripts/complete-backup.sh                  # Full backup
./scripts/incremental-backup.sh               # Incremental backup
./scripts/database-backup.sh                  # Database backup
```

### Utility Commands
```bash
# Make all scripts executable
chmod +x scripts/*.sh

# Check script syntax
bash -n scripts/backup-manager.sh

# Test restoration without executing
./restore-eyemotion.sh --dry-run
```

---

## 🔒 Security and Best Practices

### Security Guidelines
1. **Environment Variables**: Never backup actual secrets, only templates
2. **Access Control**: Limit backup directory access to authorized users
3. **Encryption**: Consider encrypting sensitive backups
4. **Offsite Storage**: Store backups in multiple locations
5. **Regular Testing**: Test restoration procedures regularly

### Best Practices
1. **Automated Testing**: Include backup verification in CI/CD
2. **Documentation**: Keep backup procedures documented and updated
3. **Monitoring**: Monitor backup success/failure rates
4. **Retention**: Balance storage costs with recovery needs
5. **Training**: Ensure team knows restoration procedures

---

## 📞 Support and Troubleshooting

### Common Issues

#### Backup Script Fails
```bash
# Check script permissions
ls -la scripts/
chmod +x scripts/*.sh

# Check disk space
df -h

# Check logs
tail -50 backups/logs/backup.log
```

#### Restoration Issues
```bash
# Verify backup integrity
find [backup-directory] -name "App.tsx"
find [backup-directory] -name "package.json"

# Check for missing dependencies
npm install
```

#### Database Restoration Problems
```bash
# Check Supabase connection
supabase status

# Verify database schema
supabase db diff

# Test connection
psql $SUPABASE_DB_URL -c "SELECT 1;"
```

### Getting Help
- **Technical Issues**: dev@eyemotionai.com
- **Emergency Recovery**: admin@eyemotionai.com
- **Documentation**: See individual backup manifests
- **Community**: EyeMotion developer community

---

## 📈 Backup System Metrics

### Success Metrics
- **Backup Success Rate**: >99% successful backups
- **Recovery Time**: <4 hours for full system recovery
- **Storage Efficiency**: <10GB per full backup
- **Automation Reliability**: 100% scheduled backup execution

### Monitoring Dashboard
Create monitoring dashboard to track:
- Backup frequency and success rates
- Storage usage trends
- Recovery testing results
- System health metrics

---

**🎬 EyeMotion Backup System - Complete Protection for Your Adaptive Visual Storytelling Ecosystem**

---

*Last Updated: $(date)*
*Version: 1.0.0*
*Status: ✅ Production Ready*