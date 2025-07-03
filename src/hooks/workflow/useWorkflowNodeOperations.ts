import { useCallback } from "react";
import { type Node } from "@xyflow/react";
import type {
  NodeData,
  NodeRelation,
  ActionType,
  ActionNodeData,
} from "./types";
import { actionTypeData, AUTO_EDIT_DELAY } from "./constants";
import { useNodePositioning } from "./useNodePositioning";

interface UseWorkflowNodeOperationsProps {
  nodes: Node<NodeData>[];
  setNodes: (
    nodes: Node<NodeData>[] | ((nodes: Node<NodeData>[]) => Node<NodeData>[])
  ) => void;
  nodeRelations: Record<string, NodeRelation>;
  setNodeRelations: (
    relations:
      | Record<string, NodeRelation>
      | ((
          relations: Record<string, NodeRelation>
        ) => Record<string, NodeRelation>)
  ) => void;
  onEditNode: (nodeId: string) => void;
}

/**
 * Hook for managing workflow node operations (add, delete, insert)
 */
export function useWorkflowNodeOperations({
  nodes,
  setNodes,
  nodeRelations,
  setNodeRelations,
  onEditNode,
}: UseWorkflowNodeOperationsProps) {
  const {
    getAppendPosition,
    getInsertPosition,
    shiftNodesDown,
    shiftNodesUp,
    findLeafNode,
  } = useNodePositioning();

  const getActionData = useCallback((type: ActionType): ActionNodeData => {
    return actionTypeData[type] || actionTypeData["send-email"];
  }, []);

  /**
   * Delete a node and reconnect the chain
   */
  const handleDeleteNodeWithReconnect = useCallback(
    (nodeId: string) => {
      const nodeToDelete = nodes.find((node) => node.id === nodeId);
      if (!nodeToDelete || !nodeToDelete.data.canDelete) return;

      const parentId = nodeRelations[nodeId]?.parentId;
      const childId = nodeRelations[nodeId]?.childId;

      // Remove the node and shift nodes up
      setNodes((nds) => {
        let updatedNodes = nds.filter((node) => node.id !== nodeId);

        // If there's both a parent and child, reconnect them
        if (parentId && childId) {
          // Move all nodes below the deleted node up
          updatedNodes = shiftNodesUp(updatedNodes, nodeToDelete.position.y);

          // Update parent node to point to child
          updatedNodes = updatedNodes.map((node) => {
            if (node.id === parentId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  childId: childId,
                },
              } as Node<NodeData>;
            }
            if (node.id === childId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  parentId: parentId,
                },
              } as Node<NodeData>;
            }
            return node;
          });
        } else if (parentId && !childId) {
          // Deleting the last node in chain - just remove childId from parent
          updatedNodes = updatedNodes.map((node) => {
            if (node.id === parentId) {
              const newData = { ...node.data };
              delete newData.childId;
              return {
                ...node,
                data: newData,
              } as Node<NodeData>;
            }
            return node;
          });
        }

        return updatedNodes;
      });

      // Update relationships
      setNodeRelations((prev) => {
        const newRelations = { ...prev };
        delete newRelations[nodeId];

        if (parentId && childId) {
          newRelations[parentId] = {
            ...newRelations[parentId],
            childId: childId,
          };
          newRelations[childId] = {
            ...newRelations[childId],
            parentId: parentId,
          };
        } else if (parentId && !childId) {
          const parentRelation = { ...newRelations[parentId] };
          delete parentRelation.childId;
          newRelations[parentId] = parentRelation;
        }

        return newRelations;
      });
    },
    [nodes, nodeRelations, setNodes, setNodeRelations, shiftNodesUp]
  );

  /**
   * Add a new action node at the end of the chain
   */
  const addActionNode = useCallback(
    (type: ActionType) => {
      const leafNode = findLeafNode(nodes, nodeRelations);
      if (!leafNode) return;

      const newNodeId = `action-${Date.now()}`;
      const actionData = getActionData(type);
      const position = getAppendPosition(leafNode);

      const newNode: Node<NodeData> = {
        id: newNodeId,
        type: "action",
        position,
        draggable: false,
        data: {
          ...actionData,
          canDelete: true,
          onDelete: handleDeleteNodeWithReconnect,
          onEdit: onEditNode,
          parentId: leafNode.id,
        },
      };

      setNodes((nds) => [...nds, newNode]);

      // Update relationships
      setNodeRelations((prev) => ({
        ...prev,
        [leafNode.id]: {
          ...prev[leafNode.id],
          childId: newNodeId,
        },
        [newNodeId]: {
          parentId: leafNode.id,
        },
      }));

      // Update leaf node data to include childId
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === leafNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                childId: newNodeId,
              },
            } as Node<NodeData>;
          }
          return node as Node<NodeData>;
        })
      );

      // Auto-open edit dialog
      setTimeout(() => {
        onEditNode(newNodeId);
      }, AUTO_EDIT_DELAY);
    },
    [
      nodes,
      nodeRelations,
      findLeafNode,
      getActionData,
      getAppendPosition,
      handleDeleteNodeWithReconnect,
      onEditNode,
      setNodes,
      setNodeRelations,
    ]
  );

  /**
   * Insert a new action node after a specific node
   */
  const insertActionAfterNode = useCallback(
    (afterNodeId: string, type: ActionType) => {
      const afterNode = nodes.find((node) => node.id === afterNodeId);
      if (!afterNode) return;

      const newNodeId = `action-${Date.now()}`;
      const actionData = getActionData(type);
      const currentChildId = nodeRelations[afterNodeId]?.childId;
      const position = getInsertPosition(afterNode);

      const newNode: Node<NodeData> = {
        id: newNodeId,
        type: "action",
        position,
        draggable: false,
        data: {
          ...actionData,
          canDelete: true,
          onDelete: handleDeleteNodeWithReconnect,
          onEdit: onEditNode,
          parentId: afterNodeId,
          childId: currentChildId,
        },
      };

      // Shift nodes down and add new node
      setNodes((nds) => {
        const updatedNodes = shiftNodesDown(nds, afterNode.position.y);
        return [...updatedNodes, newNode];
      });

      // Update relationships
      setNodeRelations((prev) => {
        const newRelations = { ...prev };

        newRelations[afterNodeId] = {
          ...newRelations[afterNodeId],
          childId: newNodeId,
        };

        newRelations[newNodeId] = {
          parentId: afterNodeId,
          childId: currentChildId,
        };

        if (currentChildId) {
          newRelations[currentChildId] = {
            ...newRelations[currentChildId],
            parentId: newNodeId,
          };
        }

        return newRelations;
      });

      // Update node data
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === afterNodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                childId: newNodeId,
              },
            } as Node<NodeData>;
          }
          if (node.id === currentChildId) {
            return {
              ...node,
              data: {
                ...node.data,
                parentId: newNodeId,
              },
            } as Node<NodeData>;
          }
          return node as Node<NodeData>;
        })
      );

      // Auto-open edit dialog
      setTimeout(() => {
        onEditNode(newNodeId);
      }, AUTO_EDIT_DELAY);
    },
    [
      nodes,
      nodeRelations,
      getActionData,
      getInsertPosition,
      shiftNodesDown,
      handleDeleteNodeWithReconnect,
      onEditNode,
      setNodes,
      setNodeRelations,
    ]
  );

  return {
    handleDeleteNodeWithReconnect,
    addActionNode,
    insertActionAfterNode,
  };
}
