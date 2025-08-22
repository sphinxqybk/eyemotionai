#!/bin/bash

# EyeMotion Incremental Backup Script
# Creates incremental backups for ongoing development

set -e

# Configuration
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
INCREMENTAL_DIR="eyemotion_incremental_${BACKUP_DATE}"
LAST_BACKUP_FILE=".last_backup_timestamp"

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

# Get last backup timestamp
get_last_backup_time() {
    if [ -f "$LAST_BACKUP_FILE" ]; then
        cat "$LAST_BACKUP_FILE"
    else
        # If no previous backup, use 7 days ago
        date -d "7 days ago" '+%Y-%m-%d %H:%M:%S'
    fi
}

# Create incremental backup
create_incremental_backup() {
    print_status "Creating incremental backup since: $(get_last_backup_time)"
    
    mkdir -p "$INCREMENTAL_DIR"
    
    # Find modified files since last backup
    LAST_BACKUP=$(get_last_backup_time)
    
    # Core application files that changed
    find . -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.md" -o -name "*.css" -o -name "*.sh" -o -name "*.sql" | \
    while read file; do
        if [ -f "$file" ] && [ "$file" -nt "$LAST_BACKUP_FILE" ]; then
            # Create directory structure
            dir=$(dirname "$file")
            mkdir -p "$INCREMENTAL_DIR/$dir"
            cp "$file" "$INCREMENTAL_DIR/$file"
            echo "Backed up: $file"
        fi
    done
    
    # Always backup critical configuration files
    cp package.json "$INCREMENTAL_DIR/" 2>/dev/null || true
    cp vercel.json "$INCREMENTAL_DIR/" 2>/dev/null || true
    cp -r .env* "$INCREMENTAL_DIR/" 2>/dev/null || true
    
    # Update last backup timestamp
    date '+%Y-%m-%d %H:%M:%S' > "$LAST_BACKUP_FILE"
    
    print_success "Incremental backup created: $INCREMENTAL_DIR"
}

# Create backup manifest
create_incremental_manifest() {
    cat > "$INCREMENTAL_DIR/INCREMENTAL_MANIFEST.md" << EOF
# EyeMotion Incremental Backup

## Backup Information
- **Date**: $(date)
- **Type**: Incremental
- **Since**: $(get_last_backup_time)
- **Directory**: $INCREMENTAL_DIR

## Changed Files
$(find "$INCREMENTAL_DIR" -type f -name "*.tsx" -o -name "*.ts" -o -name "*.js" | sort)

## Restoration
To apply this incremental backup:
1. Extract to your project directory
2. Copy files: \`cp -r $INCREMENTAL_DIR/* ./\`
3. Reinstall dependencies if package.json changed
4. Restart development server

---
**Generated**: $(date)
EOF
}

# Main function
main() {
    echo -e "${PURPLE}🎬 EyeMotion Incremental Backup${NC}"
    echo "================================"
    echo ""
    
    create_incremental_backup
    create_incremental_manifest
    
    echo ""
    print_success "Incremental backup completed!"
    echo -e "${GREEN}📁 Location:${NC} $INCREMENTAL_DIR"
    echo -e "${GREEN}📊 Files:${NC} $(find "$INCREMENTAL_DIR" -type f | wc -l) files"
    echo -e "${GREEN}💾 Size:${NC} $(du -sh "$INCREMENTAL_DIR" | cut -f1)"
}

main "$@"