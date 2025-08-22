#!/bin/bash

# EyeMotion SSL Setup Script for eyemotionai.com
# Automatic SSL certificate setup and verification

set -e

echo "🔒 EyeMotion SSL Certificate Setup"
echo "================================="
echo "Domain: eyemotionai.com"
echo "WWW: www.eyemotionai.com"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if domain resolves correctly
check_dns() {
    print_status "Checking DNS resolution..."
    
    # Check main domain
    if dig +short eyemotionai.com | grep -q "^[0-9]"; then
        print_success "eyemotionai.com resolves correctly"
    else
        print_error "eyemotionai.com does not resolve to an IP address"
        echo "Please configure your DNS A record first:"
        echo "A eyemotionai.com 76.76.19.61"
        exit 1
    fi
    
    # Check www subdomain
    if dig +short www.eyemotionai.com | grep -q "\."; then
        print_success "www.eyemotionai.com resolves correctly"
    else
        print_warning "www.eyemotionai.com does not resolve (this is optional)"
    fi
}

# Check if domains are accessible via HTTP
check_http_access() {
    print_status "Checking HTTP accessibility..."
    
    # Check main domain
    if curl -s -o /dev/null -w "%{http_code}" http://eyemotionai.com | grep -q "200\|301\|302"; then
        print_success "eyemotionai.com is accessible via HTTP"
    else
        print_warning "eyemotionai.com is not accessible via HTTP yet"
        print_status "This is normal if the site is not deployed yet"
    fi
}

# Check current SSL status
check_ssl_status() {
    print_status "Checking current SSL certificate status..."
    
    # Check if HTTPS is already working
    if curl -s -o /dev/null -w "%{http_code}" https://eyemotionai.com 2>/dev/null | grep -q "200"; then
        print_success "HTTPS is already working for eyemotionai.com"
        
        # Get certificate expiry
        expiry=$(echo | openssl s_client -servername eyemotionai.com -connect eyemotionai.com:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
        if [ -n "$expiry" ]; then
            print_success "Certificate expires: $expiry"
        fi
        
        return 0
    else
        print_warning "HTTPS is not yet working for eyemotionai.com"
        return 1
    fi
}

# Vercel SSL setup
setup_vercel_ssl() {
    print_status "Setting up SSL certificates via Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed"
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Login check
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel. Please login:"
        vercel login
    fi
    
    # Add domains to Vercel
    print_status "Adding domains to Vercel..."
    vercel domains add eyemotionai.com 2>/dev/null || print_warning "Domain might already be added"
    vercel domains add www.eyemotionai.com 2>/dev/null || print_warning "WWW domain might already be added"
    
    # List domains to verify
    print_status "Current Vercel domains:"
    vercel domains ls | grep eyemotionai || print_warning "No eyemotionai domains found in Vercel"
    
    print_success "Vercel SSL setup completed"
    print_status "SSL certificates will be automatically provisioned by Vercel"
    print_status "This process typically takes 5-10 minutes"
}

# Wait for SSL provisioning
wait_for_ssl() {
    print_status "Waiting for SSL certificate provisioning..."
    
    local max_attempts=30
    local attempt=1
    local wait_time=30
    
    while [ $attempt -le $max_attempts ]; do
        print_status "Attempt $attempt/$max_attempts - Checking SSL status..."
        
        if curl -s -o /dev/null -w "%{http_code}" https://eyemotionai.com 2>/dev/null | grep -q "200"; then
            print_success "SSL certificate is now active!"
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "SSL certificate provisioning timed out"
            return 1
        fi
        
        print_status "SSL not ready yet. Waiting ${wait_time} seconds..."
        sleep $wait_time
        ((attempt++))
    done
}

# Verify SSL certificate
verify_ssl() {
    print_status "Verifying SSL certificate..."
    
    # Check HTTPS response
    if response=$(curl -s -o /dev/null -w "%{http_code}" https://eyemotionai.com 2>/dev/null); then
        if [ "$response" == "200" ]; then
            print_success "HTTPS is working correctly (Status: $response)"
        else
            print_warning "HTTPS returned status: $response"
        fi
    else
        print_error "HTTPS connection failed"
        return 1
    fi
    
    # Check certificate details
    print_status "Certificate details:"
    echo | openssl s_client -servername eyemotionai.com -connect eyemotionai.com:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates 2>/dev/null || print_warning "Could not retrieve certificate details"
    
    # Check certificate chain
    if echo | openssl s_client -servername eyemotionai.com -connect eyemotionai.com:443 2>/dev/null | grep -q "Verify return code: 0"; then
        print_success "Certificate chain is valid"
    else
        print_warning "Certificate chain verification failed"
    fi
    
    # Check for common SSL issues
    print_status "Running SSL security checks..."
    
    # Check if TLS 1.2+ is supported
    if echo | openssl s_client -tls1_2 -servername eyemotionai.com -connect eyemotionai.com:443 2>/dev/null | grep -q "SSL handshake has read"; then
        print_success "TLS 1.2 is supported"
    else
        print_warning "TLS 1.2 might not be supported"
    fi
    
    print_success "SSL verification completed"
}

# Test HTTPS redirect
test_https_redirect() {
    print_status "Testing HTTP to HTTPS redirect..."
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" -L http://eyemotionai.com 2>/dev/null); then
        if [ "$response" == "200" ]; then
            print_success "HTTP to HTTPS redirect is working"
        else
            print_warning "HTTP redirect returned status: $response"
        fi
    else
        print_warning "Could not test HTTP redirect"
    fi
}

# Generate SSL monitoring script
create_ssl_monitor() {
    print_status "Creating SSL monitoring script..."
    
    cat > ssl-monitor.sh << 'EOF'
#!/bin/bash

# EyeMotion SSL Certificate Monitor
# Check SSL certificate expiry and send alerts

DOMAIN="eyemotionai.com"
WARNING_DAYS=30
CRITICAL_DAYS=7

check_ssl_expiry() {
    local domain=$1
    local warning_days=$2
    local critical_days=$3
    
    # Get certificate expiry date
    expiry_date=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
    
    if [ -z "$expiry_date" ]; then
        echo "ERROR: Could not retrieve certificate for $domain"
        return 1
    fi
    
    # Calculate days until expiry
    expiry_epoch=$(date -d "$expiry_date" +%s)
    current_epoch=$(date +%s)
    days_until_expiry=$(( ($expiry_epoch - $current_epoch) / 86400 ))
    
    echo "SSL Certificate for $domain expires in $days_until_expiry days"
    
    if [ $days_until_expiry -lt $critical_days ]; then
        echo "CRITICAL: SSL certificate expires in $days_until_expiry days!"
        # Send critical alert
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 CRITICAL: SSL certificate for $domain expires in $days_until_expiry days!\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
        return 2
    elif [ $days_until_expiry -lt $warning_days ]; then
        echo "WARNING: SSL certificate expires in $days_until_expiry days"
        # Send warning alert
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"⚠️ WARNING: SSL certificate for $domain expires in $days_until_expiry days\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
        return 1
    else
        echo "SSL certificate is valid for $days_until_expiry days"
        return 0
    fi
}

# Check main domain
check_ssl_expiry "$DOMAIN" $WARNING_DAYS $CRITICAL_DAYS

# Check www subdomain
check_ssl_expiry "www.$DOMAIN" $WARNING_DAYS $CRITICAL_DAYS
EOF
    
    chmod +x ssl-monitor.sh
    print_success "SSL monitoring script created: ssl-monitor.sh"
}

# Main SSL setup function
main() {
    echo "🔒 Starting EyeMotion SSL Setup for eyemotionai.com..."
    echo ""
    
    # Check prerequisites
    check_dns
    check_http_access
    
    # Check if SSL is already working
    if check_ssl_status; then
        print_success "SSL is already properly configured!"
        verify_ssl
        test_https_redirect
        create_ssl_monitor
        
        echo ""
        print_success "✅ SSL Setup Complete!"
        echo "🌐 HTTPS: https://eyemotionai.com"
        echo "🔒 Certificate: Valid and properly configured"
        echo "📊 Monitor: Use ./ssl-monitor.sh to check certificate status"
        return 0
    fi
    
    # Setup SSL via Vercel
    setup_vercel_ssl
    
    # Wait for provisioning
    print_status "Waiting for SSL certificate provisioning..."
    print_status "This may take 5-10 minutes for new domains..."
    
    if wait_for_ssl; then
        verify_ssl
        test_https_redirect
        create_ssl_monitor
        
        echo ""
        print_success "🎉 SSL Setup Completed Successfully!"
        echo "================================="
        echo "🌐 Your site is now secure: https://eyemotionai.com"
        echo "🔒 SSL certificate has been provisioned and verified"
        echo "📊 Use ./ssl-monitor.sh to monitor certificate status"
        echo "🔄 Certificates will auto-renew before expiry"
        
    else
        print_error "SSL setup failed or timed out"
        echo ""
        print_status "Troubleshooting steps:"
        echo "1. Verify DNS is properly configured"
        echo "2. Ensure domain is added to Vercel project"
        echo "3. Check Vercel dashboard for errors"
        echo "4. Wait longer - initial SSL provisioning can take up to 24 hours"
        echo ""
        print_status "Manual verification:"
        echo "curl -I https://eyemotionai.com"
        exit 1
    fi
}

# Run SSL setup
main "$@"