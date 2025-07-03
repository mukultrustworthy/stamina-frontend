import { useState } from "react";
import { useNodesState } from "@xyflow/react";
import { DEFAULT_INITIAL_NODES } from "./constants";

/**
 * Simple hook for managing core workflow state
 */
export function useWorkflowState(initialWorkflowName: string) {
  const [workflowName, setWorkflowName] = useState(initialWorkflowName);
  const [nodes, setNodes, onNodesChange] = useNodesState(DEFAULT_INITIAL_NODES);

  return {
    workflowName,
    setWorkflowName,
    nodes,
    setNodes,
    onNodesChange,
  };
}
