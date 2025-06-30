import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { workflowService } from "@/api/workflows";
import type {
  WorkflowResponse,
  CreateWorkflowDto,
  UpdateWorkflowDto,
  WorkflowExecution,
  ActionCategory,
  TriggerCategory,
  EventSource,
} from "@/types/workflow";

// Query Keys
export const workflowQueryKeys = {
  all: ["workflows"] as const,
  lists: () => [...workflowQueryKeys.all, "list"] as const,
  list: (filters: string) =>
    [...workflowQueryKeys.lists(), { filters }] as const,
  details: () => [...workflowQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...workflowQueryKeys.details(), id] as const,

  // Registry keys
  actions: {
    all: ["workflow-actions"] as const,
    lists: () => [...workflowQueryKeys.actions.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...workflowQueryKeys.actions.lists(), filters] as const,
    detail: (key: string) =>
      [...workflowQueryKeys.actions.all, "detail", key] as const,
  },

  triggers: {
    all: ["workflow-triggers"] as const,
    lists: () => [...workflowQueryKeys.triggers.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...workflowQueryKeys.triggers.lists(), filters] as const,
    detail: (key: string) =>
      [...workflowQueryKeys.triggers.all, "detail", key] as const,
  },

  schemas: {
    actionProperties: ["workflow-schemas", "action-properties"] as const,
    triggerProperties: ["workflow-schemas", "trigger-properties"] as const,
  },
};

// Workflow Queries
export const useGetWorkflows = () => {
  return useQuery({
    queryKey: workflowQueryKeys.lists(),
    queryFn: () => workflowService.listWorkflows(),
  });
};

export const useGetWorkflow = (id: string, enabled = true) => {
  return useQuery({
    queryKey: workflowQueryKeys.detail(id),
    queryFn: () => workflowService.getWorkflow(id),
    enabled: enabled && !!id,
  });
};

// Action Registry Queries
export const useGetActions = (active?: boolean) => {
  return useQuery({
    queryKey: workflowQueryKeys.actions.list({ active }),
    queryFn: () => workflowService.actions.getAllActions(active),
  });
};

export const useGetActionsByCategory = (category: ActionCategory) => {
  return useQuery({
    queryKey: workflowQueryKeys.actions.list({ category }),
    queryFn: () => workflowService.actions.getActionsByCategory(category),
  });
};

export const useGetAction = (key: string, enabled = true) => {
  return useQuery({
    queryKey: workflowQueryKeys.actions.detail(key),
    queryFn: () => workflowService.actions.getActionByKey(key),
    enabled: enabled && !!key,
  });
};

// Trigger Registry Queries
export const useGetTriggers = (active?: boolean) => {
  return useQuery({
    queryKey: workflowQueryKeys.triggers.list({ active }),
    queryFn: () => workflowService.triggers.getAllTriggers(active),
  });
};

export const useGetTriggersByCategory = (category: TriggerCategory) => {
  return useQuery({
    queryKey: workflowQueryKeys.triggers.list({ category }),
    queryFn: () => workflowService.triggers.getTriggersByCategory(category),
  });
};

export const useGetTriggersByEventSource = (eventSource: EventSource) => {
  return useQuery({
    queryKey: workflowQueryKeys.triggers.list({ eventSource }),
    queryFn: () =>
      workflowService.triggers.getTriggersByEventSource(eventSource),
  });
};

export const useGetTrigger = (key: string, enabled = true) => {
  return useQuery({
    queryKey: workflowQueryKeys.triggers.detail(key),
    queryFn: () => workflowService.triggers.getTriggerByKey(key),
    enabled: enabled && !!key,
  });
};

// Schema Queries
export const useGetActionPropertySchema = () => {
  return useQuery({
    queryKey: workflowQueryKeys.schemas.actionProperties,
    queryFn: () => workflowService.schemas.getActionPropertySchema(),
  });
};

export const useGetTriggerPropertySchema = () => {
  return useQuery({
    queryKey: workflowQueryKeys.schemas.triggerProperties,
    queryFn: () => workflowService.schemas.getTriggerPropertySchema(),
  });
};

// Workflow Mutations
export const useCreateWorkflow = (
  onSuccessCallback?: (workflow: WorkflowResponse) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workflow: CreateWorkflowDto) =>
      workflowService.createWorkflow(workflow),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workflowQueryKeys.lists() });
      toast.success("Workflow created successfully");
      onSuccessCallback?.(data);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to create workflow";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateWorkflow = (
  onSuccessCallback?: (workflow: WorkflowResponse) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateWorkflowDto }) =>
      workflowService.updateWorkflow(id, updates),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: workflowQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workflowQueryKeys.detail(id) });
      toast.success("Workflow updated successfully");
      onSuccessCallback?.(data);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to update workflow";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteWorkflow = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workflowService.deleteWorkflow(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: workflowQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workflowQueryKeys.lists() });
      toast.success("Workflow deleted successfully");
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to delete workflow";
      toast.error(errorMessage);
    },
  });
};

export const useExecuteWorkflow = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: ({
      id,
      execution,
    }: {
      id: string;
      execution: WorkflowExecution;
    }) => workflowService.executeWorkflow(id, execution),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Workflow executed successfully");
        onSuccessCallback?.();
      } else {
        toast.error(result.error || "Workflow execution failed");
      }
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to execute workflow";
      toast.error(errorMessage);
    },
  });
};
