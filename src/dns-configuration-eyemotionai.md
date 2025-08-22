# DNS Configuration for eyemotionai.com

## 🌐 Required DNS Records

### Main Domain Records
```
Type    Name                Value                       TTL     Priority
A       eyemotionai.com     76.76.19.61                3600    -
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
MX      eyemotionai.com     mx1.zoho.com               3600    10
MX      eyemotionai.com     mx2.zoho.com               3600    20
MX      eyemotionai.com     mx3.zoho.com               3600    50
TXT     eyemotionai.com     "v=spf1 include:zoho.com ~all"  3600    -
```

### Security & Verification Records
```
Type    Name                Value                       TTL     Priority
TXT     eyemotionai.com     "v=DMARC1; p=quarantine; rua=mailto:dmarc@eyemotionai.com"  3600    -
TXT     _dmarc              "v=DMARC1; p=quarantine"   3600    -
CAA     eyemotionai.com     "0 issue \"letsencrypt.org\"" 3600    -
CAA     eyemotionai.com     "0 issue \"digicert.com\""   3600    -
```

## 📧 Email Aliases Setup

### Professional Email Addresses
```
hello@eyemotionai.com       → Primary contact
info@eyemotionai.com        → General information
support@eyemotionai.com     → Customer support
admin@eyemotionai.com       → Administrative
security@eyemotionai.com    → Security reports
legal@eyemotionai.com       → Legal matters
press@eyemotionai.com       → Media inquiries
partnerships@eyemotionai.com → Business partnerships
careers@eyemotionai.com     → Job applications
billing@eyemotionai.com     → Payment & billing
```

### Department Email Addresses
```
dev@eyemotionai.com         → Development team
marketing@eyemotionai.com   → Marketing team
sales@eyemotionai.com       → Sales team
api@eyemotionai.com         → API support
docs@eyemotionai.com        → Documentation
feedback@eyemotionai.com    → User feedback
```

## 🔧 DNS Provider Configuration

### For Cloudflare
1. Login to Cloudflare dashboard
2. Select your domain: eyemotionai.com
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
vercel domains add eyemotionai.com
vercel domains add www.eyemotionai.com
vercel domains add app.eyemotionai.com
vercel domains add admin.eyemotionai.com
```

### Configure Domain Settings
```bash
# Set as production domain
vercel domains ls
vercel alias set [deployment-url] eyemotionai.com
vercel alias set [deployment-url] www.eyemotionai.com
```

## 📊 Supabase Custom Domain Setup

### Add Custom Domain for API
1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings → API
4. Add custom domain: api.eyemotionai.com
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
  -d eyemotionai.com \
  -d www.eyemotionai.com \
  -d api.eyemotionai.com
```

## 🔍 DNS Verification Commands

### Check DNS Propagation
```bash
# Check A record
dig A eyemotionai.com

# Check CNAME record
dig CNAME www.eyemotionai.com

# Check MX record
dig MX eyemotionai.com

# Check TXT record
dig TXT eyemotionai.com
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
curl -I https://eyemotionai.com

# Check API health
curl -I https://api.eyemotionai.com/health

# Check SSL certificate
openssl s_client -connect eyemotionai.com:443 -servername eyemotionai.com
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
nslookup eyemotionai.com

# Check website response
curl -v https://eyemotionai.com

# Check SSL certificate
curl -vI https://eyemotionai.com 2>&1 | grep -i certificate
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