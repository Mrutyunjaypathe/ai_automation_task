# System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER / CLIENT                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              React Frontend (Vite + Tailwind)              │ │
│  │                                                            │ │
│  │  • Dashboard        • Workflow Creator                    │ │
│  │  • Visual Editor    • Run History                         │ │
│  │  • Connectors       • Settings                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP/REST API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Express)                       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Auth Routes  │  │   Workflow   │  │  Connector   │          │
│  │              │  │    Routes    │  │    Routes    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  Middleware: JWT Auth • Rate Limiting • Error Handling          │
└─────┬────────────────────┬────────────────────┬─────────────────┘
      │                    │                    │
      ▼                    ▼                    ▼
┌──────────┐      ┌─────────────────┐    ┌──────────────┐
│          │      │                 │    │              │
│ OpenAI   │      │   PostgreSQL    │    │    Redis     │
│  GPT-4   │      │    Database     │    │    Queue     │
│          │      │                 │    │              │
│  • Parse │      │  • users        │    │  • BullMQ    │
│  • LLM   │      │  • workflows    │    │  • Jobs      │
│  • Sum   │      │  • runs         │    │  • Retry     │
│          │      │  • tasks        │    │              │
└──────────┘      │  • connectors   │    └──────┬───────┘
                  │  • secrets      │           │
                  │  • audit_logs   │           │
                  └─────────────────┘           │
                                                ▼
                                    ┌───────────────────────┐
                                    │   Worker Processes    │
                                    │                       │
                                    │  ┌─────────────────┐  │
                                    │  │  Workflow       │  │
                                    │  │  Executor       │  │
                                    │  │                 │  │
                                    │  │  • Sequential   │  │
                                    │  │  • Parallel     │  │
                                    │  │  • Retry Logic  │  │
                                    │  └─────────────────┘  │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                        ┌───────────────────────────────────────┐
                        │         CONNECTORS / EXECUTORS        │
                        │                                       │
                        │  ┌──────┐  ┌──────┐  ┌──────┐       │
                        │  │ HTTP │  │ Email│  │  LLM │       │
                        │  └──────┘  └──────┘  └──────┘       │
                        │                                       │
                        │  ┌──────┐  ┌──────┐  ┌──────┐       │
                        │  │Slack │  │Notion│  │Sheets│       │
                        │  └──────┘  └──────┘  └──────┘       │
                        └───────────────────────────────────────┘
                                                │
                                                ▼
                        ┌───────────────────────────────────────┐
                        │      EXTERNAL SERVICES / APIs         │
                        │                                       │
                        │  • Third-party APIs                   │
                        │  • Email Servers (SMTP)               │
                        │  • Cloud Storage (S3)                 │
                        │  • SaaS Platforms                     │
                        └───────────────────────────────────────┘
```

## Data Flow

### 1. Workflow Creation
```
User → Frontend → API → LLM (Parse NL) → Database (Store Workflow)
```

### 2. Workflow Execution
```
User/Cron → API → Redis Queue → Worker → Connectors → External APIs
                                    ↓
                              Database (Log Results)
```

### 3. Real-time Updates
```
Worker → Database → API → Frontend (Polling/WebSocket)
```

## Component Responsibilities

### Frontend (React)
- User interface and interactions
- State management (Zustand)
- API communication (Axios + React Query)
- Real-time updates

### API Gateway (Express)
- Request routing
- Authentication & authorization
- Input validation
- Rate limiting
- Error handling

### Database (PostgreSQL)
- Persistent data storage
- Workflow definitions (JSONB)
- Execution history
- User management
- Audit logs

### Queue (Redis + BullMQ)
- Job scheduling
- Async task execution
- Retry mechanisms
- Priority queues

### Workers
- Execute workflow nodes
- Handle retries
- Update task status
- Error recovery

### LLM Service (OpenAI)
- Parse natural language
- Generate summaries
- Transform data
- Content generation

### Connectors
- HTTP requests
- Email sending
- Third-party integrations
- Data transformations

## Scalability Considerations

### Horizontal Scaling
- **API**: Multiple Express instances behind load balancer
- **Workers**: Scale worker processes independently
- **Database**: Read replicas for queries
- **Redis**: Redis Cluster for high availability

### Performance
- **Caching**: Redis for frequently accessed data
- **Connection Pooling**: PostgreSQL connection pool
- **Queue Optimization**: Job prioritization and batching
- **CDN**: Static assets served via CDN

### Reliability
- **Retries**: Exponential backoff for failed tasks
- **Dead Letter Queue**: For permanently failed jobs
- **Health Checks**: Monitoring endpoints
- **Logging**: Centralized logging with Winston

## Security Layers

1. **Network**: HTTPS, CORS, Rate Limiting
2. **Authentication**: JWT tokens, bcrypt passwords
3. **Authorization**: Role-based access control
4. **Data**: Encrypted secrets, parameterized queries
5. **Monitoring**: Audit logs, error tracking

## Technology Stack Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | React + Vite | UI/UX |
| Styling | Tailwind CSS | Design system |
| State | Zustand | Client state |
| API | Express.js | REST API |
| Database | PostgreSQL | Data persistence |
| Queue | Redis + BullMQ | Job processing |
| LLM | OpenAI GPT-4 | AI capabilities |
| Auth | JWT | Authentication |
| Email | Nodemailer | Email sending |
| Logging | Winston | Application logs |
| Validation | Joi | Input validation |

---

**This architecture supports:**
- ✅ High availability
- ✅ Horizontal scalability
- ✅ Fault tolerance
- ✅ Real-time processing
- ✅ Secure by design
