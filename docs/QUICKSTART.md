# Quick Start Guide

This guide will help you get the AI Workflow Agent up and running in minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ installed ([Download](https://www.postgresql.org/download/))
- **Redis** 6+ installed ([Download](https://redis.io/download))
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

## Step 1: Clone and Install

```bash
# Navigate to the project
cd ai-workflow-agent

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## Step 2: Set Up Database

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis with Docker Compose
cd infra
docker-compose up -d

# Wait for services to be ready (about 10 seconds)
```

### Option B: Manual Setup

If you have PostgreSQL and Redis installed locally:

1. Create a database:
```bash
createdb workflow_agent
```

2. Start Redis:
```bash
redis-server
```

## Step 3: Configure Environment

```bash
# In the backend directory
cd backend
cp .env.example .env
```

Edit `.env` and update these essential values:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/workflow_agent

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-key-here

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email (optional for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Step 4: Initialize Database

```bash
# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

This creates:
- Demo user: `admin@example.com` / `password123`
- Sample workflow
- Sample connector

## Step 5: Start the Application

Open **3 terminal windows**:

### Terminal 1: Backend API
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📝 Environment: development
```

### Terminal 2: Worker
```bash
cd backend
npm run worker
```

You should see:
```
🔧 Workflow executor worker started
```

### Terminal 3: Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## Step 6: Access the Application

1. Open your browser to **http://localhost:5173**
2. Log in with:
   - Email: `admin@example.com`
   - Password: `password123`

## What's Next?

### Create Your First Workflow

1. Click **"Create Workflow"** in the dashboard
2. Try this example prompt:
   ```
   Every day at 9 AM, fetch https://api.github.com/users/octocat 
   and email me a summary at myemail@example.com
   ```
3. Click **"Generate Workflow"**
4. Review the generated JSON
5. Click **"Dry Run"** to test
6. Click **"Save Workflow"**

### Explore Features

- **Dashboard**: View all workflows and recent runs
- **Workflow Details**: See execution history and logs
- **Connectors**: Add external service connections
- **Settings**: Manage your profile and API keys

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** Ensure PostgreSQL is running:
```bash
# Check if PostgreSQL is running
pg_isready

# Or with Docker
docker-compose ps
```

### Redis Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:** Ensure Redis is running:
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Or with Docker
docker-compose ps
```

### OpenAI API Error

```
Error: Invalid API key
```

**Solution:** 
1. Verify your API key in `.env`
2. Ensure you have credits in your OpenAI account
3. Check the key starts with `sk-`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Change the port in `.env`:
```env
PORT=3001
```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh the browser
- Backend: Nodemon restarts the server automatically

### View Logs

Backend logs are in the console. For production, check:
```bash
tail -f backend/logs/combined.log
```

### Database GUI

Use a PostgreSQL client to view data:
- [pgAdmin](https://www.pgadmin.org/)
- [TablePlus](https://tableplus.com/)
- [DBeaver](https://dbeaver.io/)

Connection details:
- Host: `localhost`
- Port: `5432`
- Database: `workflow_agent`
- User: `postgres`
- Password: `postgres`

### Redis GUI

Use a Redis client:
- [RedisInsight](https://redis.com/redis-enterprise/redis-insight/)
- [Medis](https://getmedis.com/)

## Production Deployment

For production deployment, see [docs/deployment.md](docs/deployment.md).

## Need Help?

- 📖 [API Reference](docs/api-reference.md)
- 🗄️ [Database Schema](docs/database-schema.md)
- 🤖 [LLM Prompts](docs/llm-prompts.md)
- 🐛 [Open an Issue](https://github.com/yourusername/ai-workflow-agent/issues)

---

**Happy Automating! 🚀**
