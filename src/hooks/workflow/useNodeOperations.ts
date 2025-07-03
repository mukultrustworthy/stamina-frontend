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

        // Update connections and reposition nodes
        const updatedNodes = nodesWithoutDeleted.map((node) => {
          if (parentId && node.id === parentId) {
            // Update parent: connect to child (or remove childId if no child)
            const newData = { ...node.data };
            if (childId) {
              newData.childId = childId;
            } else {
              delete newData.childId;
            }
            return nodeHelpers.updateNodeData(node, newData);
          }

          if (childId && node.id === childId) {
            // Update child: connect to parent (or remove parentId if no parent)
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

        // Reposition nodes to fill the gap
        const deletedNodeY = nodeToDelete.position.y;
        return updatedNodes.map((node) => {
          if (node.position.y > deletedNodeY) {
            return {
              ...node,
              position: {
                ...node.position,
                y: node.position.y - NODE_VERTICAL_SPACING,
              },
            };
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
      const oldChildId = afterNode.data.childId;

      // Calculate position - right after the reference node
      const newPosition = nodeHelpers.calculateNewPosition(afterNode);

      const newNode = nodeHelpers.createActionNode(
        newNodeId,
        actionType,
        newPosition,
        afterNodeId,
        oldChildId
      );

      setNodes((prevNodes) => {
        // First, shift all nodes below the insertion point down
        const shiftedNodes = prevNodes.map((node) => {
          if (node.position.y > afterNode.position.y) {
            return {
              ...node,
              position: {
                ...node.position,
                y: node.position.y + NODE_VERTICAL_SPACING,
              },
            };
          }
          return node;
        });

        // Update the parent-child relationships
        const updatedNodes = shiftedNodes.map((node) => {
          // Update the afterNode to point to the new node
          if (node.id === afterNodeId) {
            return nodeHelpers.updateNodeData(node, { childId: newNodeId });
          }
          // Update the old child to point to the new node as parent
          if (oldChildId && node.id === oldChildId) {
            return nodeHelpers.updateNodeData(node, { parentId: newNodeId });
          }
          return node;
        });

        // Add the new node
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
