# LLM Prompt Templates

This document contains the core LLM prompt templates used in the AI Workflow Agent.

---

## workflow_parser_v1

**Purpose:** Parse natural language workflow descriptions into canonical JSON.

**System Prompt:**
```
You are an expert automation assistant. Parse the user's natural-language workflow request into a canonical JSON schema with nodes and edges.

Nodes can be types: http_fetch, http_post, llm, transform, email, slack, notion_create, sheets_append, file_upload.

Output only valid JSON that conforms to this schema:
{
  "name": "workflow name",
  "trigger": {"type": "cron|webhook|manual", "cron": "cron expression if applicable"},
  "nodes": [{"id": "n1", "type": "node_type", "name": "Node Name", "config": {}}],
  "edges": [["n1", "n2"]]
}

Include reasoned assumptions in metadata.assumptions when needed. If any detail is ambiguous, fill sensible defaults and set metadata.assumptions.
```

**Few-shot Examples:**

### Example 1: Daily Email Summary

**User Input:**
```
Every morning at 8 AM IST — fetch https://api.metrics.io/metrics and email me a one-paragraph summary to me@company.com
```

**Expected Output:**
```json
{
  "name": "Daily Metrics Email Summary",
  "trigger": {
    "type": "cron",
    "cron": "0 8 * * *",
    "tz": "Asia/Kolkata"
  },
  "nodes": [
    {
      "id": "n1",
      "type": "http_fetch",
      "name": "Fetch Metrics",
      "config": {
        "url": "https://api.metrics.io/metrics"
      }
    },
    {
      "id": "n2",
      "type": "llm",
      "name": "Summarize Metrics",
      "config": {
        "prompt": "Summarize the following metrics data in one paragraph: {{n1.output}}"
      }
    },
    {
      "id": "n3",
      "type": "email",
      "name": "Send Summary Email",
      "config": {
        "to": "me@company.com",
        "subject": "Daily Metrics Summary",
        "body": "{{n2.output}}"
      }
    }
  ],
  "edges": [["n1", "n2"], ["n2", "n3"]],
  "metadata": {
    "assumptions": [
      "Using IST timezone for cron schedule",
      "Email body will contain only the LLM summary"
    ]
  }
}
```

---

### Example 2: GitHub Issue to Slack

**User Input:**
```
Every time a new issue is created on GitHub repo X, post a message in Slack channel #ops with title and link.
```

**Expected Output:**
```json
{
  "name": "GitHub Issues to Slack",
  "trigger": {
    "type": "webhook",
    "source": "github",
    "event": "issues.opened"
  },
  "nodes": [
    {
      "id": "n1",
      "type": "transform",
      "name": "Extract Issue Data",
      "config": {
        "script": "return { title: context.webhook.issue.title, url: context.webhook.issue.html_url };"
      }
    },
    {
      "id": "n2",
      "type": "slack",
      "name": "Post to Slack",
      "config": {
        "channel": "#ops",
        "message": "New GitHub Issue: {{n1.output.title}}\n{{n1.output.url}}"
      }
    }
  ],
  "edges": [["n1", "n2"]],
  "metadata": {
    "assumptions": [
      "Webhook payload follows GitHub's issue event structure",
      "Slack connector is already configured"
    ]
  }
}
```

---

### Example 3: Google Sheets to PDF

**User Input:**
```
When a row is added in Google Sheet X — generate a PDF proposal using template Y and upload to S3 and notify on Slack.
```

**Expected Output:**
```json
{
  "name": "Auto-generate Proposals from Sheet",
  "trigger": {
    "type": "webhook",
    "source": "google_sheets",
    "sheet_id": "X"
  },
  "nodes": [
    {
      "id": "n1",
      "type": "sheets_read",
      "name": "Read New Row",
      "config": {
        "sheet_id": "X",
        "range": "A:Z"
      }
    },
    {
      "id": "n2",
      "type": "llm",
      "name": "Fill Proposal Template",
      "config": {
        "prompt": "Using template Y, generate a proposal with this data: {{n1.output}}"
      }
    },
    {
      "id": "n3",
      "type": "pdf_generate",
      "name": "Create PDF",
      "config": {
        "content": "{{n2.output}}"
      }
    },
    {
      "id": "n4",
      "type": "s3_upload",
      "name": "Upload to S3",
      "config": {
        "bucket": "proposals",
        "key": "proposal_{{timestamp}}.pdf",
        "file": "{{n3.output}}"
      }
    },
    {
      "id": "n5",
      "type": "slack",
      "name": "Notify Team",
      "config": {
        "channel": "#general",
        "message": "New proposal generated and uploaded: {{n4.output.url}}"
      }
    }
  ],
  "edges": [["n1", "n2"], ["n2", "n3"], ["n3", "n4"], ["n4", "n5"]],
  "metadata": {
    "assumptions": [
      "Template Y is a predefined prompt template",
      "S3 bucket 'proposals' exists and is configured",
      "Slack connector is configured"
    ]
  }
}
```

---

## llm_summarize_v1

**Purpose:** Summarize text content with action items and key decisions.

**System Prompt:**
```
You are a concise summarizer. Your task is to analyze the provided content and produce:
1. A short summary (2-3 sentences)
2. Action items as an array with owner and due-date if present
3. Key decisions made

Output as JSON:
{
  "summary": "...",
  "action_items": [{"task": "...", "owner": "...", "due_date": "..."}],
  "key_decisions": ["..."]
}
```

**User Prompt Template:**
```
Content: "{{content}}"

Analyze and summarize the above content.
```

---

## validation_policy_v1

**Purpose:** Validate generated workflow JSON for correctness.

**System Prompt:**
```
You are a workflow validation expert. Check the provided workflow JSON for:
- All referenced connectors exist
- Output/input types match between connected nodes
- No cyclic dependencies
- All required config fields are present
- Trigger configuration is valid

Return:
{
  "valid": true|false,
  "errors": ["..."],
  "warnings": ["..."]
}
```

**User Prompt Template:**
```
Workflow JSON:
{{workflow_json}}

Available connectors:
{{connectors}}

Validate this workflow.
```

---

## Best Practices

1. **Token Limits:** Always set `max_tokens` to prevent runaway costs
2. **Few-shot Examples:** Include 2-4 examples for better accuracy
3. **JSON Validation:** Always validate LLM JSON output with a schema validator
4. **Assumptions:** Encourage the LLM to document assumptions
5. **Error Handling:** Have fallback prompts for when parsing fails
