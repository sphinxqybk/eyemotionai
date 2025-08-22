#!/bin/bash

# EyeMotion Backup Manager
# Centralized backup management system

set -e

# Configuration
BACKUP_ROOT="backups"
RETENTION_DAYS=90
MAX_BACKUPS=50

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                🎬 EyeMotion Backup Manager                   ║${NC}"
    echo -e "${PURPLE}║            Comprehensive Backup Management System           ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

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

print_section() {
    echo -e "${CYAN}━━━ $1 ━━━${NC}"
}

# Show usage
show_usage() {
    echo "EyeMotion Backup Manager Usage:"
    echo ""
    echo "Commands:"
    echo "  full              Create complete project backup"
    echo "  incremental       Create incremental backup"
    echo "  database          Create database-only backup"
    echo "  list              List all available backups"
    echo "  cleanup           Remove old backups"
    echo "  restore <backup>  Restore from specific backup"
    echo "  status            Show backup system status"
    echo "  schedule          Setup automated backups"
    echo ""
    echo "Examples:"
    echo "  ./backup-manager.sh full"
    echo "  ./backup-manager.sh restore eyemotion_backup_20241214_150230"
    echo "  ./backup-manager.sh list"
    echo ""
}

# Initialize backup system
init_backup_system() {
    print_status "Initializing backup system..."
    
    # Create backup directories
    mkdir -p "$BACKUP_ROOT"/{full,incremental,database,logs}
    
    # Create backup log
    touch "$BACKUP_ROOT/logs/backup.log"
    
    # Create backup registry
    if [ ! -f "$BACKUP_ROOT/backup_registry.json" ]; then
        cat > "$BACKUP_ROOT/backup_registry.json" << 'EOF'
{
  "version": "1.0.0",
  "backups": [],
  "last_full_backup": null,
  "last_incremental_backup": null,
  "last_database_backup": null,
  "retention_days": 90,
  "max_backups": 50
}
EOF
    fi
    
    print_success "Backup system initialized"
}

# Log backup operation
log_backup() {
    local backup_type=$1
    local backup_name=$2
    local status=$3
    local size=$4
    
    echo "[$(date)] $backup_type backup: $backup_name - $status - Size: $size" >> "$BACKUP_ROOT/logs/backup.log"
}

# Create full backup
create_full_backup() {
    print_section "Creating Full Backup"
    
    if [ ! -f "scripts/complete-backup.sh" ]; then
        print_error "Complete backup script not found"
        return 1
    fi
    
    # Run complete backup
    cd scripts
    ./complete-backup.sh
    cd ..
    
    # Move to backup directory
    BACKUP_NAME=$(ls -t | grep "eyemotion_backup_" | head -1)
    if [ -n "$BACKUP_NAME" ]; then
        mv "$BACKUP_NAME" "$BACKUP_ROOT/full/"
        BACKUP_SIZE=$(du -sh "$BACKUP_ROOT/full/$BACKUP_NAME" | cut -f1)
        log_backup "FULL" "$BACKUP_NAME" "SUCCESS" "$BACKUP_SIZE"
        print_success "Full backup created: $BACKUP_NAME"
        
        # Update registry
        update_backup_registry "full" "$BACKUP_NAME"
    fi
}

# Create incremental backup
create_incremental_backup() {
    print_section "Creating Incremental Backup"
    
    if [ ! -f "scripts/incremental-backup.sh" ]; then
        print_error "Incremental backup script not found"
        return 1
    fi
    
    # Run incremental backup
    cd scripts
    ./incremental-backup.sh
    cd ..
    
    # Move to backup directory
    BACKUP_NAME=$(ls -t | grep "eyemotion_incremental_" | head -1)
    if [ -n "$BACKUP_NAME" ]; then
        mv "$BACKUP_NAME" "$BACKUP_ROOT/incremental/"
        BACKUP_SIZE=$(du -sh "$BACKUP_ROOT/incremental/$BACKUP_NAME" | cut -f1)
        log_backup "INCREMENTAL" "$BACKUP_NAME" "SUCCESS" "$BACKUP_SIZE"
        print_success "Incremental backup created: $BACKUP_NAME"
        
        # Update registry
        update_backup_registry "incremental" "$BACKUP_NAME"
    fi
}

# Create database backup
create_database_backup() {
    print_section "Creating Database Backup"
    
    if [ ! -f "scripts/database-backup.sh" ]; then
        print_error "Database backup script not found"
        return 1
    fi
    
    # Run database backup
    cd scripts
    ./database-backup.sh
    cd ..
    
    # Move to backup directory
    BACKUP_NAME=$(ls -t | grep "eyemotion_database_backup_" | head -1)
    if [ -n "$BACKUP_NAME" ]; then
        mv "$BACKUP_NAME" "$BACKUP_ROOT/database/"
        BACKUP_SIZE=$(du -sh "$BACKUP_ROOT/database/$BACKUP_NAME" | cut -f1)
        log_backup "DATABASE" "$BACKUP_NAME" "SUCCESS" "$BACKUP_SIZE"
        print_success "Database backup created: $BACKUP_NAME"
        
        # Update registry
        update_backup_registry "database" "$BACKUP_NAME"
    fi
}

# Update backup registry
update_backup_registry() {
    local backup_type=$1
    local backup_name=$2
    
    # This would normally use jq, but for compatibility we'll use simple approach
    python3 -c "
import json
import sys
from datetime import datetime

try:
    with open('$BACKUP_ROOT/backup_registry.json', 'r') as f:
        registry = json.load(f)
    
    backup_info = {
        'name': '$backup_name',
        'type': '$backup_type',
        'created': datetime.now().isoformat(),
        'size': '$(du -sh "$BACKUP_ROOT/$backup_type/$backup_name" | cut -f1)'
    }
    
    registry['backups'].append(backup_info)
    registry['last_${backup_type}_backup'] = '$backup_name'
    
    # Keep only recent backups in registry
    registry['backups'] = registry['backups'][-$MAX_BACKUPS:]
    
    with open('$BACKUP_ROOT/backup_registry.json', 'w') as f:
        json.dump(registry, f, indent=2)
        
except Exception as e:
    print(f'Error updating registry: {e}', file=sys.stderr)
" 2>/dev/null || print_warning "Could not update backup registry"
}

# List all backups
list_backups() {
    print_section "Available Backups"
    
    echo -e "${GREEN}Full Backups:${NC}"
    if [ -d "$BACKUP_ROOT/full" ]; then
        ls -la "$BACKUP_ROOT/full" | grep "eyemotion_backup_" | while read line; do
            echo "  📁 $(echo $line | awk '{print $9}') - $(echo $line | awk '{print $5}') - $(echo $line | awk '{print $6, $7, $8}')"
        done
    fi
    
    echo ""
    echo -e "${YELLOW}Incremental Backups:${NC}"
    if [ -d "$BACKUP_ROOT/incremental" ]; then
        ls -la "$BACKUP_ROOT/incremental" | grep "eyemotion_incremental_" | while read line; do
            echo "  📂 $(echo $line | awk '{print $9}') - $(echo $line | awk '{print $5}') - $(echo $line | awk '{print $6, $7, $8}')"
        done
    fi
    
    echo ""
    echo -e "${BLUE}Database Backups:${NC}"
    if [ -d "$BACKUP_ROOT/database" ]; then
        ls -la "$BACKUP_ROOT/database" | grep "eyemotion_database_backup_" | while read line; do
            echo "  🗄️  $(echo $line | awk '{print $9}') - $(echo $line | awk '{print $5}') - $(echo $line | awk '{print $6, $7, $8}')"
        done
    fi
    
    echo ""
    echo -e "${CYAN}Total Backup Size:${NC} $(du -sh "$BACKUP_ROOT" | cut -f1)"
}

# Show backup status
show_status() {
    print_section "Backup System Status"
    
    echo -e "${GREEN}📊 Statistics:${NC}"
    echo "  Full Backups: $(find "$BACKUP_ROOT/full" -name "eyemotion_backup_*" 2>/dev/null | wc -l)"
    echo "  Incremental Backups: $(find "$BACKUP_ROOT/incremental" -name "eyemotion_incremental_*" 2>/dev/null | wc -l)"
    echo "  Database Backups: $(find "$BACKUP_ROOT/database" -name "eyemotion_database_backup_*" 2>/dev/null | wc -l)"
    echo "  Total Size: $(du -sh "$BACKUP_ROOT" 2>/dev/null | cut -f1 || echo "0B")"
    
    echo ""
    echo -e "${BLUE}📅 Last Backups:${NC}"
    echo "  Full: $(find "$BACKUP_ROOT/full" -name "eyemotion_backup_*" -printf '%T@ %f\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2 || echo "None")"
    echo "  Incremental: $(find "$BACKUP_ROOT/incremental" -name "eyemotion_incremental_*" -printf '%T@ %f\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2 || echo "None")"
    echo "  Database: $(find "$BACKUP_ROOT/database" -name "eyemotion_database_backup_*" -printf '%T@ %f\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2 || echo "None")"
    
    echo ""
    echo -e "${YELLOW}🔧 System Health:${NC}"
    [ -f "scripts/complete-backup.sh" ] && echo "  ✅ Full backup script available" || echo "  ❌ Full backup script missing"
    [ -f "scripts/incremental-backup.sh" ] && echo "  ✅ Incremental backup script available" || echo "  ❌ Incremental backup script missing"
    [ -f "scripts/database-backup.sh" ] && echo "  ✅ Database backup script available" || echo "  ❌ Database backup script missing"
    [ -d "$BACKUP_ROOT" ] && echo "  ✅ Backup directory exists" || echo "  ❌ Backup directory missing"
}

# Cleanup old backups
cleanup_backups() {
    print_section "Cleaning Up Old Backups"
    
    local removed_count=0
    
    # Remove backups older than retention period
    find "$BACKUP_ROOT" -name "eyemotion_*" -type d -mtime +$RETENTION_DAYS | while read backup; do
        if [ -d "$backup" ]; then
            print_status "Removing old backup: $(basename "$backup")"
            rm -rf "$backup"
            ((removed_count++))
        fi
    done
    
    # Keep only the most recent backups if we exceed max count
    for backup_type in full incremental database; do
        backup_count=$(find "$BACKUP_ROOT/$backup_type" -name "eyemotion_*" -type d 2>/dev/null | wc -l)
        if [ "$backup_count" -gt "$MAX_BACKUPS" ]; then
            excess=$((backup_count - MAX_BACKUPS))
            find "$BACKUP_ROOT/$backup_type" -name "eyemotion_*" -type d -printf '%T@ %p\n' | sort -n | head -$excess | cut -d' ' -f2 | while read backup; do
                print_status "Removing excess backup: $(basename "$backup")"
                rm -rf "$backup"
                ((removed_count++))
            done
        fi
    done
    
    print_success "Cleanup completed. Removed $removed_count old backups"
}

# Restore from backup
restore_backup() {
    local backup_name=$1
    
    if [ -z "$backup_name" ]; then
        print_error "Please specify backup name to restore"
        echo "Available backups:"
        list_backups
        return 1
    fi
    
    print_section "Restoring from Backup: $backup_name"
    
    # Find backup location
    local backup_path=""
    for backup_type in full incremental database; do
        if [ -d "$BACKUP_ROOT/$backup_type/$backup_name" ]; then
            backup_path="$BACKUP_ROOT/$backup_type/$backup_name"
            break
        fi
    done
    
    if [ -z "$backup_path" ]; then
        print_error "Backup not found: $backup_name"
        return 1
    fi
    
    print_status "Found backup at: $backup_path"
    
    # Check for restore script
    if [ -f "$backup_path/restore-eyemotion.sh" ]; then
        print_status "Running restoration script..."
        cd "$backup_path"
        ./restore-eyemotion.sh "../../../eyemotion-restored-$(date +%Y%m%d_%H%M%S)"
        cd - > /dev/null
        print_success "Restoration completed successfully"
    else
        print_warning "No restoration script found. Manual restoration required."
        print_status "Backup location: $backup_path"
        print_status "See backup documentation for manual restoration steps"
    fi
}

# Setup automated backups
setup_schedule() {
    print_section "Setting Up Automated Backup Schedule"
    
    # Create cron job for automated backups
    CRON_FILE="/tmp/eyemotion_backup_cron"
    cat > "$CRON_FILE" << EOF
# EyeMotion Automated Backup Schedule
# Full backup every Sunday at 2 AM
0 2 * * 0 cd $(pwd) && ./scripts/backup-manager.sh full >> $BACKUP_ROOT/logs/cron.log 2>&1

# Incremental backup every day at 4 AM (except Sunday)
0 4 * * 1-6 cd $(pwd) && ./scripts/backup-manager.sh incremental >> $BACKUP_ROOT/logs/cron.log 2>&1

# Database backup every 6 hours
0 */6 * * * cd $(pwd) && ./scripts/backup-manager.sh database >> $BACKUP_ROOT/logs/cron.log 2>&1

# Cleanup old backups weekly on Saturday at 1 AM
0 1 * * 6 cd $(pwd) && ./scripts/backup-manager.sh cleanup >> $BACKUP_ROOT/logs/cron.log 2>&1
EOF
    
    # Install cron job
    crontab "$CRON_FILE" 2>/dev/null && print_success "Automated backup schedule installed" || print_warning "Could not install cron schedule"
    rm "$CRON_FILE"
    
    print_status "Backup schedule:"
    echo "  - Full backup: Sundays at 2:00 AM"
    echo "  - Incremental backup: Daily at 4:00 AM (Mon-Sat)"
    echo "  - Database backup: Every 6 hours"
    echo "  - Cleanup: Saturdays at 1:00 AM"
}

# Main function
main() {
    local command=${1:-"status"}
    
    print_header
    
    # Initialize backup system if not exists
    init_backup_system
    
    case $command in
        "full")
            create_full_backup
            ;;
        "incremental")
            create_incremental_backup
            ;;
        "database")
            create_database_backup
            ;;
        "list")
            list_backups
            ;;
        "cleanup")
            cleanup_backups
            ;;
        "restore")
            restore_backup "$2"
            ;;
        "status")
            show_status
            ;;
        "schedule")
            setup_schedule
            ;;
        "help"|"--help"|"-h")
            show_usage
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            show_usage
            exit 1
            ;;
    esac
    
    echo ""
    print_success "🎬 EyeMotion Backup Manager operation completed!"
}

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true

# Run main function
main "$@"