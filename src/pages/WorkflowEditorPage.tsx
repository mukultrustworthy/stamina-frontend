import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import { useWorkflowEditor } from "@/hooks/useWorkflowEditor";
import { WorkflowSidebar } from "@/components/automation/workflow/WorkflowSidebar";

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
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleSaveNodeEdit,
    addActionNode,
    handleSave,
    handleStartCampaign,
    closeEditDialog,
    openActionSelection,
    closeActionSelection,
    nodeHandlers,
  } = useWorkflowEditor(initialWorkflowName);

  const handleBack = () => navigate("/automation");

  // Create node components with handlers
  const nodeTypes = {
    trigger: (props: { data: NodeData; id: string }) => (
      <TriggerNode
        {...props}
        {...nodeHandlers}
        onAddAction={openActionSelection}
      />
    ),
    action: (props: { data: NodeData; id: string }) => (
      <ActionNode
        {...props}
        {...nodeHandlers}
        onAddAction={openActionSelection}
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
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
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
        onSelectAction={addActionNode}
      />
    </div>
  );
};
