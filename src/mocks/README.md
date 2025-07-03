# Mock API Documentation

This directory contains Mock Service Worker (MSW) setup for simulating the backend API during development.

## What's Included

### Mock Data (`data.ts`)

- **3 sample workflows** with different segments (CRM, SALES, MARKETING)
- **3 action types** in the registry (send_email, create_task, update_lead_status)
- **3 trigger types** in the registry (lead_created, lead_score_updated, campaign_interaction)
- Complete mock data that matches the TypeScript interfaces from the swagger documentation

### API Handlers (`handlers.ts`)

All workflow API endpoints are mocked and fully functional:

#### Workflow Management

- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create new workflow
- `GET /api/workflows/:id` - Get workflow by ID
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/execute` - Execute workflow

#### Action Registry

- `GET /api/workflow-registry/actions` - List all actions (with ?active filter)
- `GET /api/workflow-registry/actions/:key` - Get action by key
- `GET /api/workflow-registry/actions/category/:category` - Get actions by category
- `GET /api/workflow-registry/action/:key/resolved` - Get action with resolved schema

#### Trigger Registry

- `GET /api/workflow-registry/triggers` - List all triggers (with ?active filter)
- `GET /api/workflow-registry/triggers/:key` - Get trigger by key
- `GET /api/workflow-registry/triggers/category/:category` - Get triggers by category
- `GET /api/workflow-registry/triggers/event-source/:eventSource` - Get triggers by event source
- `GET /api/workflow-registry/trigger/:key/resolved` - Get trigger with resolved schema
- `POST /api/workflow-registry/trigger/:triggerKey` - Process trigger event

#### Schema Endpoints

- `GET /api/workflow-registry/schema/action-properties` - Get action property schema
- `GET /api/workflow-registry/schema/trigger-properties` - Get trigger property schema

## Features

### ✅ Fully Functional CRUD

- Create new workflows with proper validation
- Update existing workflows (increments version number)
- Delete workflows with confirmation
- List and filter workflows

### ✅ Realistic API Behavior

- HTTP status codes (200, 201, 404, etc.)
- Simulated network delays
- Proper error responses
- In-memory persistence (resets on page reload)

### ✅ Development Experience

- Console logging when MSW starts
- Automatic startup in development mode only
- Bypasses unhandled requests (won't break other APIs)

## How It Works

1. **MSW Service Worker** intercepts HTTP requests in the browser
2. **Handlers** match request patterns and return mock responses
3. **Mock Data** provides realistic sample data
4. **In-Memory Storage** maintains state during the session

## Available Sample Data

### Workflows

1. **Welcome Flow** (CRM) - Active workflow with email + task creation
2. **Lead Qualification** (SALES) - Active workflow with lead scoring
3. **Marketing Campaign Follow-up** (MARKETING) - Inactive workflow

### Actions

- **Send Email** - Communication action with template options
- **Create Task** - Internal action for task management
- **Update Lead Status** - Database action for lead updates

### Triggers

- **Lead Created** - Database trigger for new leads
- **Lead Score Updated** - Scoring trigger with filters
- **Campaign Interaction** - Webhook trigger for marketing events

## Testing the API

You can test the mock API directly in your browser's developer console:

```javascript
// List all workflows
fetch("/api/workflows")
  .then((r) => r.json())
  .then(console.log);

// Get a specific workflow
fetch("/api/workflows/1")
  .then((r) => r.json())
  .then(console.log);

// Create a new workflow
fetch("/api/workflows", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test Workflow",
    description: "A test workflow",
    segment: "CRM",
    trigger: { triggerKey: "manual_trigger", properties: {} },
    steps: [],
    edges: [],
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

## Next Steps

When you're ready to connect to a real backend:

1. Update the `API_BASE_URL` in `src/api/workflows.ts`
2. Remove the MSW import from `src/main.tsx`
3. The TypeScript interfaces and React Query hooks will work seamlessly with the real API

The mock setup exactly matches the swagger documentation, so the transition should be smooth! 🚀
