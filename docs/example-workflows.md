# Example Workflows

This document contains example workflow specifications that you can use as templates.

---

## 1. Daily Analytics Email Summary

**Description:** Fetches metrics from an API every morning and sends a summarized email.

**Natural Language:**
```
Every morning at 8 AM IST, fetch https://api.metrics.io/metrics 
and email me a one-paragraph summary to admin@company.com
```

**JSON Specification:**
```json
{
  "name": "Daily Analytics Email Summary",
  "description": "Fetches metrics every morning and sends a summary email",
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
        "url": "https://api.metrics.io/metrics",
        "headers": {
          "Authorization": "Bearer YOUR_API_KEY"
        }
      }
    },
    {
      "id": "n2",
      "type": "llm",
      "name": "Summarize Metrics",
      "config": {
        "prompt": "Summarize the following metrics data in one clear paragraph, highlighting key trends and anomalies:\n\n{{n1.output}}",
        "max_tokens": 500
      }
    },
    {
      "id": "n3",
      "type": "email",
      "name": "Send Summary Email",
      "config": {
        "to": "admin@company.com",
        "subject": "Daily Metrics Summary - {{date}}",
        "body": "Good morning!\n\nHere's your daily metrics summary:\n\n{{n2.output}}\n\nBest regards,\nWorkflow AI"
      }
    }
  ],
  "edges": [
    ["n1", "n2"],
    ["n2", "n3"]
  ]
}
```

---

## 2. Competitor Price Monitoring

**Description:** Scrapes competitor prices weekly and updates a spreadsheet.

**Natural Language:**
```
Every Monday at 9 AM, fetch competitor prices from their API 
and send me an alert if any price changed by more than 10%
```

**JSON Specification:**
```json
{
  "name": "Weekly Competitor Price Monitor",
  "description": "Monitors competitor pricing and alerts on significant changes",
  "trigger": {
    "type": "cron",
    "cron": "0 9 * * 1",
    "tz": "UTC"
  },
  "nodes": [
    {
      "id": "n1",
      "type": "http_fetch",
      "name": "Fetch Competitor Prices",
      "config": {
        "url": "https://api.competitor.com/prices"
      }
    },
    {
      "id": "n2",
      "type": "transform",
      "name": "Calculate Price Changes",
      "config": {
        "script": "const current = context.n1.output; const previous = context.previous || {}; const changes = []; for (const [product, price] of Object.entries(current)) { const oldPrice = previous[product] || price; const change = ((price - oldPrice) / oldPrice) * 100; if (Math.abs(change) > 10) { changes.push({ product, oldPrice, newPrice: price, change: change.toFixed(2) }); } } return { changes, allPrices: current };"
      }
    },
    {
      "id": "n3",
      "type": "llm",
      "name": "Generate Alert",
      "config": {
        "prompt": "Based on these price changes, write a concise alert email:\n\n{{n2.output.changes}}\n\nHighlight the most significant changes and suggest actions.",
        "max_tokens": 400
      }
    },
    {
      "id": "n4",
      "type": "email",
      "name": "Send Alert",
      "config": {
        "to": "pricing-team@company.com",
        "subject": "⚠️ Competitor Price Alert - Week of {{date}}",
        "body": "{{n3.output}}"
      }
    }
  ],
  "edges": [
    ["n1", "n2"],
    ["n2", "n3"],
    ["n3", "n4"]
  ]
}
```

---

## 3. Customer Feedback Analysis

**Description:** Analyzes customer feedback from multiple sources and generates insights.

**Natural Language:**
```
Every day at 6 PM, collect customer feedback from our API, 
analyze sentiment and key themes, then send a summary to the product team
```

**JSON Specification:**
```json
{
  "name": "Daily Customer Feedback Analysis",
  "description": "Collects and analyzes customer feedback with AI",
  "trigger": {
    "type": "cron",
    "cron": "0 18 * * *",
    "tz": "America/New_York"
  },
  "nodes": [
    {
      "id": "n1",
      "type": "http_fetch",
      "name": "Fetch Feedback",
      "config": {
        "url": "https://api.company.com/feedback?since=24h"
      }
    },
    {
      "id": "n2",
      "type": "llm",
      "name": "Analyze Sentiment",
      "config": {
        "prompt": "Analyze the following customer feedback and provide:\n1. Overall sentiment (positive/negative/neutral)\n2. Top 3 themes\n3. Critical issues requiring immediate attention\n4. Positive highlights\n\nFeedback:\n{{n1.output}}\n\nFormat as JSON.",
        "max_tokens": 1000
      }
    },
    {
      "id": "n3",
      "type": "llm",
      "name": "Generate Executive Summary",
      "config": {
        "prompt": "Based on this analysis, write a concise executive summary for the product team:\n\n{{n2.output}}\n\nKeep it under 200 words and actionable.",
        "max_tokens": 300
      }
    },
    {
      "id": "n4",
      "type": "email",
      "name": "Send to Product Team",
      "config": {
        "to": "product-team@company.com",
        "subject": "📊 Daily Customer Feedback Summary",
        "body": "{{n3.output}}\n\n---\nFull Analysis:\n{{n2.output}}"
      }
    }
  ],
  "edges": [
    ["n1", "n2"],
    ["n2", "n3"],
    ["n3", "n4"]
  ]
}
```

---

## 4. Content Publishing Pipeline

**Description:** Generates and publishes blog content based on trending topics.

**Natural Language:**
```
Every Friday, find trending topics in our industry, 
generate a blog post outline, and send it for review
```

**JSON Specification:**
```json
{
  "name": "Weekly Content Pipeline",
  "description": "Automated content ideation and outline generation",
  "trigger": {
    "type": "cron",
    "cron": "0 10 * * 5",
    "tz": "UTC"
  },
  "nodes": [
    {
      "id": "n1",
      "type": "http_fetch",
      "name": "Fetch Trending Topics",
      "config": {
        "url": "https://api.trends.com/topics?industry=tech&limit=10"
      }
    },
    {
      "id": "n2",
      "type": "llm",
      "name": "Select Best Topic",
      "config": {
        "prompt": "From these trending topics, select the one most relevant to our audience (B2B SaaS founders) and explain why:\n\n{{n1.output}}",
        "max_tokens": 300
      }
    },
    {
      "id": "n3",
      "type": "llm",
      "name": "Generate Outline",
      "config": {
        "prompt": "Create a detailed blog post outline for this topic:\n\n{{n2.output}}\n\nInclude:\n- Catchy title\n- Introduction hook\n- 5 main sections with key points\n- Conclusion with CTA\n- SEO keywords",
        "max_tokens": 1000
      }
    },
    {
      "id": "n4",
      "type": "email",
      "name": "Send for Review",
      "config": {
        "to": "content-team@company.com",
        "subject": "📝 New Blog Post Outline - {{date}}",
        "body": "Hi team,\n\nHere's this week's AI-generated blog post outline:\n\n{{n3.output}}\n\nPlease review and let me know if you'd like to proceed with this topic.\n\nBest,\nWorkflow AI"
      }
    }
  ],
  "edges": [
    ["n1", "n2"],
    ["n2", "n3"],
    ["n3", "n4"]
  ]
}
```

---

## 5. Data Backup and Reporting

**Description:** Backs up critical data and generates health reports.

**Natural Language:**
```
Every night at midnight, backup our database, 
check for errors, and send a health report
```

**JSON Specification:**
```json
{
  "name": "Nightly Data Backup & Health Check",
  "description": "Automated backup and system health monitoring",
  "trigger": {
    "type": "cron",
    "cron": "0 0 * * *",
    "tz": "UTC"
  },
  "nodes": [
    {
      "id": "n1",
      "type": "http_post",
      "name": "Trigger Backup",
      "config": {
        "url": "https://api.company.com/backup/trigger",
        "body": {
          "type": "full",
          "timestamp": "{{timestamp}}"
        }
      }
    },
    {
      "id": "n2",
      "type": "http_fetch",
      "name": "Check System Health",
      "config": {
        "url": "https://api.company.com/health/detailed"
      }
    },
    {
      "id": "n3",
      "type": "transform",
      "name": "Analyze Health",
      "config": {
        "script": "const health = context.n2.output; const issues = []; if (health.cpu > 80) issues.push('High CPU usage'); if (health.memory > 90) issues.push('High memory usage'); if (health.disk > 85) issues.push('Low disk space'); return { status: issues.length === 0 ? 'healthy' : 'warning', issues, metrics: health };"
      }
    },
    {
      "id": "n4",
      "type": "email",
      "name": "Send Report",
      "config": {
        "to": "ops-team@company.com",
        "subject": "🔧 Nightly System Report - {{date}}",
        "body": "Backup Status: {{n1.output.status}}\n\nSystem Health: {{n3.output.status}}\n\nIssues: {{n3.output.issues}}\n\nMetrics:\n{{n3.output.metrics}}"
      }
    }
  ],
  "edges": [
    ["n1", "n2"],
    ["n2", "n3"],
    ["n3", "n4"]
  ]
}
```

---

## 6. Lead Qualification Pipeline

**Description:** Qualifies new leads using AI and routes to sales team.

**Natural Language:**
```
When a new lead is added to our CRM, analyze their profile, 
score them, and notify the right sales rep
```

**JSON Specification:**
```json
{
  "name": "AI Lead Qualification",
  "description": "Automated lead scoring and routing",
  "trigger": {
    "type": "webhook",
    "source": "crm",
    "event": "lead.created"
  },
  "nodes": [
    {
      "id": "n1",
      "type": "transform",
      "name": "Extract Lead Data",
      "config": {
        "script": "return { name: context.webhook.lead.name, company: context.webhook.lead.company, email: context.webhook.lead.email, source: context.webhook.lead.source, notes: context.webhook.lead.notes };"
      }
    },
    {
      "id": "n2",
      "type": "llm",
      "name": "Score Lead",
      "config": {
        "prompt": "Analyze this lead and provide a score (1-10) with reasoning:\n\nName: {{n1.output.name}}\nCompany: {{n1.output.company}}\nSource: {{n1.output.source}}\nNotes: {{n1.output.notes}}\n\nConsider: company size, industry fit, urgency signals, budget indicators.\n\nReturn JSON: {score: X, reasoning: '...', priority: 'high|medium|low'}",
        "max_tokens": 400
      }
    },
    {
      "id": "n3",
      "type": "transform",
      "name": "Route to Rep",
      "config": {
        "script": "const score = JSON.parse(context.n2.output).score; const rep = score >= 8 ? 'senior-rep@company.com' : score >= 5 ? 'mid-rep@company.com' : 'junior-rep@company.com'; return { rep, score };"
      }
    },
    {
      "id": "n4",
      "type": "email",
      "name": "Notify Sales Rep",
      "config": {
        "to": "{{n3.output.rep}}",
        "subject": "🎯 New Qualified Lead - {{n1.output.company}}",
        "body": "New lead assigned to you:\n\nName: {{n1.output.name}}\nCompany: {{n1.output.company}}\nEmail: {{n1.output.email}}\n\nAI Score: {{n3.output.score}}/10\n\nAnalysis:\n{{n2.output}}\n\nPlease follow up within 24 hours."
      }
    }
  ],
  "edges": [
    ["n1", "n2"],
    ["n2", "n3"],
    ["n3", "n4"]
  ]
}
```

---

## Usage Tips

1. **Copy & Paste**: Use these as starting templates
2. **Customize**: Adjust URLs, emails, and prompts for your use case
3. **Test First**: Always run a dry-run before activating
4. **Monitor**: Check logs after first few runs
5. **Iterate**: Refine prompts based on output quality

## Creating Your Own

When creating workflows, follow this pattern:

1. **Define the trigger** (cron, webhook, manual)
2. **List the steps** in plain English
3. **Map to node types** (http_fetch, llm, email, etc.)
4. **Connect with edges** (define the flow)
5. **Test with dry-run**
6. **Activate and monitor**

---

**Need more examples?** Check out the [community workflows repository](https://github.com/workflow-ai/examples).
