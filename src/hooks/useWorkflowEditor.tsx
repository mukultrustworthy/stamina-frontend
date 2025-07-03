import { useWorkflowState } from "./workflow/useWorkflowState";
import { useDialogState } from "./workflow/useDialogManager";
import { useNodeOperations } from "./workflow/useNodeOperations";
import type { ActionType } from "./workflow/types";
import { useState } from "react";

export function useWorkflowEditor(initialWorkflowName: string) {
  const { workflowName, nodes, setNodes, onNodesChange } =
    useWorkflowState(initialWorkflowName);

  const {
    isSelectionOpen,
    isTriggerDialogOpen,
    isActionDialogOpen,
    openTriggerSelection,
    openActionSelection,
    closeSelection,
    editingNodeId,
    openEdit,
  } = useDialogState();

  // Track which node to insert after
  const [insertAfterNodeId, setInsertAfterNodeId] = useState<string | null>(
    null
  );

  const { updateNode, deleteNode, addActionNode, insertActionAfter } =
    useNodeOperations({ nodes, setNodes });

  const handleEditNode = (nodeId: string) => {
    openEdit(nodeId);
  };

  const handleSaveNodeEdit = (
    nodeId: string,
    updates: Record<string, unknown>
  ) => {
    updateNode(nodeId, updates);
  };

  const handleTriggerChange = (trigger: {
    displayName: string;
    description?: string;
    key: string;
  }) => {
    updateNode("trigger-1", {
      title: trigger.displayName,
      description: trigger.description || "",
      registryKey: trigger.key,
    });
    closeSelection();
  };

  const handleActionSelection = (actionType: ActionType) => {
    if (insertAfterNodeId) {
      // Insert after a specific node
      insertActionAfter(insertAfterNodeId, actionType);
      setInsertAfterNodeId(null);
    } else {
      // Add to the end
      addActionNode(actionType);
    }
    closeSelection();
  };

  const handleInsertAction = (afterNodeId: string, actionType: ActionType) => {
    insertActionAfter(afterNodeId, actionType);
    closeSelection();
  };

  const handleAddAction = () => {
    setInsertAfterNodeId(null);
    openActionSelection();
  };

  const handleInsertAfter = (nodeId: string) => {
    setInsertAfterNodeId(nodeId);
    openActionSelection();
  };

  return {
    // State
    workflowName,
    nodes,
    onNodesChange,
    editingNodeId,
    isSelectionOpen,
    isTriggerDialogOpen,
    isActionDialogOpen,

    // Actions
    handleEditNode,
    handleSaveNodeEdit,
    handleTriggerChange,
    handleActionSelection,
    handleInsertAction,
    handleAddAction,
    handleInsertAfter,
    deleteNode,
    openTriggerSelection,
    openActionSelection,
    closeSelection,
  };
}
