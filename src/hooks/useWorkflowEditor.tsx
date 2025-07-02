import { useState, useCallback } from "react";
import { useNodesState, type Node } from "@xyflow/react";
import { toast } from "sonner";
import {
  Users,
  Mail,
  Database,
  Webhook,
  Clock,
  Link,
  User,
} from "lucide-react";
import {
  type NodeData,
  type NodeRelation,
  type ActionType,
  type ActionNodeData,
  actionTypeData,
} from "./workflow/types";
import { useNodeManager } from "./workflow/useNodeManager";
import { useDialogManager } from "./workflow/useDialogManager";
import type {
  TriggerCategory,
  TriggerRegistryResponse,
} from "@/types/workflow";

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
      position: { x: 0, y: 0 },
      draggable: false,
      selected: true,
      data: {
        title: "New Audience",
        description: "Fires when a new person is added to the audience list",
        icon: <Users className="w-5 h-5" />,
        canDelete: false,
        childId: "action-1",
        registryKey: "lead_created", // Default trigger key
      },
    },
    {
      id: "action-1",
      type: "action",
      position: { x: 0, y: 255 },
      draggable: false,
      data: {
        title: "Send Welcome Email",
        description: "Send a welcome email to the new audience member",
        icon: <Mail className="w-5 h-5" />,
        canDelete: true,
        parentId: "trigger-1",
        emailSubject: "Welcome to our platform!",
        emailTemplate:
          "Hi there! Welcome to our platform. We're excited to have you on board.",
        registryKey: "send_email", // Default action key
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  // Use extracted hooks
  const dialogManager = useDialogManager();
  const nodeManager = useNodeManager({
    nodes,
    setNodes,
    nodeRelations,
    setNodeRelations,
    setEdges: () => {},
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

  // Enhanced delete function that handles reconnecting chains
  const handleDeleteNodeWithReconnect = useCallback(
    (nodeId: string) => {
      const nodeToDelete = nodes.find((node) => node.id === nodeId);
      if (!nodeToDelete || !nodeToDelete.data.canDelete) return;

      const parentId = nodeRelations[nodeId]?.parentId;
      const childId = nodeRelations[nodeId]?.childId;

      // Remove the node
      setNodes((nds) => {
        let updatedNodes = nds.filter((node) => node.id !== nodeId);

        // If there's both a parent and child, reconnect them
        if (parentId && childId) {
          // Move all nodes below the deleted node up
          updatedNodes = updatedNodes.map((node) => {
            if (node.position.y > nodeToDelete.position.y) {
              return {
                ...node,
                position: {
                  ...node.position,
                  y: node.position.y - 180, // Move up by one node height
                },
              };
            }
            return node;
          });

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

        // Remove the deleted node's relations
        delete newRelations[nodeId];

        // If there's both parent and child, connect them
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
          // Remove childId from parent if we're deleting the last node
          const parentRelation = { ...newRelations[parentId] };
          delete parentRelation.childId;
          newRelations[parentId] = parentRelation;
        }

        return newRelations;
      });
    },
    [nodes, nodeRelations, setNodes, setNodeRelations]
  );

  const getActionData = useCallback((type: ActionType): ActionNodeData => {
    return actionTypeData[type] || actionTypeData["send-email"];
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
          y: leafNode.position.y + 180, // Vertical spacing
        },
        draggable: false,
        data: {
          ...actionData,
          canDelete: true,
          onDelete: handleDeleteNodeWithReconnect,
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

      // Automatically open the edit sidebar for the newly created action node
      setTimeout(() => {
        handleEditNode(newNodeId);
      }, 0);
    },
    [
      findLeafNode,
      getActionData,
      handleDeleteNodeWithReconnect,
      handleEditNode,
      setNodes,
      setNodeRelations,
    ]
  );

  // New function to insert node after a specific node
  const insertActionAfterNode = useCallback(
    (afterNodeId: string, type: ActionType) => {
      const afterNode = nodes.find((node) => node.id === afterNodeId);
      if (!afterNode) return;

      const newNodeId = `action-${Date.now()}`;
      const actionData = getActionData(type);

      // Get the current child of the afterNode (if any)
      const currentChildId = nodeRelations[afterNodeId]?.childId;

      // Position new node between afterNode and its child
      const newNode: Node<NodeData> = {
        id: newNodeId,
        type: "action",
        position: {
          x: afterNode.position.x,
          y: afterNode.position.y + 180, // Insert right after
        },
        draggable: false,
        data: {
          ...actionData,
          canDelete: true,
          onDelete: handleDeleteNodeWithReconnect,
          onEdit: handleEditNode,
          parentId: afterNodeId,
          childId: currentChildId, // Inherit the original child
        },
      };

      // Update all nodes below to shift their position down
      setNodes((nds) => {
        const updatedNodes = nds.map((node) => {
          // If this node is below the insertion point, move it down
          if (node.position.y > afterNode.position.y) {
            return {
              ...node,
              position: {
                ...node.position,
                y: node.position.y + 180, // Move down by one node height
              },
            };
          }
          return node;
        });

        // Add the new node
        return [...updatedNodes, newNode];
      });

      // Update relationships
      setNodeRelations((prev) => {
        const newRelations = { ...prev };

        // afterNode now points to newNode
        newRelations[afterNodeId] = {
          ...newRelations[afterNodeId],
          childId: newNodeId,
        };

        // newNode points to original child and back to parent
        newRelations[newNodeId] = {
          parentId: afterNodeId,
          childId: currentChildId,
        };

        // If there was a child, update its parent to newNode
        if (currentChildId) {
          newRelations[currentChildId] = {
            ...newRelations[currentChildId],
            parentId: newNodeId,
          };
        }

        return newRelations;
      });

      // Update afterNode data to remove childId since it now points to newNode
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

      // Automatically open the edit sidebar for the newly created action node
      setTimeout(() => {
        handleEditNode(newNodeId);
      }, 0);
    },
    [
      nodes,
      nodeRelations,
      getActionData,
      handleDeleteNodeWithReconnect,
      handleEditNode,
      setNodes,
      setNodeRelations,
    ]
  );

  const handleSave = useCallback(() => {
    // TODO: Implement save functionality
    console.log("Saving workflow:", {
      workflowName,
      nodes,
      nodeRelations,
    });
    toast.success("Workflow saved successfully");
  }, [workflowName, nodes, nodeRelations]);

  const handleStartCampaign = useCallback(() => {
    // TODO: Implement start campaign functionality
    toast.success("Campaign started successfully");
  }, []);

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
        handleEditNode("trigger-1");
      }, 0);
    },
    [setNodes, handleEditNode]
  );

  // Helper function to get trigger icon
  const getTriggerIcon = (category: TriggerCategory) => {
    switch (category) {
      case "webhook":
        return <Webhook className="w-5 h-5" />;
      case "database":
        return <Database className="w-5 h-5" />;
      case "schedule":
        return <Clock className="w-5 h-5" />;
      case "email":
        return <Mail className="w-5 h-5" />;
      case "external":
        return <Link className="w-5 h-5" />;
      case "manual":
        return <User className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

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
