import { useCallback } from "react";
import { type Edge, type Node } from "@xyflow/react";
import {
  type NodeData,
  type NodeRelation,
  type ActionType,
  type ActionNodeData,
} from "./types";
import {
  actionTypeData,
  DEFAULT_TRIGGER_ID,
  NODE_VERTICAL_SPACING,
} from "./constants";

interface UseNodeManagerProps {
  nodes: Node<NodeData>[];
  setNodes: (
    nodes: Node<NodeData>[] | ((nodes: Node<NodeData>[]) => Node<NodeData>[])
  ) => void;
  nodeRelations: Record<string, NodeRelation>;
  setNodeRelations: (
    relations:
      | Record<string, NodeRelation>
      | ((prev: Record<string, NodeRelation>) => Record<string, NodeRelation>)
  ) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
}

export function useNodeManager({
  nodes,
  setNodes,
  nodeRelations,
  setNodeRelations,
  setEdges,
}: UseNodeManagerProps) {
  const handleEditNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId) as
        | Node<NodeData>
        | undefined;
      return node || null;
    },
    [nodes]
  );

  const handleSaveNodeEdit = useCallback(
    (nodeId: string, updatedData: Partial<NodeData>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updatedData,
              },
            } as Node<NodeData>;
          }
          return node as Node<NodeData>;
        })
      );
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      // Don't allow deleting trigger nodes
      const nodeToDelete = nodes.find((node) => node.id === nodeId);
      if (nodeToDelete?.type === "trigger") return;

      const relation = nodeRelations[nodeId];
      if (!relation) return;

      // Update parent's child reference
      if (relation.parentId) {
        setNodeRelations((prev) => ({
          ...prev,
          [relation.parentId!]: {
            ...prev[relation.parentId!],
            childId: relation.childId, // Pass the child to the parent
          },
        }));
      }

      // Update child's parent reference
      if (relation.childId) {
        setNodeRelations((prev) => ({
          ...prev,
          [relation.childId!]: {
            ...prev[relation.childId!],
            parentId: relation.parentId, // Connect child to grandparent
          },
        }));
      }

      // Remove node from relations
      setNodeRelations((prev) => {
        const newRelations = { ...prev };
        delete newRelations[nodeId];
        return newRelations;
      });

      // Remove the node
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));

      // Remove edges connected to this node
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );

      // Reconnect parent to child if both exist
      if (relation.parentId && relation.childId) {
        const newEdge = {
          id: `e-${relation.parentId}-${relation.childId}`,
          source: relation.parentId,
          sourceHandle: "a",
          target: relation.childId,
          type: "straight",
        };
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    [nodes, nodeRelations, setNodes, setEdges, setNodeRelations]
  );

  const getActionData = useCallback((type: ActionType): ActionNodeData => {
    return actionTypeData[type] || actionTypeData["send-email"];
  }, []);

  // Find the leaf node (node with no child) in the chain
  const findLeafNode = useCallback(() => {
    // Start from trigger and follow the chain to find the leaf
    let currentNodeId = DEFAULT_TRIGGER_ID;

    while (nodeRelations[currentNodeId]?.childId) {
      currentNodeId = nodeRelations[currentNodeId].childId!;
    }

    return nodes.find((node) => node.id === currentNodeId);
  }, [nodes, nodeRelations]);

  const addActionNode = useCallback(
    (
      type: ActionType,
      onEdit: (nodeId: string) => void,
      onDelete: (nodeId: string) => void
    ) => {
      // Find the leaf node (end of the chain)
      const leafNode = findLeafNode();
      if (!leafNode) return;

      const newNodeId = `action-${Date.now()}`;
      const actionData = getActionData(type);

      // Position new node below the leaf node
      const newNode: Node<NodeData> = {
        id: newNodeId,
        type: "action",
        position: {
          x: leafNode.position.x,
          y: leafNode.position.y + NODE_VERTICAL_SPACING, // Vertical spacing
        },
        draggable: false,
        data: {
          ...actionData,
          canDelete: true,
          onDelete,
          onEdit,
          parentId: leafNode.id,
        },
      };

      setNodes((nds) => [...nds, newNode]);

      // Update relationships: leaf node now has this as child
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

      // Create edge from leaf to new node
      const newEdge = {
        id: `e-${leafNode.id}-${newNodeId}`,
        source: leafNode.id,
        sourceHandle: "a",
        target: newNodeId,
        type: "straight",
      };

      setEdges((eds) => [...eds, newEdge]);
    },
    [findLeafNode, getActionData, setNodes, setNodeRelations, setEdges]
  );

  return {
    handleEditNode,
    handleSaveNodeEdit,
    handleDeleteNode,
    addActionNode,
    findLeafNode,
    getActionData,
  };
}
