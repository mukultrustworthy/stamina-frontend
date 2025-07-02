import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AutomationHeader } from "@/components/automation/AutomationHeader";
import { WorkflowHeader } from "@/components/automation/workflow/WorkflowHeader";
import {
  TriggerNode,
  type NodeData,
} from "@/components/automation/workflow/TriggerNode";
import { ActionNode } from "@/components/automation/workflow/ActionNode";
import { ActionSelectionDialog } from "@/components/automation/workflow/ActionSelectionDialog";
import { TriggerSelectionDialog } from "@/components/automation/workflow/TriggerSelectionDialog";
import { useWorkflowEditor } from "@/hooks/useWorkflowEditor";
import { WorkflowSidebar } from "@/components/automation/workflow/WorkflowSidebar";
import { type ActionType } from "@/hooks/workflow/types";

export const WorkflowEditorPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialWorkflowName =
    location.state?.workflowName ||
    slug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
    "Welcome Flow";

  const {
    workflowName,
    setWorkflowName,
    editingNode,
    isActionSelectionOpen,
    isTriggerSelectionOpen,
    nodes,
    onNodesChange,
    handleSaveNodeEdit,
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
    nodeHandlers,
  } = useWorkflowEditor(initialWorkflowName);

  const handleBack = () => navigate("/");

  // Track which node is requesting to add an action (for insert-after functionality)
  const [insertAfterNodeId, setInsertAfterNodeId] = useState<string | null>(
    null
  );

  // Handler for inserting after a specific node
  const handleInsertAfter = (nodeId: string) => {
    setInsertAfterNodeId(nodeId);
    openActionSelection();
  };

  // Handler for adding at the end (traditional behavior)
  const handleAddAtEnd = () => {
    setInsertAfterNodeId(null);
    openActionSelection();
  };

  // Handler for action selection that uses the appropriate function
  const handleActionSelection = (actionType: ActionType) => {
    if (insertAfterNodeId) {
      insertActionAfterNode(insertAfterNodeId, actionType);
    } else {
      addActionNode(actionType);
    }
    setInsertAfterNodeId(null);
  };

  // Create node components with handlers
  const nodeTypes = {
    trigger: (props: { data: NodeData; id: string }) => (
      <TriggerNode
        {...props}
        {...nodeHandlers}
        selected={editingNode?.id === props.id}
        onAddAction={handleAddAtEnd}
        onInsertAfter={handleInsertAfter}
        onChangeTrigger={openTriggerSelection}
      />
    ),
    action: (props: { data: NodeData; id: string }) => (
      <ActionNode
        {...props}
        {...nodeHandlers}
        selected={editingNode?.id === props.id}
        onAddAction={handleAddAtEnd}
        onInsertAfter={handleInsertAfter}
      />
    ),
  };

  return (
    <div className="flex-1 overflow-hidden border m-1 rounded-xl">
      <AutomationHeader />

      <WorkflowHeader
        workflowName={workflowName}
        onWorkflowNameChange={setWorkflowName}
        onBack={handleBack}
        onSave={handleSave}
        onStartCampaign={handleStartCampaign}
      />

      {/* Main Content */}
      <div className="flex-1 flex h-[calc(100vh-139px)] relative">
        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            fitView={true}
            fitViewOptions={{
              padding: 0.2,
            }}
            className="bg-gray-50"
          >
            <Controls showZoom={true} showInteractive={true} />
            <Background variant={BackgroundVariant.Cross} gap={10} size={2} />
          </ReactFlow>
        </div>

        <WorkflowSidebar
          selectedNode={editingNode}
          onSave={handleSaveNodeEdit}
          onClose={closeEditDialog}
        />
      </div>

      <ActionSelectionDialog
        open={isActionSelectionOpen}
        onClose={closeActionSelection}
        onSelectAction={handleActionSelection}
      />

      <TriggerSelectionDialog
        open={isTriggerSelectionOpen}
        onClose={closeTriggerSelection}
        onSelectTrigger={handleTriggerChange}
      />
    </div>
  );
};
