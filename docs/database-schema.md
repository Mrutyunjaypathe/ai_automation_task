# Database Schema

## Overview

The AI Workflow Agent uses PostgreSQL as its primary database. This document describes the complete schema.

## Tables

### users

Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | User's full name |
| email | VARCHAR(255) | Unique email address |
| password | VARCHAR(255) | Bcrypt hashed password |
| role | VARCHAR(50) | User role (admin, member) |
| created_at | TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**
- Unique index on `email`

---

### workflows

Stores workflow definitions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| owner_id | UUID | Foreign key to users |
| name | VARCHAR(255) | Workflow name |
| description | TEXT | Workflow description |
| spec_json | JSONB | Canonical workflow specification |
| llm_prompt_version | VARCHAR(50) | LLM prompt version used |
| status | VARCHAR(50) | Status (draft, active, archived) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**
- Index on `owner_id`

**spec_json structure:**
```json
{
  "trigger": {"type": "cron|webhook|manual", "cron": "..."},
  "nodes": [{"id": "n1", "type": "...", "name": "...", "config": {}}],
  "edges": [["n1", "n2"]]
}
```

---

### workflow_runs

Stores execution history of workflows.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| workflow_id | UUID | Foreign key to workflows |
| run_status | VARCHAR(50) | Status (pending, running, success, failed) |
| input_payload | JSONB | Input data for the run |
| result_summary | JSONB | Execution results |
| started_at | TIMESTAMP | Start timestamp |
| finished_at | TIMESTAMP | Completion timestamp |

**Indexes:**
- Index on `workflow_id`

---

### tasks

Stores individual task executions within a workflow run.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| workflow_run_id | UUID | Foreign key to workflow_runs |
| node_id | VARCHAR(255) | Node ID from spec |
| task_status | VARCHAR(50) | Status (pending, running, success, failed) |
| attempt_count | INTEGER | Number of retry attempts |
| logs | JSONB | Execution logs and outputs |
| started_at | TIMESTAMP | Start timestamp |
| finished_at | TIMESTAMP | Completion timestamp |

**Indexes:**
- Index on `workflow_run_id`

---

### connectors

Stores external service connection configurations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| owner_id | UUID | Foreign key to users |
| name | VARCHAR(255) | Connector name |
| type | VARCHAR(100) | Connector type (http, smtp, google_sheets, etc.) |
| config | JSONB | Configuration data |
| secrets_ref | VARCHAR(255) | Reference to encrypted secrets |
| created_at | TIMESTAMP | Creation timestamp |

**Indexes:**
- Index on `owner_id`

---

### secrets

Stores encrypted credentials and API keys.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| owner_id | UUID | Foreign key to users |
| name | VARCHAR(255) | Secret name |
| encrypted_payload | TEXT | Encrypted secret data |
| created_at | TIMESTAMP | Creation timestamp |

---

### audit_logs

Stores audit trail of user actions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| actor_id | UUID | Foreign key to users (nullable) |
| action | VARCHAR(100) | Action performed |
| resource_type | VARCHAR(100) | Type of resource affected |
| resource_id | UUID | ID of affected resource |
| details | JSONB | Additional details |
| created_at | TIMESTAMP | Action timestamp |

**Indexes:**
- Index on `actor_id`

---

## Relationships

```
users (1) ──< (N) workflows
workflows (1) ──< (N) workflow_runs
workflow_runs (1) ──< (N) tasks
users (1) ──< (N) connectors
users (1) ──< (N) secrets
users (1) ──< (N) audit_logs
```

## Migration

Run migrations using:
```bash
npm run db:migrate
```

## Seeding

Seed demo data using:
```bash
npm run db:seed
```

This creates:
- Demo user: `admin@example.com` / `password123`
- Sample workflow
- Sample connector
