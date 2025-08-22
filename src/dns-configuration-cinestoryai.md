# DNS Configuration for cinestoryai.com

## 🌐 Required DNS Records

### Main Domain Records
```
Type    Name                Value                       TTL     Priority
A       cinestoryai.com     76.76.19.61                3600    -
A       www                 76.76.19.61                3600    -
CNAME   www                 cname.vercel-dns.com       3600    -
```

### Subdomain Configuration
```
Type    Name                Value                       TTL     Priority
CNAME   app                 cname.vercel-dns.com       3600    -
CNAME   api                 [project-id].supabase.co  3600    -
CNAME   cdn                 cname.vercel-dns.com       3600    -
CNAME   admin               cname.vercel-dns.com       3600    -
```

### Email Configuration
```
Type    Name                Value                       TTL     Priority
MX      cinestoryai.com     mx1.zoho.com               3600    10
MX      cinestoryai.com     mx2.zoho.com               3600    20
MX      cinestoryai.com     mx3.zoho.com               3600    50
TXT     cinestoryai.com     "v=spf1 include:zoho.com ~all"  3600    -
```

### Security & Verification Records
```
Type    Name                Value                       TTL     Priority
TXT     cinestoryai.com     "v=DMARC1; p=quarantine; rua=mailto:dmarc@cinestoryai.com"  3600    -
TXT     _dmarc              "v=DMARC1; p=quarantine"   3600    -
CAA     cinestoryai.com     "0 issue \"letsencrypt.org\"" 3600    -
CAA     cinestoryai.com     "0 issue \"digicert.com\""   3600    -
```

## 📧 Email Aliases Setup

### Professional Email Addresses
```
hello@cinestoryai.com       → Primary contact
info@cinestoryai.com        → General information
support@cinestoryai.com     → Customer support
admin@cinestoryai.com       → Administrative
security@cinestoryai.com    → Security reports
legal@cinestoryai.com       → Legal matters
press@cinestoryai.com       → Media inquiries
partnerships@cinestoryai.com → Business partnerships
careers@cinestoryai.com     → Job applications
billing@cinestoryai.com     → Payment & billing
```

### Department Email Addresses
```
dev@cinestoryai.com         → Development team
marketing@cinestoryai.com   → Marketing team
sales@cinestoryai.com       → Sales team
api@cinestoryai.com         → API support
docs@cinestoryai.com        → Documentation
feedback@cinestoryai.com    → User feedback
```

## 🔧 DNS Provider Configuration

### For Cloudflare
1. Login to Cloudflare dashboard
2. Select your domain: cinestoryai.com
3. Go to DNS management
4. Add the records above
5. Enable Cloudflare proxy (orange cloud) for A records
6. Disable proxy for CNAME records pointing to external services

### For Namecheap
1. Login to Namecheap account
2. Go to Domain List → Manage
3. Select Advanced DNS
4. Add the records above
5. Wait for propagation (up to 48 hours)

### For GoDaddy
1. Login to GoDaddy account
2. Go to DNS Management
3. Add the records above
4. Save changes

## 🚀 Vercel Domain Configuration

### Add Domain in Vercel
```bash
vercel domains add cinestoryai.com
vercel domains add www.cinestoryai.com
vercel domains add app.cinestoryai.com
vercel domains add admin.cinestoryai.com
```

### Configure Domain Settings
```bash
# Set as production domain
vercel domains ls
vercel alias set [deployment-url] cinestoryai.com
vercel alias set [deployment-url] www.cinestoryai.com
```

## 📊 Supabase Custom Domain Setup

### Add Custom Domain for API
1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings → API
4. Add custom domain: api.cinestoryai.com
5. Configure SSL certificate

## 🔒 SSL Certificate Configuration

### Automatic SSL (Recommended)
- Vercel automatically provisions SSL certificates
- No manual configuration required
- Certificates auto-renew

### Manual SSL (If needed)
```bash
# Using Certbot for additional certificates
sudo certbot certonly --dns-cloudflare \
  --dns-cloudflare-credentials ~/.secrets/cloudflare.ini \
  -d cinestoryai.com \
  -d www.cinestoryai.com \
  -d api.cinestoryai.com
```

## 🔍 DNS Verification Commands

### Check DNS Propagation
```bash
# Check A record
dig A cinestoryai.com

# Check CNAME record
dig CNAME www.cinestoryai.com

# Check MX record
dig MX cinestoryai.com

# Check TXT record
dig TXT cinestoryai.com
```

### Online Tools
- https://dns.google.com
- https://www.whatsmydns.net
- https://dnschecker.org

## ⚡ Performance Optimization

### CDN Configuration
```
# Vercel Edge Locations automatically configured
# No additional setup required
```

### Caching Headers
```
# Configured in vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 📈 Monitoring Setup

### Domain Health Checks
```bash
# Check website availability
curl -I https://cinestoryai.com

# Check API health
curl -I https://api.cinestoryai.com/health

# Check SSL certificate
openssl s_client -connect cinestoryai.com:443 -servername cinestoryai.com
```

## 🔧 Troubleshooting

### Common Issues
1. **DNS not propagating**: Wait 24-48 hours, check TTL values
2. **SSL certificate issues**: Check Vercel dashboard, force renewal
3. **Email not working**: Verify MX records, check spam settings
4. **Subdomain not accessible**: Verify CNAME records, check proxy settings

### Debug Commands
```bash
# Check DNS resolution
nslookup cinestoryai.com

# Check website response
curl -v https://cinestoryai.com

# Check SSL certificate
curl -vI https://cinestoryai.com 2>&1 | grep -i certificate
```

## 📋 Post-Configuration Checklist

### Immediate Tasks (0-24 hours)
- [ ] Verify main domain loads correctly
- [ ] Check www redirect works
- [ ] Test SSL certificate installation
- [ ] Verify email delivery
- [ ] Check API endpoints respond

### Short-term Tasks (1-7 days)
- [ ] Monitor DNS propagation globally
- [ ] Test email delivery from all aliases
- [ ] Verify CDN performance
- [ ] Check search engine indexing
- [ ] Monitor SSL certificate status

### Long-term Tasks (7+ days)
- [ ] Setup domain monitoring alerts
- [ ] Configure backup DNS providers
- [ ] Monitor domain expiration
- [ ] Review SSL certificate renewal
- [ ] Analyze traffic patterns

---

**Configuration Date**: $(date)
**Next Review**: $(date -d '+30 days')
**Status**: ✅ Ready for Production