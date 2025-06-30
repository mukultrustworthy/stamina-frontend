import { useState, useCallback } from "react";
import {
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import { Users, Mail, Settings } from "lucide-react";
import {
  type NodeData,
  type NodeRelation,
  type ActionType,
  type ActionNodeData,
} from "./workflow/types";
import { useNodeManager } from "./workflow/useNodeManager";
import { useDialogManager } from "./workflow/useDialogManager";

export function useWorkflowEditor(initialWorkflowName: string) {
  const [workflowName, setWorkflowName] = useState(initialWorkflowName);

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
        registryKey: "lead_created", // Default trigger key
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
        registryKey: "send_email", // Default action key
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

  // Use extracted hooks
  const dialogManager = useDialogManager();
  const nodeManager = useNodeManager({
    nodes,
    setNodes,
    nodeRelations,
    setNodeRelations,
    setEdges: setEdges as (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  });

  const handleEditNode = useCallback(
    (nodeId: string) => {
      const node = nodeManager.handleEditNode(nodeId);
      if (node) {
        dialogManager.openEditDialog(node);
      }
    },
    [nodeManager, dialogManager]
  );

  const handleSaveNodeEdit = nodeManager.handleSaveNodeEdit;

  const handleDeleteNode = nodeManager.handleDeleteNode;

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getActionData = useCallback((type: ActionType): ActionNodeData => {
    const actions: Record<ActionType, ActionNodeData> = {
      "send-email": {
        title: "Send Email",
        description: "Send an email to the person",
        icon: <Mail className="w-5 h-5 text-green-600" />,
        registryKey: "send_email",
        emailSubject: "Welcome Email",
        emailTemplate:
          "Hello! Welcome to our platform. We're excited to have you on board.",
      },
      "create-task": {
        title: "Create Task",
        description: "Create a follow-up task",
        icon: <Settings className="w-5 h-5 text-green-600" />,
        registryKey: "create_task",
      },
      "update-lead-status": {
        title: "Update Lead Status",
        description: "Update lead status and properties",
        icon: <Users className="w-5 h-5 text-green-600" />,
        registryKey: "update_lead_status",
      },
      "http-request": {
        title: "HTTP Request",
        description: "Make HTTP requests to external APIs",
        icon: <Settings className="w-5 h-5 text-blue-600" />,
        registryKey: "http_request",
      },
      "ai-generate-text": {
        title: "AI Generate Text",
        description: "Generate text using AI models",
        icon: <Mail className="w-5 h-5 text-purple-600" />,
        registryKey: "ai_generate_text",
      },
      "database-query": {
        title: "Database Query",
        description: "Execute database queries and operations",
        icon: <Settings className="w-5 h-5 text-green-600" />,
        registryKey: "database_query",
      },
      "transform-data": {
        title: "Transform Data",
        description: "Transform and manipulate data",
        icon: <Settings className="w-5 h-5 text-yellow-600" />,
        registryKey: "transform_data",
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
    // TODO: Implement save functionality
    console.log("Saving workflow:", {
      workflowName,
      nodes,
      edges,
      nodeRelations,
    });
  }, [workflowName, nodes, edges, nodeRelations]);

  const handleStartCampaign = useCallback(() => {
    // TODO: Implement start campaign functionality
  }, []);

  const closeEditDialog = dialogManager.closeEditDialog;
  const openActionSelection = dialogManager.openActionSelection;
  const closeActionSelection = dialogManager.closeActionSelection;

  return {
    // State
    workflowName,
    setWorkflowName,
    editingNode: dialogManager.editingNode,
    isEditDialogOpen: dialogManager.isEditDialogOpen,
    isActionSelectionOpen: dialogManager.isActionSelectionOpen,
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
