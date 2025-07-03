import { useWorkflowState } from "./workflow/useWorkflowState";
import { useDialogState } from "./workflow/useDialogManager";
import { useNodeOperations } from "./workflow/useNodeOperations";
import type { ActionType } from "./workflow/types";

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
    closeEdit,
  } = useDialogState();

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
    closeEdit();
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
    addActionNode(actionType);
    closeSelection();
  };

  const handleInsertAction = (afterNodeId: string, actionType: ActionType) => {
    insertActionAfter(afterNodeId, actionType);
    closeSelection();
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
    deleteNode,
    openTriggerSelection,
    openActionSelection,
    closeSelection,
  };
}
