import { useCallback } from "react";
import { type Node } from "@xyflow/react";
import type { NodeData, NodeRelation } from "./types";
import { NODE_VERTICAL_SPACING, DEFAULT_TRIGGER_ID } from "./constants";

export function useNodePositioning() {
  /**
   * Calculate the position for a new node to be inserted after a specific node
   */
  const getInsertPosition = useCallback(
    (afterNode: Node<NodeData>): { x: number; y: number } => {
      return {
        x: afterNode.position.x,
        y: afterNode.position.y + NODE_VERTICAL_SPACING,
      };
    },
    []
  );

  /**
   * Calculate the position for a new node at the end of the chain
   */
  const getAppendPosition = useCallback(
    (leafNode: Node<NodeData>): { x: number; y: number } => {
      return {
        x: leafNode.position.x,
        y: leafNode.position.y + NODE_VERTICAL_SPACING,
      };
    },
    []
  );

  /**
   * Shift nodes down by one position after insertion
   */
  const shiftNodesDown = useCallback(
    (nodes: Node<NodeData>[], insertionY: number): Node<NodeData>[] => {
      return nodes.map((node) => {
        if (node.position.y > insertionY) {
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
    },
    []
  );

  /**
   * Shift nodes up by one position after deletion
   */
  const shiftNodesUp = useCallback(
    (nodes: Node<NodeData>[], deletionY: number): Node<NodeData>[] => {
      return nodes.map((node) => {
        if (node.position.y > deletionY) {
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
    },
    []
  );

  /**
   * Find the leaf node (node with no child) in the chain
   */
  const findLeafNode = useCallback(
    (
      nodes: Node<NodeData>[],
      nodeRelations: Record<string, NodeRelation>
    ): Node<NodeData> | undefined => {
      let currentNodeId = DEFAULT_TRIGGER_ID;

      while (nodeRelations[currentNodeId]?.childId) {
        currentNodeId = nodeRelations[currentNodeId].childId!;
      }

      return nodes.find((node) => node.id === currentNodeId);
    },
    []
  );

  return {
    getInsertPosition,
    getAppendPosition,
    shiftNodesDown,
    shiftNodesUp,
    findLeafNode,
  };
}
