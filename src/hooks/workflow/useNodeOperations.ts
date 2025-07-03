import { useCallback } from "react";
import { type Node } from "@xyflow/react";
import type { NodeData, ActionType } from "./types";
import { actionTypeData, NODE_VERTICAL_SPACING } from "./constants";

interface UseNodeOperationsProps {
  nodes: Node<NodeData>[];
  setNodes: (
    nodes: Node<NodeData>[] | ((nodes: Node<NodeData>[]) => Node<NodeData>[])
  ) => void;
}

/**
 * Helper functions for node operations
 */
const nodeHelpers = {
  findNodeById: (nodes: Node<NodeData>[], id: string) =>
    nodes.find((node) => node.id === id),

  findLastNode: (nodes: Node<NodeData>[]) =>
    nodes.find((node) => !node.data.childId),

  calculateNewPosition: (
    referenceNode: Node<NodeData>,
    offset = NODE_VERTICAL_SPACING
  ) => ({
    x: referenceNode.position.x,
    y: referenceNode.position.y + offset,
  }),

  createActionNode: (
    id: string,
    actionType: ActionType,
    position: { x: number; y: number },
    parentId?: string,
    childId?: string
  ): Node<NodeData> => ({
    id,
    type: "action",
    position,
    draggable: false,
    data: {
      ...actionTypeData[actionType],
      canDelete: true,
      ...(parentId && { parentId }),
      ...(childId && { childId }),
    },
  }),

  updateNodeData: (node: Node<NodeData>, updates: Partial<NodeData>) => ({
    ...node,
    data: { ...node.data, ...updates },
  }),

  shiftNodesDown: (
    nodes: Node<NodeData>[],
    fromY: number,
    offset = NODE_VERTICAL_SPACING
  ) =>
    nodes.map((node) =>
      node.position.y > fromY
        ? {
            ...node,
            position: { ...node.position, y: node.position.y + offset },
          }
        : node
    ),
};

/**
 * Simplified hook for basic node operations (add, delete, update)
 */
export function useNodeOperations({ nodes, setNodes }: UseNodeOperationsProps) {
  const updateNode = useCallback(
    (nodeId: string, updates: Partial<NodeData>) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId ? nodeHelpers.updateNodeData(node, updates) : node
        )
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      const nodeToDelete = nodeHelpers.findNodeById(nodes, nodeId);
      if (!nodeToDelete?.data.canDelete) return;

      const { parentId, childId } = nodeToDelete.data;

      setNodes((prevNodes) => {
        // Remove the target node
        const nodesWithoutDeleted = prevNodes.filter((n) => n.id !== nodeId);

        // Update connections: connect parent directly to child (if both exist)
        return nodesWithoutDeleted.map((node) => {
          if (parentId && node.id === parentId) {
            // Update parent: remove or replace childId
            const newData = { ...node.data };
            if (childId) {
              newData.childId = childId;
            } else {
              delete newData.childId;
            }
            return nodeHelpers.updateNodeData(node, newData);
          }

          if (childId && node.id === childId) {
            // Update child: remove or replace parentId
            const newData = { ...node.data };
            if (parentId) {
              newData.parentId = parentId;
            } else {
              delete newData.parentId;
            }
            return nodeHelpers.updateNodeData(node, newData);
          }

          return node;
        });
      });
    },
    [nodes, setNodes]
  );

  const addActionNode = useCallback(
    (actionType: ActionType) => {
      const lastNode = nodeHelpers.findLastNode(nodes);
      if (!lastNode) return;

      const newNodeId = `action-${Date.now()}`;
      const newPosition = nodeHelpers.calculateNewPosition(lastNode);
      const newNode = nodeHelpers.createActionNode(
        newNodeId,
        actionType,
        newPosition,
        lastNode.id
      );

      setNodes((prevNodes) => [
        ...prevNodes.map((node) =>
          node.id === lastNode.id
            ? nodeHelpers.updateNodeData(node, { childId: newNodeId })
            : node
        ),
        newNode,
      ]);

      return newNodeId;
    },
    [nodes, setNodes]
  );

  const insertActionAfter = useCallback(
    (afterNodeId: string, actionType: ActionType) => {
      const afterNode = nodeHelpers.findNodeById(nodes, afterNodeId);
      if (!afterNode) return;

      const newNodeId = `action-${Date.now()}`;
      const newPosition = nodeHelpers.calculateNewPosition(afterNode);
      const oldChildId = afterNode.data.childId;

      const newNode = nodeHelpers.createActionNode(
        newNodeId,
        actionType,
        newPosition,
        afterNodeId,
        oldChildId
      );

      setNodes((prevNodes) => {
        // Shift nodes below the insertion point
        const shiftedNodes = nodeHelpers.shiftNodesDown(
          prevNodes,
          afterNode.position.y
        );

        // Update connections
        const updatedNodes = shiftedNodes.map((node) => {
          if (node.id === afterNodeId) {
            return nodeHelpers.updateNodeData(node, { childId: newNodeId });
          }
          if (oldChildId && node.id === oldChildId) {
            return nodeHelpers.updateNodeData(node, { parentId: newNodeId });
          }
          return node;
        });

        return [...updatedNodes, newNode];
      });

      return newNodeId;
    },
    [nodes, setNodes]
  );

  return {
    updateNode,
    deleteNode,
    addActionNode,
    insertActionAfter,
  };
}
