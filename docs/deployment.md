# Deployment Guide

This guide covers deploying the AI Workflow Agent to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Worker Deployment](#worker-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

- Node.js 18+ runtime
- PostgreSQL 14+ database
- Redis 6+ instance
- Domain name with SSL certificate
- OpenAI API key

### Recommended Platforms

**Backend & Workers:**
- Railway (easiest)
- Render
- Heroku
- AWS EC2
- DigitalOcean

**Frontend:**
- Vercel (recommended)
- Netlify
- Cloudflare Pages

**Database:**
- Railway PostgreSQL
- Supabase
- AWS RDS
- DigitalOcean Managed Database

**Redis:**
- Railway Redis
- Upstash
- Redis Cloud
- AWS ElastiCache

---

## Environment Setup

### Production Environment Variables

Create a `.env.production` file:

```env
# Server
NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/workflow_agent

# Redis
REDIS_URL=redis://user:password@host:6379

# JWT
JWT_SECRET=your-production-secret-min-32-chars
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-production-key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=workflow-agent-prod

# Encryption
ENCRYPTION_KEY=your-32-char-encryption-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Worker
WORKER_CONCURRENCY=5
WORKER_MAX_RETRIES=3

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=https://yourdomain.com
```

---

## Database Setup

### 1. Create Production Database

**Using Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add PostgreSQL
railway add postgresql

# Get connection string
railway variables
```

**Using Supabase:**
1. Create project at https://supabase.com
2. Go to Settings → Database
3. Copy connection string

### 2. Run Migrations

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://..."

# Run migrations
npm run db:migrate

# Optional: Seed demo data
npm run db:seed
```

### 3. Backup Strategy

Set up automated backups:

```bash
# Daily backup script
0 2 * * * pg_dump $DATABASE_URL > /backups/workflow_$(date +\%Y\%m\%d).sql
```

---

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
railway login
```

2. **Initialize Project:**
```bash
cd backend
railway init
```

3. **Add Services:**
```bash
railway add postgresql
railway add redis
```

4. **Set Environment Variables:**
```bash
railway variables set OPENAI_API_KEY=sk-...
railway variables set JWT_SECRET=...
# ... set all other variables
```

5. **Deploy:**
```bash
railway up
```

6. **Get URL:**
```bash
railway domain
```

### Option 2: Render

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: workflow-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: workflow-db
          property: connectionString
      - key: REDIS_URL
        fromDatabase:
          name: workflow-redis
          property: connectionString

databases:
  - name: workflow-db
    databaseName: workflow_agent
    user: workflow_user
  
  - name: workflow-redis
    plan: starter
```

2. Deploy:
```bash
# Connect GitHub repo
# Push to main branch
# Render auto-deploys
```

### Option 3: Docker

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Build and Push:**
```bash
docker build -t workflow-api .
docker tag workflow-api your-registry/workflow-api:latest
docker push your-registry/workflow-api:latest
```

3. **Deploy to Cloud:**
```bash
# AWS ECS, Google Cloud Run, etc.
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Configure:**
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://api.yourdomain.com"
  }
}
```

3. **Deploy:**
```bash
cd frontend
vercel --prod
```

4. **Custom Domain:**
```bash
vercel domains add yourdomain.com
```

### Option 2: Netlify

1. **Create `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://api.yourdomain.com"
```

2. **Deploy:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: Static Hosting

Build and upload to S3/CloudFront:

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## Worker Deployment

Workers should run as separate processes.

### Option 1: Same Server as API

**Using PM2:**

1. **Install PM2:**
```bash
npm install -g pm2
```

2. **Create `ecosystem.config.js`:**
```javascript
module.exports = {
  apps: [
    {
      name: 'workflow-api',
      script: 'src/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'workflow-worker',
      script: 'src/workers/executor/index.js',
      instances: 3,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

3. **Start:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 2: Separate Service

Deploy workers as a separate Railway/Render service:

**Railway:**
```bash
railway add
# Select "Empty Service"
# Set start command: npm run worker
```

**Render:**
```yaml
services:
  - type: worker
    name: workflow-worker
    env: node
    buildCommand: npm install
    startCommand: npm run worker
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Nginx)

1. **Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx
```

2. **Get Certificate:**
```bash
sudo certbot --nginx -d api.yourdomain.com
```

3. **Auto-renewal:**
```bash
sudo certbot renew --dry-run
```

### Using Cloudflare

1. Add domain to Cloudflare
2. Enable "Full (strict)" SSL mode
3. Create origin certificate
4. Install on server

---

## Monitoring & Maintenance

### 1. Health Checks

Add health endpoint (already included):
```
GET /health
```

Monitor with:
- UptimeRobot
- Pingdom
- Better Uptime

### 2. Logging

**Production Logging:**

```javascript
// Use Winston with file transport
logger.add(new winston.transports.File({ 
  filename: 'logs/error.log', 
  level: 'error' 
}));
```

**Log Aggregation:**
- Logtail
- Papertrail
- DataDog

### 3. Error Tracking

**Sentry Integration:**

```bash
npm install @sentry/node
```

```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 4. Performance Monitoring

**New Relic / DataDog:**

```bash
npm install newrelic
```

### 5. Database Monitoring

- Enable slow query logging
- Set up connection pool monitoring
- Configure automated backups

### 6. Queue Monitoring

**BullMQ Dashboard:**

```bash
npm install bull-board
```

```javascript
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullMQAdapter(workflowQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
```

---

## Scaling Strategies

### Horizontal Scaling

**API Servers:**
```bash
# Railway
railway scale --replicas 3

# PM2
pm2 scale workflow-api 4
```

**Workers:**
```bash
# Scale workers independently
railway scale workflow-worker --replicas 5
```

### Database Scaling

1. **Read Replicas** for queries
2. **Connection Pooling** (pgBouncer)
3. **Partitioning** for large tables

### Redis Scaling

1. **Redis Cluster** for high availability
2. **Separate queues** by priority
3. **TTL** for cache entries

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Secrets encrypted
- [ ] Regular security updates
- [ ] Firewall rules configured
- [ ] Backup strategy in place
- [ ] Monitoring alerts set up

---

## Rollback Strategy

### Quick Rollback

**Railway:**
```bash
railway rollback
```

**Vercel:**
```bash
vercel rollback
```

**PM2:**
```bash
pm2 reload ecosystem.config.js
```

### Database Rollback

```bash
# Restore from backup
pg_restore -d workflow_agent backup.sql
```

---

## Cost Optimization

### Estimated Monthly Costs

**Starter (< 1000 workflows/month):**
- Railway: $20/month (Hobby plan)
- Vercel: Free (Hobby)
- OpenAI: ~$50/month
- **Total: ~$70/month**

**Growth (< 10,000 workflows/month):**
- Railway: $50/month
- Vercel: Free
- OpenAI: ~$200/month
- **Total: ~$250/month**

**Production (> 10,000 workflows/month):**
- AWS/GCP: $200-500/month
- OpenAI: $500-1000/month
- **Total: $700-1500/month**

### Cost Reduction Tips

1. **Cache LLM responses** for similar prompts
2. **Use GPT-3.5** for simple tasks
3. **Batch API requests** where possible
4. **Auto-scale workers** based on queue depth
5. **Use spot instances** for workers

---

## Support & Troubleshooting

### Common Issues

**Database Connection Timeout:**
```bash
# Increase connection pool
DATABASE_POOL_MAX=20
```

**Worker Memory Issues:**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096"
```

**Rate Limiting:**
```bash
# Adjust limits
RATE_LIMIT_MAX_REQUESTS=200
```

---

## Next Steps

1. Set up monitoring
2. Configure backups
3. Enable auto-scaling
4. Set up CI/CD
5. Create runbooks
6. Document incidents

---

**Need help?** Open an issue or contact support.
