import type {
  WorkflowResponse,
  ActionRegistryResponse,
  TriggerRegistryResponse,
  WorkflowSegment,
  CreateWorkflowDto,
} from "@/types/workflow";

// Mock Workflows Data
export const mockWorkflows: WorkflowResponse[] = [
  {
    id: "1",
    name: "Welcome Flow",
    description: "Automated welcome sequence for new leads",
    segment: "CRM",
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
    segment: "SALES",
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
    segment: "MARKETING",
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
];

// Mock Triggers Registry Data
export const mockTriggers: TriggerRegistryResponse[] = [
  {
    key: "lead_created",
    name: "leadCreated",
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
  segment: dto.segment as WorkflowSegment,
  latestVersion: 1,
  isActive: dto.isActive ?? false,
  createdBy: dto.createdBy || "current-user",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  trigger: dto.trigger,
  steps: dto.steps || [],
  edges: dto.edges || [],
});
