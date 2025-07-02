import { http, HttpResponse } from "msw";
import {
  mockWorkflows,
  mockActions,
  mockTriggers,
  createWorkflowFromDto,
} from "./data";
import type { CreateWorkflowDto, UpdateWorkflowDto } from "@/types/workflow";

// In-memory storage for workflows (will reset on page reload)
// eslint-disable-next-line prefer-const
let workflows = [...mockWorkflows];

export const handlers = [
  // Workflow Management Endpoints

  // GET /api/workflows - List all workflows
  http.get("/api/workflows", () => {
    return HttpResponse.json(workflows);
  }),

  // POST /api/workflows - Create a new workflow
  http.post("/api/workflows", async ({ request }) => {
    const newWorkflow = (await request.json()) as CreateWorkflowDto;
    const createdWorkflow = createWorkflowFromDto(newWorkflow);
    workflows.push(createdWorkflow);

    // Simulate some delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json(createdWorkflow, { status: 201 });
  }),

  // GET /api/workflows/:id - Get workflow by ID
  http.get("/api/workflows/:id", ({ params }) => {
    const { id } = params;
    const workflow = workflows.find((w) => w.id === id);

    if (!workflow) {
      return HttpResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(workflow);
  }),

  // PUT /api/workflows/:id - Update workflow
  http.put("/api/workflows/:id", async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as UpdateWorkflowDto;

    const workflowIndex = workflows.findIndex((w) => w.id === id);
    if (workflowIndex === -1) {
      return HttpResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    // Update the workflow
    workflows[workflowIndex] = {
      ...workflows[workflowIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      latestVersion: workflows[workflowIndex].latestVersion + 1,
    };

    // Simulate some delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json(workflows[workflowIndex]);
  }),

  // DELETE /api/workflows/:id - Delete workflow
  http.delete("/api/workflows/:id", async ({ params }) => {
    const { id } = params;
    const workflowIndex = workflows.findIndex((w) => w.id === id);

    if (workflowIndex === -1) {
      return HttpResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    workflows.splice(workflowIndex, 1);

    // Simulate some delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return new HttpResponse(null, { status: 204 });
  }),

  // POST /api/workflows/:id/execute - Execute workflow
  http.post("/api/workflows/:id/execute", async ({ params }) => {
    const { id } = params;

    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) {
      return HttpResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    // Simulate workflow execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const runId = `run-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return HttpResponse.json({
      success: true,
      runId,
      message: `Workflow "${workflow.name}" executed successfully`,
    });
  }),

  // Action Registry Endpoints

  // GET /api/workflow-registry/actions - Get all actions
  http.get("/api/workflow-registry/actions", ({ request }) => {
    const url = new URL(request.url);
    const active = url.searchParams.get("active");

    let filteredActions = mockActions;
    if (active !== null) {
      const isActive = active === "true";
      filteredActions = mockActions.filter(
        (action) => action.isActive === isActive
      );
    }

    return HttpResponse.json(filteredActions);
  }),

  // GET /api/workflow-registry/actions/:key - Get action by key
  http.get("/api/workflow-registry/actions/:key", ({ params }) => {
    const { key } = params;
    const action = mockActions.find((a) => a.key === key);

    if (!action) {
      return HttpResponse.json({ error: "Action not found" }, { status: 404 });
    }

    return HttpResponse.json(action);
  }),

  // GET /api/workflow-registry/actions/category/:category - Get actions by category
  http.get(
    "/api/workflow-registry/actions/category/:category",
    ({ params }) => {
      const { category } = params;
      const filteredActions = mockActions.filter(
        (action) => action.category === category && action.isActive
      );

      return HttpResponse.json(filteredActions);
    }
  ),

  // GET /api/workflow-registry/action/:key/resolved - Get action with resolved schema
  http.get(
    "/api/workflow-registry/action/:key/resolved",
    ({ params, request }) => {
      const { key } = params;
      const url = new URL(request.url);
      const tenantId = url.searchParams.get("tenantId");
      const userId = url.searchParams.get("userId");

      if (!tenantId || !userId) {
        return HttpResponse.json(
          { error: "tenantId and userId are required" },
          { status: 400 }
        );
      }

      const action = mockActions.find((a) => a.key === key);
      if (!action) {
        return HttpResponse.json(
          { error: "Action not found" },
          { status: 404 }
        );
      }

      // Return action with potentially resolved schemas (for now, just return the same)
      return HttpResponse.json({
        ...action,
        resolvedFor: { tenantId, userId },
      });
    }
  ),

  // Trigger Registry Endpoints

  // GET /api/workflow-registry/triggers - Get all triggers
  http.get("/api/workflow-registry/triggers", ({ request }) => {
    const url = new URL(request.url);
    const active = url.searchParams.get("active");

    let filteredTriggers = mockTriggers;
    if (active !== null) {
      const isActive = active === "true";
      filteredTriggers = mockTriggers.filter(
        (trigger) => trigger.isActive === isActive
      );
    }

    return HttpResponse.json(filteredTriggers);
  }),

  // GET /api/workflow-registry/triggers/:key - Get trigger by key
  http.get("/api/workflow-registry/triggers/:key", ({ params }) => {
    const { key } = params;
    const trigger = mockTriggers.find((t) => t.key === key);

    if (!trigger) {
      return HttpResponse.json({ error: "Trigger not found" }, { status: 404 });
    }

    return HttpResponse.json(trigger);
  }),

  // GET /api/workflow-registry/triggers/category/:category - Get triggers by category
  http.get(
    "/api/workflow-registry/triggers/category/:category",
    ({ params }) => {
      const { category } = params;
      const filteredTriggers = mockTriggers.filter(
        (trigger) => trigger.category === category && trigger.isActive
      );

      return HttpResponse.json(filteredTriggers);
    }
  ),

  // GET /api/workflow-registry/triggers/event-source/:eventSource - Get triggers by event source
  http.get(
    "/api/workflow-registry/triggers/event-source/:eventSource",
    ({ params }) => {
      const { eventSource } = params;
      const filteredTriggers = mockTriggers.filter(
        (trigger) => trigger.eventSource === eventSource && trigger.isActive
      );

      return HttpResponse.json(filteredTriggers);
    }
  ),

  // GET /api/workflow-registry/trigger/:key/resolved - Get trigger with resolved schema
  http.get(
    "/api/workflow-registry/trigger/:key/resolved",
    ({ params, request }) => {
      const { key } = params;
      const url = new URL(request.url);
      const tenantId = url.searchParams.get("tenantId");
      const userId = url.searchParams.get("userId");

      if (!tenantId || !userId) {
        return HttpResponse.json(
          { error: "tenantId and userId are required" },
          { status: 400 }
        );
      }

      const trigger = mockTriggers.find((t) => t.key === key);
      if (!trigger) {
        return HttpResponse.json(
          { error: "Trigger not found" },
          { status: 404 }
        );
      }

      // Return trigger with potentially resolved schemas (for now, just return the same)
      return HttpResponse.json({
        ...trigger,
        resolvedFor: { tenantId, userId },
      });
    }
  ),

  // POST /api/workflow-registry/trigger/:triggerKey - Process trigger event
  http.post(
    "/api/workflow-registry/trigger/:triggerKey",
    async ({ params, request }) => {
      const { triggerKey } = params;
      const triggerData = await request.json();
      console.log("triggerData", triggerData);

      const trigger = mockTriggers.find((t) => t.key === triggerKey);
      if (!trigger) {
        return HttpResponse.json(
          { error: "Trigger not found" },
          { status: 404 }
        );
      }

      // Simulate trigger processing
      await new Promise((resolve) => setTimeout(resolve, 300));

      return HttpResponse.json({
        success: true,
        message: `Trigger "${trigger.displayName}" processed successfully`,
        processedAt: new Date().toISOString(),
      });
    }
  ),

  // Schema Endpoints

  // GET /api/workflow-registry/schema/action-properties - Get action property schema
  http.get("/api/workflow-registry/schema/action-properties", () => {
    const actionProperties = {
      properties: [
        {
          displayName: "Action Name",
          name: "name",
          type: "string",
          required: true,
        },
        {
          displayName: "Description",
          name: "description",
          type: "string",
          required: false,
        },
        {
          displayName: "Category",
          name: "category",
          type: "options",
          required: true,
          options: [
            { name: "Internal", value: "internal" },
            { name: "External", value: "external" },
            { name: "AI", value: "ai" },
            { name: "Communication", value: "communication" },
            { name: "Database", value: "database" },
            { name: "Transform", value: "transform" },
            { name: "Logic", value: "logic" },
          ],
        },
      ],
    };

    return HttpResponse.json(actionProperties);
  }),

  // GET /api/workflow-registry/schema/trigger-properties - Get trigger property schema
  http.get("/api/workflow-registry/schema/trigger-properties", () => {
    const triggerProperties = {
      properties: [
        {
          displayName: "Trigger Name",
          name: "name",
          type: "string",
          required: true,
        },
        {
          displayName: "Description",
          name: "description",
          type: "string",
          required: false,
        },
        {
          displayName: "Category",
          name: "category",
          type: "options",
          required: true,
          options: [
            { name: "Webhook", value: "webhook" },
            { name: "Database", value: "database" },
            { name: "Schedule", value: "schedule" },
            { name: "Email", value: "email" },
            { name: "External", value: "external" },
            { name: "Manual", value: "manual" },
          ],
        },
        {
          displayName: "Event Source",
          name: "eventSource",
          type: "options",
          required: true,
          options: [
            { name: "Webhook", value: "webhook" },
            { name: "Debezium", value: "debezium" },
            { name: "Poll", value: "poll" },
            { name: "Manual", value: "manual" },
          ],
        },
      ],
    };

    return HttpResponse.json(triggerProperties);
  }),

  // GET /api - Basic API health check
  http.get("/api", () => {
    return HttpResponse.json({
      message: "Workflow API is running with mock data",
      timestamp: new Date().toISOString(),
    });
  }),
];
