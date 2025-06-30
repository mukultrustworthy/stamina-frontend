import { useState, useCallback } from "react";
import {
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
} from "@xyflow/react";
import { Users, Mail, Settings } from "lucide-react";

interface NodeData extends Record<string, unknown> {
  title: string;
  description: string;
  icon: React.ReactNode;
  onDelete?: (nodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  canDelete?: boolean;
  parentId?: string;
  childId?: string; // Only one child per node
  emailSubject?: string;
  emailTemplate?: string;
  propertyName?: string;
  propertyValue?: string;
}

interface NodeRelation {
  parentId?: string;
  childId?: string; // Only one child per node
}

type ActionType = "send-email" | "update-properties" | "update-property";

interface ActionNodeData {
  title: string;
  description: string;
  icon: React.ReactNode;
  emailSubject?: string;
  emailTemplate?: string;
  propertyName?: string;
  propertyValue?: string;
}

export function useWorkflowEditor(initialWorkflowName: string) {
  const [workflowName, setWorkflowName] = useState(initialWorkflowName);
  const [editingNode, setEditingNode] = useState<Node<NodeData> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isActionSelectionOpen, setIsActionSelectionOpen] = useState(false);

  // Parent-child relationship tracking (single child per node)
  const [nodeRelations, setNodeRelations] = useState<
    Record<string, NodeRelation>
  >({
    "trigger-1": { childId: "action-1" },
    "action-1": { parentId: "trigger-1" },
  });

  // Initialize nodes
  const initialNodes: Node<NodeData>[] = [
    {
      id: "trigger-1",
      type: "trigger",
      position: { x: 100, y: 100 },
      draggable: false,
      data: {
        title: "New Audience",
        description: "Fires when a new person is added to the audience list",
        icon: <Users className="w-5 h-5 text-blue-600" />,
        canDelete: false,
        childId: "action-1",
      },
    },
    {
      id: "action-1",
      type: "action",
      position: { x: 100, y: 300 },
      draggable: false,
      data: {
        title: "Send Welcome Email",
        description: "Send a welcome email to the new audience member",
        icon: <Mail className="w-5 h-5 text-green-600" />,
        canDelete: true,
        parentId: "trigger-1",
        emailSubject: "Welcome to our platform!",
        emailTemplate:
          "Hi there! Welcome to our platform. We're excited to have you on board.",
      },
    },
  ];

  const initialEdges = [
    {
      id: "e1-2",
      source: "trigger-1",
      sourceHandle: "a",
      target: "action-1",
      type: "straight",
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleEditNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId) as
        | Node<NodeData>
        | undefined;
      if (node) {
        setEditingNode(node);
        setIsEditDialogOpen(true);
      }
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
    [nodes, nodeRelations, setNodes, setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getActionData = useCallback((type: ActionType): ActionNodeData => {
    const actions = {
      "send-email": {
        title: "Send Email",
        description: "Send an email to the person",
        icon: <Mail className="w-5 h-5 text-green-600" />,
        emailSubject: "Welcome Email",
        emailTemplate:
          "Hello! Welcome to our platform. We're excited to have you on board.",
      },
      "update-properties": {
        title: "Update Properties",
        description: "Update person properties and attributes",
        icon: <Settings className="w-5 h-5 text-green-600" />,
        propertyName: "status",
        propertyValue: "active",
      },
      "update-property": {
        title: "Update Property",
        description: "Update a specific person property",
        icon: <Settings className="w-5 h-5 text-green-600" />,
        propertyName: "category",
        propertyValue: "premium",
      },
    };
    return actions[type] || actions["send-email"];
  }, []);

  // Find the leaf node (node with no child) in the chain
  const findLeafNode = useCallback(() => {
    // Start from trigger and follow the chain to find the leaf
    let currentNodeId = "trigger-1";

    while (nodeRelations[currentNodeId]?.childId) {
      currentNodeId = nodeRelations[currentNodeId].childId!;
    }

    return nodes.find((node) => node.id === currentNodeId);
  }, [nodes, nodeRelations]);

  const addActionNode = useCallback(
    (type: ActionType) => {
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
          y: leafNode.position.y + 200, // Vertical spacing
        },
        draggable: false,
        data: {
          ...actionData,
          canDelete: true,
          onDelete: handleDeleteNode,
          onEdit: handleEditNode,
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
    [
      findLeafNode,
      getActionData,
      handleDeleteNode,
      handleEditNode,
      setNodes,
      setNodeRelations,
      setEdges,
    ]
  );

  const handleSave = useCallback(() => {
    console.log("Saving workflow:", workflowName, {
      nodes,
      edges,
      relations: nodeRelations,
    });
    // TODO: Implement save functionality
  }, [workflowName, nodes, edges, nodeRelations]);

  const handleStartCampaign = useCallback(() => {
    console.log("Starting campaign");
    // TODO: Implement start campaign functionality
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

  return {
    // State
    workflowName,
    setWorkflowName,
    editingNode,
    isEditDialogOpen,
    isActionSelectionOpen,
    nodes,
    edges,
    nodeRelations,

    // Handlers
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleEditNode,
    handleSaveNodeEdit,
    handleDeleteNode,
    addActionNode,
    handleSave,
    handleStartCampaign,
    closeEditDialog,
    openActionSelection,
    closeActionSelection,

    // Node handlers for components
    nodeHandlers: {
      onEdit: handleEditNode,
      onDelete: handleDeleteNode,
    },
  };
}
