import { useCallback } from "react";
import { type Node } from "@xyflow/react";
import { toast } from "sonner";
import type { NodeData, NodeRelation } from "./types";

/**
 * Hook for managing workflow actions (save, start campaign, etc.)
 */
export function useWorkflowActions() {
  const handleSave = useCallback(
    (
      workflowName: string,
      nodes: Node<NodeData>[],
      nodeRelations: Record<string, NodeRelation>
    ) => {
      // TODO: Implement save functionality
      console.log("Saving workflow:", {
        workflowName,
        nodes,
        nodeRelations,
      });
      toast.success("Workflow saved successfully");
    },
    []
  );

  const handleStartCampaign = useCallback(() => {
    // TODO: Implement start campaign functionality
    toast.success("Campaign started successfully");
  }, []);

  return {
    handleSave,
    handleStartCampaign,
  };
}
