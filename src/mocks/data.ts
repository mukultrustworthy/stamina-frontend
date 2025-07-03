import type {
  WorkflowResponse,
  ActionRegistryResponse,
  TriggerRegistryResponse,
  CreateWorkflowDto,
} from "@/types/workflow";

// Mock Workflows Data
export const mockWorkflows: WorkflowResponse[] = [
  {
    id: "1",
    name: "Welcome Flow",
    description: "Automated welcome sequence for new leads",
    latestVersion: 1,
    isActive: true,
    createdBy: "user-123",
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T15:30:00Z",
    trigger: {
      triggerKey: "lead_created",
      properties: {
        table_name: "leads",
        change_type: ["INSERT"],
      },
    },
    steps: [
      {
        name: "Send Welcome Email",
        kind: "ACTION",
        actionKey: "send_email",
        configuration: {
          parameters: {
            subject: "Welcome to our platform!",
            template: "welcome_email",
            to: "{{lead.email}}",
          },
          operation: "send",
          resource: "email",
        },
      },
      {
        name: "Create Follow-up Task",
        kind: "ACTION",
        actionKey: "create_task",
        configuration: {
          parameters: {
            title: "Follow up with {{lead.name}}",
            description: "Schedule a call with the new lead",
            due_date: "{{now + 3 days}}",
          },
          operation: "create",
          resource: "task",
        },
      },
    ],
    edges: [
      {
        fromStep: "trigger",
        toStep: "Send Welcome Email",
        branchKey: "default",
      },
      {
        fromStep: "Send Welcome Email",
        toStep: "Create Follow-up Task",
        branchKey: "default",
      },
    ],
  },
  {
    id: "2",
    name: "Lead Qualification",
    description: "Automatically qualify leads based on their activity",
    latestVersion: 2,
    isActive: true,
    createdBy: "user-456",
    createdAt: "2024-11-15T08:00:00Z",
    updatedAt: "2024-12-05T12:00:00Z",
    trigger: {
      triggerKey: "lead_score_updated",
      properties: {
        minimum_score: 80,
      },
      filters: {
        combinator: "AND",
        conditions: [
          {
            variable: "{{lead.score}}",
            operator: "greater_than",
            value: 80,
            type: "number",
          },
        ],
      },
    },
    steps: [
      {
        name: "Update Lead Status",
        kind: "ACTION",
        actionKey: "update_lead_status",
        configuration: {
          parameters: {
            status: "qualified",
            priority: "high",
          },
          operation: "update",
          resource: "lead",
        },
      },
    ],
    edges: [
      {
        fromStep: "trigger",
        toStep: "Update Lead Status",
        branchKey: "default",
      },
    ],
  },
  {
    id: "3",
    name: "Marketing Campaign Follow-up",
    description: "Follow up with leads from marketing campaigns",
    latestVersion: 1,
    isActive: false,
    createdBy: "user-789",
    createdAt: "2024-10-20T14:00:00Z",
    updatedAt: "2024-11-01T09:00:00Z",
    trigger: {
      triggerKey: "campaign_interaction",
      properties: {
        campaign_type: "email",
        interaction_type: "opened",
      },
    },
    steps: [
      {
        name: "Send Follow-up Email",
        kind: "ACTION",
        actionKey: "send_email",
        configuration: {
          parameters: {
            subject: "Thanks for your interest!",
            template: "followup_email",
            delay: "2 hours",
          },
          operation: "send",
          resource: "email",
        },
      },
    ],
    edges: [
      {
        fromStep: "trigger",
        toStep: "Send Follow-up Email",
        branchKey: "default",
      },
    ],
  },
];

// Mock Actions Registry Data
export const mockActions: ActionRegistryResponse[] = [
  {
    key: "send_email",
    name: "sendEmail",
    displayName: "Send Email",
    description: "Send email notifications to leads or customers",
    category: "communication",
    group: ["action"],
    icon: "fa:envelope",
    iconColor: "#3b82f6",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "To",
          name: "to",
          type: "string",
          required: true,
        },
        {
          displayName: "Subject",
          name: "subject",
          type: "string",
          required: true,
        },
        {
          displayName: "Template",
          name: "template",
          type: "options",
          required: true,
          options: [
            { name: "Welcome Email", value: "welcome_email" },
            { name: "Follow-up Email", value: "followup_email" },
            { name: "Reminder Email", value: "reminder_email" },
          ],
        },
      ],
    },
    operationSchema: {
      email: {
        operations: ["send", "schedule"],
        displayName: "Email",
      },
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    key: "create_task",
    name: "createTask",
    displayName: "Create Task",
    description: "Create follow-up tasks and reminders",
    category: "internal",
    group: ["action"],
    icon: "fa:check-square",
    iconColor: "#10b981",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "Title",
          name: "title",
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
          displayName: "Due Date",
          name: "due_date",
          type: "date",
          required: false,
        },
        {
          displayName: "Priority",
          name: "priority",
          type: "options",
          required: false,
          options: [
            { name: "Low", value: "low" },
            { name: "Medium", value: "medium" },
            { name: "High", value: "high" },
          ],
        },
      ],
    },
    operationSchema: {
      task: {
        operations: ["create", "update", "complete"],
        displayName: "Task",
      },
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    key: "update_lead_status",
    name: "updateLeadStatus",
    displayName: "Update Lead Status",
    description: "Update lead status and properties",
    category: "database",
    group: ["action"],
    icon: "fa:user-edit",
    iconColor: "#f59e0b",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "Status",
          name: "status",
          type: "options",
          required: true,
          options: [
            { name: "New", value: "new" },
            { name: "Contacted", value: "contacted" },
            { name: "Qualified", value: "qualified" },
            { name: "Closed", value: "closed" },
          ],
        },
        {
          displayName: "Priority",
          name: "priority",
          type: "options",
          required: false,
          options: [
            { name: "Low", value: "low" },
            { name: "Medium", value: "medium" },
            { name: "High", value: "high" },
          ],
        },
      ],
    },
    operationSchema: {
      lead: {
        operations: ["update", "create"],
        displayName: "Lead",
      },
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    key: "http_request",
    name: "httpRequest",
    displayName: "HTTP Request",
    description: "Make HTTP requests to external APIs",
    category: "external",
    group: ["action"],
    icon: "fa:globe",
    iconColor: "#6366f1",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "URL",
          name: "url",
          type: "string",
          required: true,
        },
        {
          displayName: "Method",
          name: "method",
          type: "options",
          required: true,
          options: [
            { name: "GET", value: "GET" },
            { name: "POST", value: "POST" },
            { name: "PUT", value: "PUT" },
            { name: "DELETE", value: "DELETE" },
          ],
        },
        {
          displayName: "Request Body",
          name: "body",
          type: "string",
          required: false,
        },
        {
          displayName: "Headers",
          name: "headers",
          type: "string",
          required: false,
        },
        {
          displayName: "Timeout (seconds)",
          name: "timeout",
          type: "number",
          required: false,
        },
      ],
    },
    credentialsSchema: {
      required: ["api_auth"],
      optional: ["ssl_cert"],
    },
    operationSchema: {
      api: {
        operations: ["call", "webhook"],
        displayName: "API",
      },
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    key: "ai_generate_text",
    name: "aiGenerateText",
    displayName: "AI Generate Text",
    description: "Generate text using AI models",
    category: "ai",
    group: ["action"],
    icon: "fa:robot",
    iconColor: "#8b5cf6",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "Prompt",
          name: "prompt",
          type: "string",
          required: true,
        },
        {
          displayName: "Model",
          name: "model",
          type: "options",
          required: true,
          options: [
            { name: "GPT-4", value: "gpt-4" },
            { name: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
            { name: "Claude", value: "claude" },
          ],
        },
        {
          displayName: "Max Tokens",
          name: "max_tokens",
          type: "number",
          required: false,
        },
        {
          displayName: "Temperature",
          name: "temperature",
          type: "number",
          required: false,
        },
      ],
    },
    credentialsSchema: {
      required: ["openai_api_key"],
      optional: ["anthropic_api_key"],
    },
    operationSchema: {
      text: {
        operations: ["generate", "complete", "edit"],
        displayName: "Text",
      },
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    key: "database_query",
    name: "databaseQuery",
    displayName: "Database Query",
    description: "Execute database queries and operations",
    category: "database",
    group: ["action"],
    icon: "fa:database",
    iconColor: "#059669",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "Query",
          name: "query",
          type: "string",
          required: true,
        },
        {
          displayName: "Database",
          name: "database",
          type: "options",
          required: true,
          options: [
            { name: "PostgreSQL", value: "postgresql" },
            { name: "MySQL", value: "mysql" },
            { name: "MongoDB", value: "mongodb" },
          ],
        },
        {
          displayName: "Parameters",
          name: "parameters",
          type: "string",
          required: false,
        },
      ],
    },
    credentialsSchema: {
      required: ["database_connection"],
      optional: [],
    },
    operationSchema: {
      database: {
        operations: ["select", "insert", "update", "delete"],
        displayName: "Database",
      },
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    key: "transform_data",
    name: "transformData",
    displayName: "Transform Data",
    description: "Transform and manipulate data using various operations",
    category: "transform",
    group: ["action"],
    icon: "fa:exchange-alt",
    iconColor: "#f59e0b",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "Source Field",
          name: "source_field",
          type: "string",
          required: true,
        },
        {
          displayName: "Target Field",
          name: "target_field",
          type: "string",
          required: true,
        },
        {
          displayName: "Transform Type",
          name: "transform_type",
          type: "options",
          required: true,
          options: [
            { name: "Format Date", value: "format_date" },
            { name: "Uppercase", value: "uppercase" },
            { name: "Lowercase", value: "lowercase" },
            { name: "JSON Parse", value: "json_parse" },
            { name: "Regular Expression", value: "regex" },
          ],
        },
        {
          displayName: "Format Pattern",
          name: "format_pattern",
          type: "string",
          required: false,
        },
      ],
    },
    operationSchema: {
      data: {
        operations: ["transform", "filter", "map"],
        displayName: "Data",
      },
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
];

// Mock Triggers Registry Data
export const mockTriggers: TriggerRegistryResponse[] = [
  {
    key: "lead_created",
    name: "leadCreated",
    icon: "fa:user-plus",
    iconColor: "#059669",
    displayName: "Lead Created",
    description: "Triggers when a new lead is created in the system",
    category: "database",
    eventSource: "debezium",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "Table Name",
          name: "table_name",
          type: "string",
          required: true,
        },
        {
          displayName: "Change Type",
          name: "change_type",
          type: "options",
          required: true,
          options: [
            { name: "Insert", value: "INSERT" },
            { name: "Update", value: "UPDATE" },
            { name: "Delete", value: "DELETE" },
          ],
        },
      ],
    },
    filterSchema: {
      fields: [
        {
          displayName: "Lead Status",
          name: "status",
          type: "string",
          operators: ["equals", "not_equals", "in", "not_in"],
        },
        {
          displayName: "Lead Source",
          name: "source",
          type: "string",
          operators: ["equals", "contains", "starts_with"],
        },
      ],
    },
    samplePayload: {
      id: "lead-123",
      name: "John Doe",
      email: "john@example.com",
      status: "new",
      source: "website",
      created_at: "2024-12-01T10:00:00Z",
    },
    availableVariables: {
      "lead.id": "string",
      "lead.name": "string",
      "lead.email": "string",
      "lead.status": "string",
      "lead.source": "string",
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    key: "lead_score_updated",
    name: "leadScoreUpdated",
    icon: "fa:user-plus",
    iconColor: "#059669",
    displayName: "Lead Score Updated",
    description: "Triggers when a lead score changes",
    category: "database",
    eventSource: "debezium",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "Minimum Score",
          name: "minimum_score",
          type: "number",
          required: false,
        },
        {
          displayName: "Score Increase Threshold",
          name: "score_threshold",
          type: "number",
          required: false,
        },
      ],
    },
    filterSchema: {
      fields: [
        {
          displayName: "Lead Score",
          name: "score",
          type: "number",
          operators: ["greater_than", "less_than", "between", "equals"],
        },
        {
          displayName: "Previous Score",
          name: "previous_score",
          type: "number",
          operators: ["greater_than", "less_than", "between", "equals"],
        },
      ],
    },
    samplePayload: {
      lead_id: "lead-123",
      score: 85,
      previous_score: 70,
      timestamp: "2024-12-01T10:00:00Z",
    },
    availableVariables: {
      "lead.score": "number",
      "lead.previous_score": "number",
      "lead.id": "string",
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    key: "campaign_interaction",
    name: "campaignInteraction",
    icon: "fa:user-plus",
    iconColor: "#059669",
    displayName: "Campaign Interaction",
    description: "Triggers when someone interacts with a marketing campaign",
    category: "email",
    eventSource: "webhook",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "Campaign Type",
          name: "campaign_type",
          type: "options",
          required: true,
          options: [
            { name: "Email", value: "email" },
            { name: "SMS", value: "sms" },
            { name: "Social Media", value: "social" },
          ],
        },
        {
          displayName: "Interaction Type",
          name: "interaction_type",
          type: "options",
          required: true,
          options: [
            { name: "Opened", value: "opened" },
            { name: "Clicked", value: "clicked" },
            { name: "Replied", value: "replied" },
          ],
        },
      ],
    },
    webhookConfig: {
      methods: ["POST"],
      auth_required: false,
      response_mode: "onReceived",
    },
    samplePayload: {
      campaign_id: "campaign-456",
      lead_id: "lead-123",
      interaction_type: "opened",
      timestamp: "2024-12-01T10:00:00Z",
    },
    availableVariables: {
      "campaign.id": "string",
      "campaign.name": "string",
      "lead.id": "string",
      "interaction.type": "string",
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    key: "webhook_received",
    name: "webhookReceived",
    icon: "fa:user-plus",
    iconColor: "#059669",
    displayName: "Webhook Received",
    description: "Triggers when a webhook endpoint receives data",
    category: "webhook",
    eventSource: "webhook",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "HTTP Method",
          name: "http_method",
          type: "options",
          required: true,
          options: [
            { name: "POST", value: "POST" },
            { name: "PUT", value: "PUT" },
            { name: "PATCH", value: "PATCH" },
          ],
        },
        {
          displayName: "Endpoint Path",
          name: "endpoint_path",
          type: "string",
          required: true,
        },
        {
          displayName: "Authentication Required",
          name: "auth_required",
          type: "options",
          required: false,
          options: [
            { name: "Yes", value: "true" },
            { name: "No", value: "false" },
          ],
        },
      ],
    },
    filterSchema: {
      fields: [
        {
          displayName: "Request Body",
          name: "body",
          type: "object",
          operators: ["exists", "not_exists", "contains"],
        },
        {
          displayName: "Headers",
          name: "headers",
          type: "object",
          operators: ["exists", "contains"],
        },
        {
          displayName: "Source IP",
          name: "source_ip",
          type: "string",
          operators: ["equals", "not_equals", "contains"],
        },
      ],
    },
    webhookConfig: {
      methods: ["POST", "PUT", "PATCH"],
      auth_required: false,
      response_mode: "onReceived",
    },
    samplePayload: {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "GitHub-Hookshot/abc123",
      },
      body: {
        event: "push",
        repository: "my-repo",
        data: "sample data",
      },
      source_ip: "192.168.1.1",
      timestamp: "2024-12-01T10:00:00Z",
    },
    availableVariables: {
      "webhook.method": "string",
      "webhook.headers": "object",
      "webhook.body": "object",
      "webhook.source_ip": "string",
      "webhook.timestamp": "string",
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    key: "schedule_trigger",
    name: "scheduleTrigger",
    icon: "fa:user-plus",
    iconColor: "#059669",
    displayName: "Schedule Trigger",
    description: "Triggers at specified time intervals or cron schedule",
    category: "schedule",
    eventSource: "poll",
    version: 1,
    isActive: true,
    propertiesSchema: {
      properties: [
        {
          displayName: "Schedule Type",
          name: "schedule_type",
          type: "options",
          required: true,
          options: [
            { name: "Interval", value: "interval" },
            { name: "Cron Expression", value: "cron" },
            { name: "Daily", value: "daily" },
            { name: "Weekly", value: "weekly" },
          ],
        },
        {
          displayName: "Interval (minutes)",
          name: "interval_minutes",
          type: "number",
          required: false,
        },
        {
          displayName: "Cron Expression",
          name: "cron_expression",
          type: "string",
          required: false,
        },
        {
          displayName: "Time Zone",
          name: "timezone",
          type: "options",
          required: false,
          options: [
            { name: "UTC", value: "UTC" },
            { name: "America/New_York", value: "America/New_York" },
            { name: "America/Los_Angeles", value: "America/Los_Angeles" },
            { name: "Europe/London", value: "Europe/London" },
          ],
        },
      ],
    },
    samplePayload: {
      trigger_time: "2024-12-01T10:00:00Z",
      schedule_type: "daily",
      timezone: "UTC",
    },
    availableVariables: {
      "schedule.trigger_time": "string",
      "schedule.type": "string",
      "schedule.timezone": "string",
    },
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
];

// Helper function to generate new workflow IDs
export const generateWorkflowId = () =>
  `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper function to create new workflow from create DTO
export const createWorkflowFromDto = (
  dto: CreateWorkflowDto
): WorkflowResponse => ({
  id: generateWorkflowId(),
  name: dto.name,
  description: dto.description,
  latestVersion: 1,
  isActive: dto.isActive ?? false,
  createdBy: dto.createdBy || "current-user",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  trigger: dto.trigger,
  steps: dto.steps || [],
  edges: dto.edges || [],
});
