import { useState } from "react";
import { useNodesState } from "@xyflow/react";
import { DEFAULT_NODE_RELATIONS, DEFAULT_INITIAL_NODES } from "./constants";

/**
 * Hook for managing workflow state (name, nodes, relationships)
 */
export function useWorkflowState(initialWorkflowName: string) {
  const [workflowName, setWorkflowName] = useState(initialWorkflowName);

  // Parent-child relationship tracking (single child per node)
  const [nodeRelations, setNodeRelations] = useState(DEFAULT_NODE_RELATIONS);

  const [nodes, setNodes, onNodesChange] = useNodesState(DEFAULT_INITIAL_NODES);

  return {
    workflowName,
    setWorkflowName,
    nodes,
    setNodes,
    onNodesChange,
    nodeRelations,
    setNodeRelations,
  };
}
