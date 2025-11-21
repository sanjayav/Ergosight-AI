# ErgoSight Deployment Guide

## Quick Start

### Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at http://localhost:4000

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# API Configuration (when backend is ready)
NEXT_PUBLIC_API_URL=https://api.ergosight.mahindra.com
NEXT_PUBLIC_API_KEY=your_api_key_here

# Authentication
NEXT_PUBLIC_SSO_ENDPOINT=https://sso.mahindra.com
NEXT_PUBLIC_APP_ENV=production

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## Deployment Options

### Option 1: Vercel (Recommended for PoC)

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy automatically

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t ergosight .
docker run -p 3000:3000 ergosight
```

### Option 3: Traditional Server (Ubuntu/CentOS)

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Build and start
npm run build
pm2 start npm --name "ergosight" -- start
pm2 save
pm2 startup
```

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name ergosight.mahindra.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Performance Optimization

### 1. Enable Compression
Ensure gzip/brotli compression is enabled in your web server.

### 2. CDN Integration
Configure Next.js for CDN:

```javascript
// next.config.js
module.exports = {
  assetPrefix: process.env.CDN_URL || '',
  images: {
    domains: ['cdn.mahindra.com'],
  },
}
```

### 3. Caching Strategy
- Static assets: 1 year cache
- API responses: Based on data freshness requirements
- HTML pages: No cache (for dynamic content)

## Monitoring & Logging

### Application Logs

```bash
# PM2 logs
pm2 logs ergosight

# Docker logs
docker logs ergosight
```

### Health Check Endpoint

Add to `pages/api/health.ts`:
```typescript
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}
```

## Security Checklist

- [ ] Enable HTTPS/TLS
- [ ] Configure CORS appropriately
- [ ] Set up CSP headers
- [ ] Implement rate limiting
- [ ] Enable audit logging
- [ ] Configure SSO integration
- [ ] Regular dependency updates
- [ ] Enable security headers (HSTS, X-Frame-Options, etc.)

## Backup & Recovery

### Database Backups (when applicable)
```bash
# Automated daily backups
0 2 * * * /usr/local/bin/backup-ergosight.sh
```

### Configuration Backups
- Store environment variables in secure vault
- Version control all configuration files
- Document deployment procedures

## Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**Port Already in Use**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

**Memory Issues**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

## Support & Maintenance

- **Critical Issues**: Contact DevOps team immediately
- **Feature Requests**: Submit via Jira
- **Documentation Updates**: Update this file and commit

## Rollback Procedure

```bash
# Using PM2
pm2 stop ergosight
git checkout <previous-version-tag>
npm install
npm run build
pm2 restart ergosight

# Using Docker
docker pull ergosight:<previous-version>
docker stop ergosight
docker rm ergosight
docker run -d --name ergosight -p 3000:3000 ergosight:<previous-version>
```

---

**Last Updated**: November 19, 2025
**Maintained By**: ErgoSight DevOps Team

