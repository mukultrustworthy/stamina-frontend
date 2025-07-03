// Workflow API Types based on swagger documentation

export type ActionCategory =
  | "internal"
  | "external"
  | "ai"
  | "communication"
  | "database"
  | "transform"
  | "logic";

export type TriggerCategory =
  | "webhook"
  | "database"
  | "schedule"
  | "email"
  | "external"
  | "manual";

export type EventSource = "webhook" | "debezium" | "poll" | "manual";

export type StepKind = "ACTION" | "CONDITION" | "DELAY" | "LOOP";

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than"
  | "between"
  | "in"
  | "not_in"
  | "is_empty"
  | "is_not_empty"
  | "starts_with"
  | "ends_with"
  | "after"
  | "before";

export type FilterCombinator = "AND" | "OR";

export interface WorkflowFilterCondition {
  variable: string;
  operator: FilterOperator;
  value: unknown;
  type: "string" | "number" | "boolean" | "date";
}

export interface FilterGroup {
  combinator: FilterCombinator;
  conditions: WorkflowFilterCondition[];
}

// Action Registry Types
export interface ActionRegistryResponse {
  key: string;
  name: string;
  displayName: string;
  description?: string;
  category: ActionCategory;
  group: ("action" | "trigger")[];
  icon?: string;
  iconColor?: string;
  documentationUrl?: string;
  version: number;
  isActive: boolean;
  propertiesSchema: {
    properties: PropertySchema[];
  };
  credentialsSchema?: {
    required: string[];
    optional: string[];
  };
  operationSchema?: Record<
    string,
    {
      operations: string[];
      displayName: string;
    }
  >;
  createdAt: string;
  updatedAt: string;
}

// Trigger Registry Types
export interface TriggerRegistryResponse {
  key: string;
  name: string;
  icon?: string;
  iconColor?: string;
  displayName: string;
  description?: string;
  category: TriggerCategory;
  eventSource: EventSource;
  version: number;
  isActive: boolean;
  propertiesSchema: {
    properties: PropertySchema[];
  };
  filterSchema?: {
    fields: FilterFieldSchema[];
  };
  samplePayload?: Record<string, unknown>;
  webhookConfig?: {
    methods: string[];
    auth_required: boolean;
    response_mode: string;
  };
  availableVariables?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface PropertySchema {
  displayName: string;
  name: string;
  type: string;
  required: boolean;
  options?: Array<{ name: string; value: string }>;
}

export interface FilterFieldSchema {
  displayName: string;
  name: string;
  type: string;
  operators: string[];
}

// Workflow Configuration Types
export interface TriggerConfiguration {
  triggerKey: string;
  properties: Record<string, unknown>;
  filters?: FilterGroup;
}

export interface StepConfiguration {
  parameters: Record<string, unknown>;
  resource?: string;
  operation?: string;
  credentialId?: string;
}

export interface WorkflowStep {
  name: string;
  kind: StepKind;
  actionKey?: string;
  configuration: StepConfiguration;
}

export interface WorkflowEdge {
  fromStep: string;
  toStep: string;
  branchKey?: string;
}

// Workflow DTOs
export interface CreateWorkflowDto {
  name: string;
  description?: string;
  trigger: TriggerConfiguration;
  steps: WorkflowStep[];
  edges: WorkflowEdge[];
  isActive?: boolean;
  createdBy?: string;
}

export interface UpdateWorkflowDto {
  name?: string;
  description?: string;
  trigger?: TriggerConfiguration;
  steps?: WorkflowStep[];
  edges?: WorkflowEdge[];
  isActive?: boolean;
}

export interface WorkflowResponse {
  id: string;
  name: string;
  description?: string;
  latestVersion: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  trigger: TriggerConfiguration;
  steps: WorkflowStep[];
  edges: WorkflowEdge[];
}

export interface WorkflowExecution {
  triggerData: Record<string, unknown>;
  variables?: Record<string, unknown>;
  userId?: string;
}

export interface WorkflowExecutionResult {
  success: boolean;
  runId?: string;
  error?: string;
}

// UI Types (for the workflow editor)
export interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition" | "delay" | "loop";
  position: { x: number; y: number };
  data: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    canDelete?: boolean;
    // Registry information
    registryKey?: string;
    registryData?: ActionRegistryResponse | TriggerRegistryResponse;
    // Configuration
    configuration?: StepConfiguration | TriggerConfiguration;
    // UI state
    onEdit?: (nodeId: string) => void;
    onDelete?: (nodeId: string) => void;
    onAddAction?: () => void;
  };
}

export interface WorkflowEditorState {
  workflowId?: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    type?: string;
  }>;
  isActive: boolean;
}

// Campaign Execution Types
export interface CampaignExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  startedAt: string;
  completedAt?: string;
  triggerData: Record<string, unknown>;
  variables?: Record<string, unknown>;
  userId?: string;
  currentStepIndex: number;
  totalSteps: number;
  steps: CampaignExecutionStep[];
  logs: CampaignExecutionLog[];
  error?: string;
  progress: number; // 0-100
}

export interface CampaignExecutionStep {
  id: string;
  name: string;
  type: "trigger" | "action" | "condition" | "delay" | "loop";
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt?: string;
  completedAt?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  duration?: number; // in milliseconds
  retryCount?: number;
}

export interface CampaignExecutionLog {
  id: string;
  stepId?: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  message: string;
  details?: Record<string, unknown>;
}

export interface CampaignStartRequest {
  workflowId?: string;
  workflowName: string;
  nodes: WorkflowNode[];
  triggerData?: Record<string, unknown>;
  variables?: Record<string, unknown>;
  testMode?: boolean;
}

export interface CampaignExecutionStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  lastExecutionAt?: string;
}
