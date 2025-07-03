import { useCallback } from "react";
import { type Node } from "@xyflow/react";
import type { NodeData } from "./workflow/types";
import { useWorkflowState } from "./workflow/useWorkflowState";
import { useWorkflowActions } from "./workflow/useWorkflowActions";
import { useWorkflowNodeOperations } from "./workflow/useWorkflowNodeOperations";
import { useNodeManager } from "./workflow/useNodeManager";
import { useDialogManager } from "./workflow/useDialogManager";
import { getTriggerIcon } from "./workflow/triggerUtils";
import { DEFAULT_TRIGGER_ID, AUTO_EDIT_DELAY } from "./workflow/constants";
import type { TriggerRegistryResponse } from "@/types/workflow";

export function useWorkflowEditor(initialWorkflowName: string) {
  // State management
  const workflowState = useWorkflowState(initialWorkflowName);
  const {
    workflowName,
    setWorkflowName,
    nodes,
    setNodes,
    onNodesChange,
    nodeRelations,
    setNodeRelations,
  } = workflowState;

  // Dialog management
  const dialogManager = useDialogManager();

  // Node management
  const nodeManager = useNodeManager({
    nodes,
    setNodes,
    nodeRelations,
    setNodeRelations,
    setEdges: () => {},
  });

  // Workflow actions
  const { handleSave: baseSave, handleStartCampaign } = useWorkflowActions();
  const handleSave = useCallback(
    () => baseSave(workflowName, nodes, nodeRelations),
    [baseSave, workflowName, nodes, nodeRelations]
  );

  // Node editing
  const handleEditNode = useCallback(
    (nodeId: string) => {
      const node = nodeManager.handleEditNode(nodeId);
      if (node) {
        dialogManager.openEditDialog(node);
      }
    },
    [nodeManager, dialogManager]
  );

  // Node operations
  const {
    handleDeleteNodeWithReconnect,
    addActionNode,
    insertActionAfterNode,
  } = useWorkflowNodeOperations({
    nodes,
    setNodes,
    nodeRelations,
    setNodeRelations,
    onEditNode: handleEditNode,
  });

  const handleSaveNodeEdit = nodeManager.handleSaveNodeEdit;

  const handleTriggerChange = useCallback(
    (trigger: TriggerRegistryResponse) => {
      // Update the trigger node with the new trigger data
      setNodes((nds) =>
        nds.map((node) => {
          if (node.type === "trigger") {
            return {
              ...node,
              data: {
                ...node.data,
                title: trigger.displayName,
                description: trigger.description || "",
                registryKey: trigger.key,
                // Add trigger icon based on category
                icon: getTriggerIcon(trigger.category),
              },
            } as Node<NodeData>;
          }
          return node as Node<NodeData>;
        })
      );

      // Automatically open the edit sidebar for the updated trigger node
      setTimeout(() => {
        handleEditNode(DEFAULT_TRIGGER_ID);
      }, AUTO_EDIT_DELAY);
    },
    [setNodes, handleEditNode]
  );

  const closeEditDialog = dialogManager.closeEditDialog;
  const openActionSelection = dialogManager.openActionSelection;
  const closeActionSelection = dialogManager.closeActionSelection;
  const openTriggerSelection = dialogManager.openTriggerSelection;
  const closeTriggerSelection = dialogManager.closeTriggerSelection;

  return {
    // State
    workflowName,
    setWorkflowName,
    editingNode: dialogManager.editingNode,
    isEditDialogOpen: dialogManager.isEditDialogOpen,
    isActionSelectionOpen: dialogManager.isActionSelectionOpen,
    isTriggerSelectionOpen: dialogManager.isTriggerSelectionOpen,
    nodes,
    nodeRelations,

    // Handlers
    onNodesChange,
    handleEditNode,
    handleSaveNodeEdit,
    handleDeleteNode: handleDeleteNodeWithReconnect,
    addActionNode,
    insertActionAfterNode,
    handleSave,
    handleStartCampaign,
    handleTriggerChange,
    closeEditDialog,
    openActionSelection,
    closeActionSelection,
    openTriggerSelection,
    closeTriggerSelection,

    // Trigger selection
    getTriggerIcon,

    // Node handlers for components
    nodeHandlers: {
      onEdit: handleEditNode,
      onDelete: handleDeleteNodeWithReconnect,
    },
  };
}
