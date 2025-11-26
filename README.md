# AI Workflow Agent — Founder-ready Prototype

> A natural-language interface for creating and executing automation workflows without code.

## 🎯 Product Overview

**Core Idea:** Describe an automation workflow in plain English, and the system converts it into an executable pipeline of tasks (APIs, scrapers, schedules, notifications). The agent validates, simulates, and deploys workflows with logs, rollback, and testing.

**Target Users:** Founders and operators who want to automate repetitive, cross-tool processes without building glue code.

## ✨ Key Features

- 🗣️ Natural-language workflow creation
- 📊 Visual pipeline editor + execution graph
- 🔌 Multiple connectors (HTTP, Google Sheets, Notion, Slack, Email, Twilio/WhatsApp, S3)
- ⏰ Scheduler + triggers (cron, webhook, event-based)
- 📝 Audit logs, task-level retries, failure notifications
- 🚀 One-click deploy / run now / dry-run
- 👥 Role-based access / teams

## 🏗️ Architecture

```
[Browser SPA] <-> [API Gateway / Backend] <-> [Worker Queue]
                        |                           |
                        v                           v
                  [LLM Service]              [Connector Workers]
                   (OpenAI)                  (HTTP, Notion, etc.)
                        |
                        v
                  [Postgres DB]
                        |
                        v
                  [Object Storage (S3)]
```

### Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Worker Queue:** Redis + BullMQ
- **Database:** PostgreSQL
- **Object Storage:** S3 / Minio
- **Authentication:** JWT-based auth
- **LLM:** OpenAI API (GPT-4)
- **CI/CD:** GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- OpenAI API Key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-workflow-agent.git
cd ai-workflow-agent
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Set up environment variables**
```bash
# Backend (.env)
cp .env.example .env
# Edit .env with your credentials
```

4. **Set up database**
```bash
cd backend
npm run db:migrate
npm run db:seed
```

5. **Start services**
```bash
# Start Redis (in separate terminal)
redis-server

# Start backend (in separate terminal)
cd backend
npm run dev

# Start frontend (in separate terminal)
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📁 Project Structure

```
ai-workflow-agent/
├─ frontend/              # React + Vite frontend
│  ├─ src/
│  │  ├─ pages/          # Page components
│  │  ├─ components/     # Reusable components
│  │  ├─ hooks/          # Custom React hooks
│  │  ├─ services/       # API services
│  │  └─ styles/         # Global styles
├─ backend/              # Node.js + Express backend
│  ├─ src/
│  │  ├─ routes/         # API routes
│  │  ├─ controllers/    # Route controllers
│  │  ├─ workers/        # Background workers
│  │  ├─ connectors/     # External service connectors
│  │  ├─ llm/            # LLM integration
│  │  └─ lib/            # Utilities
├─ workers/              # Worker processes
├─ infra/                # Infrastructure configs
│  └─ docker-compose.yml
├─ scripts/              # Utility scripts
└─ docs/                 # Documentation
```

## 🎬 Demo Workflows

### Example 1: Daily Analytics Summary
```
"Every morning at 8 AM IST — fetch https://api.metrics.io/metrics 
and email me a one-paragraph summary to me@company.com"
```

### Example 2: Auto-generate Proposals
```
"When a row is added in Google Sheet X — generate a PDF proposal 
using template Y and upload to S3 and notify on Slack."
```

## 🔐 Security

- Encrypted secrets using KMS
- Per-tenant rate limits
- LLM call budgets per workspace
- Input sanitization for all connectors
- Dry-run mode prevents external side-effects

## 📊 Database Schema

See [docs/database-schema.md](docs/database-schema.md) for complete schema documentation.

Key tables:
- `users` - User accounts
- `workflows` - Workflow definitions
- `workflow_runs` - Execution history
- `tasks` - Individual task executions
- `connectors` - External service configurations
- `secrets` - Encrypted credentials
- `audit_logs` - Audit trail

## 🔌 API Documentation

See [docs/api-reference.md](docs/api-reference.md) for complete API documentation.

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Database Migrations
```bash
cd backend
npm run db:migrate:create -- migration_name
npm run db:migrate
```

### Code Formatting
```bash
npm run format
npm run lint
```

## 📝 MVP Scope

**Phase 1 (Current):**
- ✅ NL -> parsed workflow (LLM parser + JSON validator)
- ✅ Execute basic nodes: http_fetch, llm, email
- ✅ UI: NL input, JSON visualizer, run logs
- ✅ Connectors: SMTP, raw HTTP
- ✅ Worker + queue + basic retry

**Phase 2 (Planned):**
- ⏳ OAuth connectors (Google, Notion)
- ⏳ PDF generator
- ⏳ S3 uploads
- ⏳ Team roles & permissions
- ⏳ Visual drag-and-drop editor

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with modern web technologies and powered by OpenAI's GPT-4.

---

**Need Help?** Check out our [documentation](docs/) or open an issue.
"# ai_automation_task" 
