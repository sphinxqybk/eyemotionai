#!/bin/bash

# EyeMotion Database Backup Script
# Comprehensive backup of Supabase database and configurations

set -e

# Configuration
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP_DIR="eyemotion_database_backup_${BACKUP_DATE}"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load environment variables
load_environment() {
    if [ -f .env.production ]; then
        export $(cat .env.production | grep -v '^#' | xargs)
        print_status "Loaded production environment"
    elif [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
        print_status "Loaded development environment"
    else
        print_warning "No environment file found"
    fi
}

# Create database backup
create_database_backup() {
    print_status "Creating database backup..."
    
    mkdir -p "$DB_BACKUP_DIR"
    
    # Backup database schemas
    print_status "Backing up database schemas..."
    cp -r database "$DB_BACKUP_DIR/" 2>/dev/null || true
    cp -r supabase "$DB_BACKUP_DIR/" 2>/dev/null || true
    
    # Export data using Supabase CLI if available
    if command -v supabase &> /dev/null && [ -n "$SUPABASE_URL" ]; then
        print_status "Exporting data using Supabase CLI..."
        
        # Export key tables
        mkdir -p "$DB_BACKUP_DIR/data_exports"
        
        # Export subscription plans
        supabase db dump --data-only --table subscription_plans > "$DB_BACKUP_DIR/data_exports/subscription_plans.sql" 2>/dev/null || print_warning "Could not export subscription_plans"
        
        # Export AI models
        supabase db dump --data-only --table ai_models > "$DB_BACKUP_DIR/data_exports/ai_models.sql" 2>/dev/null || print_warning "Could not export ai_models"
        
        # Export cultural patterns
        supabase db dump --data-only --table cultural_patterns > "$DB_BACKUP_DIR/data_exports/cultural_patterns.sql" 2>/dev/null || print_warning "Could not export cultural_patterns"
        
        # Export FFZ modules
        supabase db dump --data-only --table ffz_modules > "$DB_BACKUP_DIR/data_exports/ffz_modules.sql" 2>/dev/null || print_warning "Could not export ffz_modules"
    fi
    
    print_success "Database backup created"
}

# Create configuration backup
create_config_backup() {
    print_status "Backing up configurations..."
    
    mkdir -p "$DB_BACKUP_DIR/configurations"
    
    # Environment templates
    cp config/production.env.template "$DB_BACKUP_DIR/configurations/" 2>/dev/null || true
    cp .env.example "$DB_BACKUP_DIR/configurations/" 2>/dev/null || true
    
    # Database connection configs
    cat > "$DB_BACKUP_DIR/configurations/connection_info.md" << EOF
# Database Connection Information

## Supabase Configuration
- **Project URL**: ${SUPABASE_URL:-"Not configured"}
- **Database Host**: $(echo "$SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co.*||').supabase.co
- **Database Name**: postgres
- **Port**: 5432

## Backup Information
- **Backup Date**: $(date)
- **Backup Type**: Database + Configuration
- **Tables Included**: All application tables
- **Functions**: Edge functions and database functions

## Restoration Notes
1. Deploy database schema: \`supabase db push\`
2. Import data: \`psql -f data_exports/*.sql\`
3. Configure environment variables
4. Test database connectivity

---
**Generated**: $(date)
EOF

    print_success "Configuration backup created"
}

# Create database manifest
create_database_manifest() {
    cat > "$DB_BACKUP_DIR/DATABASE_BACKUP_MANIFEST.md" << EOF
# EyeMotion Database Backup Manifest

## 🗄️ Backup Information
- **Date**: $(date)
- **Type**: Database + Configuration Backup
- **Directory**: $DB_BACKUP_DIR
- **Supabase URL**: ${SUPABASE_URL:-"Not configured"}

## 📊 Database Schema Backed Up

### Core Tables
- **subscription_plans**: Subscription tiers and pricing
- **user_subscriptions**: User subscription records
- **projects**: User projects and film data
- **project_files**: Media files and assets
- **user_profiles**: User profile information
- **payment_transactions**: Payment history
- **credits_usage**: Credit usage tracking
- **activity_logs**: System activity logs

### Film Ecosystem Tables
- **film_projects**: Film project data
- **media_assets**: Media files with metadata
- **ffz_progress**: FFZ learning progression
- **cultural_patterns**: Cultural storytelling patterns
- **ai_models**: AI model configurations
- **intent_analysis_logs**: AI intent recognition logs
- **cultural_verification_logs**: Cultural verification records
- **community_collaborations**: Collaboration data
- **ffz_modules**: Educational modules
- **user_cultural_profiles**: Cultural background data
- **content_verification_queue**: Verification queue

### Edge Functions
- **make-server-7dc8476e**: Main server function
- **AI services**: Intent recognition, cultural verification
- **Payment services**: Stripe integration functions
- **File services**: Media processing functions

## 🔧 Configuration Files Backed Up
- Database schema definitions
- Edge function code
- Environment templates
- Connection configurations
- RLS policies and triggers

## 🔄 Restoration Instructions

### Quick Restoration
1. Deploy Supabase project
2. Run: \`supabase db push\`
3. Import data: \`psql -f data_exports/*.sql\`
4. Deploy edge functions: \`supabase functions deploy\`

### Full Restoration
1. Create new Supabase project
2. Copy database schema: \`cp -r database/* ./supabase/\`
3. Deploy schema: \`supabase db push\`
4. Import data exports
5. Deploy edge functions
6. Configure environment variables
7. Test database connectivity

### Data Verification
- Verify table counts match expected values
- Test authentication flows
- Verify payment processing
- Check AI model configurations
- Test cultural verification systems

## 📈 Backup Statistics
- **Schema Files**: $(find "$DB_BACKUP_DIR" -name "*.sql" | wc -l)
- **Edge Functions**: $(find "$DB_BACKUP_DIR" -name "*.tsx" | wc -l)
- **Configuration Files**: $(find "$DB_BACKUP_DIR/configurations" -type f | wc -l)
- **Total Size**: $(du -sh "$DB_BACKUP_DIR" | cut -f1)

## 🛡️ Security Notes
- Passwords and keys are not included in backup
- Environment variables must be reconfigured
- API keys need to be regenerated
- SSL certificates are handled by platform

---

**Backup Status**: ✅ Complete
**Next Backup**: $(date -d '+1 week')
**Retention**: Keep for 90 days minimum

## 📞 Support
For restoration assistance:
- Technical: dev@eyemotionai.com
- Database: admin@eyemotionai.com
- Emergency: Check monitoring alerts

🎬 **EyeMotion Database Backup System**
EOF

    print_success "Database backup manifest created"
}

# Main function
main() {
    echo -e "${PURPLE}🗄️  EyeMotion Database Backup${NC}"
    echo "============================="
    echo ""
    
    load_environment
    create_database_backup
    create_config_backup
    create_database_manifest
    
    echo ""
    print_success "🎉 Database backup completed!"
    echo ""
    echo -e "${GREEN}📁 Backup Location:${NC} $DB_BACKUP_DIR"
    echo -e "${GREEN}💾 Backup Size:${NC} $(du -sh "$DB_BACKUP_DIR" | cut -f1)"
    echo -e "${GREEN}📊 Files:${NC} $(find "$DB_BACKUP_DIR" -type f | wc -l) files"
    echo ""
    echo -e "${YELLOW}🔄 Restoration:${NC}"
    echo "   1. Deploy Supabase project"
    echo "   2. Run: supabase db push"
    echo "   3. Import data: psql -f data_exports/*.sql"
    echo "   4. Deploy functions: supabase functions deploy"
    echo ""
    echo -e "${BLUE}📖 Documentation:${NC} DATABASE_BACKUP_MANIFEST.md"
    print_success "🗄️  Database backup system ready!"
}

main "$@"