import { useState, useCallback } from "react";
import { type Node } from "@xyflow/react";
import { type NodeData } from "./types";

export function useDialogManager() {
  const [editingNode, setEditingNode] = useState<Node<NodeData> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isActionSelectionOpen, setIsActionSelectionOpen] = useState(false);
  const [isTriggerSelectionOpen, setIsTriggerSelectionOpen] = useState(false);

  const openEditDialog = useCallback((node: Node<NodeData>) => {
    setEditingNode(node);
    setIsEditDialogOpen(true);
  }, []);

  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingNode(null);
  }, []);

  const openActionSelection = useCallback(() => {
    setIsActionSelectionOpen(true);
  }, []);

  const closeActionSelection = useCallback(() => {
    setIsActionSelectionOpen(false);
  }, []);

  const openTriggerSelection = useCallback(() => {
    setIsTriggerSelectionOpen(true);
  }, []);

  const closeTriggerSelection = useCallback(() => {
    setIsTriggerSelectionOpen(false);
  }, []);

  return {
    editingNode,
    isEditDialogOpen,
    isActionSelectionOpen,
    isTriggerSelectionOpen,
    openEditDialog,
    closeEditDialog,
    openActionSelection,
    closeActionSelection,
    openTriggerSelection,
    closeTriggerSelection,
  };
}
