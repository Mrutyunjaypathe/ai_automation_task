# API Reference

Base URL: `http://localhost:3000/api`

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication

### POST /auth/signup

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  },
  "token": "jwt-token"
}
```

---

### POST /auth/login

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  },
  "token": "jwt-token"
}
```

---

### GET /auth/me

Get current user information.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "member",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## Workflows

### GET /workflows

List all workflows for the authenticated user.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "owner_id": "uuid",
    "name": "Daily Analytics",
    "description": "Fetch and summarize metrics",
    "spec_json": {...},
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### GET /workflows/:id

Get a specific workflow.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "owner_id": "uuid",
  "name": "Daily Analytics",
  "description": "Fetch and summarize metrics",
  "spec_json": {
    "trigger": {"type": "cron", "cron": "0 8 * * *"},
    "nodes": [...],
    "edges": [...]
  },
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### POST /workflows

Create a new workflow.

**Request Body:**
```json
{
  "name": "My Workflow",
  "description": "Description here",
  "spec_json": {
    "trigger": {"type": "manual"},
    "nodes": [
      {"id": "n1", "type": "http_fetch", "name": "Fetch Data", "config": {...}}
    ],
    "edges": []
  }
}
```

**Response:** `201 Created`

---

### PUT /workflows/:id

Update a workflow.

**Request Body:** Same as POST

**Response:** `200 OK`

---

### DELETE /workflows/:id

Delete a workflow.

**Response:** `200 OK`
```json
{
  "message": "Workflow deleted"
}
```

---

### POST /workflows/:id/dry-run

Simulate workflow execution without side effects.

**Request Body:** (optional)
```json
{
  "input": "test data"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Dry run completed successfully",
  "simulation": {
    "nodes_executed": 3,
    "estimated_duration": "~30s"
  }
}
```

---

### POST /workflows/:id/run

Execute the workflow immediately.

**Request Body:** (optional)
```json
{
  "input": "runtime data"
}
```

**Response:** `202 Accepted`
```json
{
  "id": "run-uuid",
  "workflow_id": "workflow-uuid",
  "run_status": "pending",
  "started_at": "2024-01-01T00:00:00Z"
}
```

---

### POST /workflows/:id/activate

Activate scheduled triggers for the workflow.

**Response:** `200 OK`

---

### GET /workflows/:id/runs

Get execution history for a workflow.

**Response:** `200 OK`
```json
[
  {
    "id": "run-uuid",
    "workflow_id": "workflow-uuid",
    "run_status": "success",
    "started_at": "2024-01-01T08:00:00Z",
    "finished_at": "2024-01-01T08:00:30Z"
  }
]
```

---

## Runs

### GET /runs/:runId

Get details of a specific run.

**Response:** `200 OK`
```json
{
  "id": "run-uuid",
  "workflow_id": "workflow-uuid",
  "run_status": "success",
  "input_payload": {...},
  "result_summary": {...},
  "started_at": "2024-01-01T08:00:00Z",
  "finished_at": "2024-01-01T08:00:30Z"
}
```

---

### POST /runs/:runId/retry

Retry a failed workflow run.

**Response:** `200 OK`
```json
{
  "message": "Run retry initiated"
}
```

---

## Connectors

### GET /connectors

List all connectors for the authenticated user.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "owner_id": "uuid",
    "name": "My API",
    "type": "http",
    "config": {...},
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### POST /connectors

Create a new connector.

**Request Body:**
```json
{
  "name": "Gmail SMTP",
  "type": "smtp",
  "config": {
    "host": "smtp.gmail.com",
    "port": 587
  }
}
```

**Response:** `201 Created`

---

### DELETE /connectors/:id

Delete a connector.

**Response:** `200 OK`
```json
{
  "message": "Connector deleted"
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": {
    "message": "Error description"
  }
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error
