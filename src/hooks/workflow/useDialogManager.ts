import { useState } from "react";

/**
 * Simple hook for managing dialog state
 */
export function useDialogState() {
  const [selectionDialogType, setSelectionDialogType] = useState<
    "trigger" | "action" | null
  >(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const openTriggerSelection = () => setSelectionDialogType("trigger");
  const openActionSelection = () => setSelectionDialogType("action");
  const closeSelection = () => setSelectionDialogType(null);

  const isSelectionOpen = selectionDialogType !== null;
  const isTriggerDialogOpen = selectionDialogType === "trigger";
  const isActionDialogOpen = selectionDialogType === "action";

  const openEdit = (nodeId: string) => {
    setEditingNodeId(nodeId);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditingNodeId(null);
  };

  return {
    isSelectionOpen,
    isTriggerDialogOpen,
    isActionDialogOpen,
    openTriggerSelection,
    openActionSelection,
    closeSelection,
    isEditOpen,
    editingNodeId,
    openEdit,
    closeEdit,
  };
}
