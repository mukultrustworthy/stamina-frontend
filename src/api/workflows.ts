import type {
  WorkflowResponse,
  CreateWorkflowDto,
  UpdateWorkflowDto,
  WorkflowExecution,
  WorkflowExecutionResult,
  ActionRegistryResponse,
  TriggerRegistryResponse,
  ActionCategory,
  TriggerCategory,
  EventSource,
  PropertySchema,
} from "@/types/workflow";
import { apiRequest } from "./handler";

/**
 * Workflow Management API
 */
export const workflowApi = {
  /**
   * Create a new workflow
   */
  createWorkflow: async (
    workflow: CreateWorkflowDto
  ): Promise<WorkflowResponse> => {
    return apiRequest<WorkflowResponse>("/workflows", {
      method: "POST",
      body: JSON.stringify(workflow),
    });
  },

  /**
   * Get all workflows
   */
  listWorkflows: async (): Promise<WorkflowResponse[]> => {
    return apiRequest<WorkflowResponse[]>("/workflows");
  },

  /**
   * Get workflow by ID
   */
  getWorkflow: async (id: string): Promise<WorkflowResponse> => {
    return apiRequest<WorkflowResponse>(`/workflows/${id}`);
  },

  /**
   * Update workflow
   */
  updateWorkflow: async (
    id: string,
    updates: UpdateWorkflowDto
  ): Promise<WorkflowResponse> => {
    return apiRequest<WorkflowResponse>(`/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete workflow
   */
  deleteWorkflow: async (id: string): Promise<void> => {
    return apiRequest<void>(`/workflows/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Execute workflow manually
   */
  executeWorkflow: async (
    id: string,
    execution: WorkflowExecution
  ): Promise<WorkflowExecutionResult> => {
    return apiRequest<WorkflowExecutionResult>(`/workflows/${id}/execute`, {
      method: "POST",
      body: JSON.stringify(execution),
    });
  },
};

/**
 * Workflow Registry API for Actions
 */
export const actionRegistryApi = {
  /**
   * Get all actions
   */
  getAllActions: async (
    active?: boolean
  ): Promise<ActionRegistryResponse[]> => {
    const params = active !== undefined ? `?active=${active}` : "";
    return apiRequest<ActionRegistryResponse[]>(
      `/workflow-registry/actions${params}`
    );
  },

  /**
   * Get action by key
   */
  getActionByKey: async (key: string): Promise<ActionRegistryResponse> => {
    return apiRequest<ActionRegistryResponse>(
      `/workflow-registry/actions/${key}`
    );
  },

  /**
   * Get actions by category
   */
  getActionsByCategory: async (
    category: ActionCategory
  ): Promise<ActionRegistryResponse[]> => {
    return apiRequest<ActionRegistryResponse[]>(
      `/workflow-registry/actions/category/${category}`
    );
  },

  /**
   * Get action with resolved schema
   */
  getActionWithResolvedSchema: async (
    key: string,
    tenantId: string,
    userId: string
  ): Promise<ActionRegistryResponse> => {
    return apiRequest<ActionRegistryResponse>(
      `/workflow-registry/action/${key}/resolved?tenantId=${tenantId}&userId=${userId}`
    );
  },
};

/**
 * Workflow Registry API for Triggers
 */
export const triggerRegistryApi = {
  /**
   * Get all triggers
   */
  getAllTriggers: async (
    active?: boolean
  ): Promise<TriggerRegistryResponse[]> => {
    const params = active !== undefined ? `?active=${active}` : "";
    return apiRequest<TriggerRegistryResponse[]>(
      `/workflow-registry/triggers${params}`
    );
  },

  /**
   * Get trigger by key
   */
  getTriggerByKey: async (key: string): Promise<TriggerRegistryResponse> => {
    return apiRequest<TriggerRegistryResponse>(
      `/workflow-registry/triggers/${key}`
    );
  },

  /**
   * Get triggers by category
   */
  getTriggersByCategory: async (
    category: TriggerCategory
  ): Promise<TriggerRegistryResponse[]> => {
    return apiRequest<TriggerRegistryResponse[]>(
      `/workflow-registry/triggers/category/${category}`
    );
  },

  /**
   * Get triggers by event source
   */
  getTriggersByEventSource: async (
    eventSource: EventSource
  ): Promise<TriggerRegistryResponse[]> => {
    return apiRequest<TriggerRegistryResponse[]>(
      `/workflow-registry/triggers/event-source/${eventSource}`
    );
  },

  /**
   * Get trigger with resolved schema
   */
  getTriggerWithResolvedSchema: async (
    key: string,
    tenantId: string,
    userId: string
  ): Promise<TriggerRegistryResponse> => {
    return apiRequest<TriggerRegistryResponse>(
      `/workflow-registry/trigger/${key}/resolved?tenantId=${tenantId}&userId=${userId}`
    );
  },

  /**
   * Process trigger event
   */
  processTrigger: async (
    triggerKey: string,
    data: {
      eventData: Record<string, unknown>;
      context?: Record<string, unknown>;
    }
  ): Promise<{ success: boolean; message?: string }> => {
    return apiRequest<{ success: boolean; message?: string }>(
      `/workflow-registry/trigger/${triggerKey}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },
};

/**
 * Schema API for form generation
 */
export const schemaApi = {
  /**
   * Get action property schema
   */
  getActionPropertySchema: async (): Promise<{
    properties: PropertySchema[];
  }> => {
    return apiRequest<{ properties: PropertySchema[] }>(
      "/workflow-registry/schema/action-properties"
    );
  },

  /**
   * Get trigger property schema
   */
  getTriggerPropertySchema: async (): Promise<{
    properties: PropertySchema[];
  }> => {
    return apiRequest<{ properties: PropertySchema[] }>(
      "/workflow-registry/schema/trigger-properties"
    );
  },
};

/**
 * Combined export for convenience
 */
export const workflowService = {
  workflows: workflowApi,
  actionRegistry: actionRegistryApi,
  triggerRegistry: triggerRegistryApi,
  schema: schemaApi,
};
