import { useParams, useLocation } from "react-router-dom";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AutomationHeader } from "@/components/automation/AutomationHeader";
import { WorkflowHeader } from "@/components/automation/workflow/WorkflowHeader";
import type { NodeData } from "@/hooks/workflow/types";
import { SelectionDialog } from "@/components/automation/workflow/SelectionDialog";
import { useWorkflowEditor } from "@/hooks/useWorkflowEditor";
import { WorkflowSidebar } from "@/components/automation/workflow/WorkflowSidebar";
import { Node } from "./Node";
import { useWorkflowActions } from "@/hooks/workflow/useWorkflowActions";

export const WorkflowContent = () => {
  const { slug } = useParams();
  const location = useLocation();

  const initialWorkflowName =
    location.state?.workflowName ||
    slug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
    "New Workflow";

  const {
    workflowName,
    nodes,
    onNodesChange,
    editingNodeId,
    isTriggerDialogOpen,
    isActionDialogOpen,
    handleEditNode,
    handleSaveNodeEdit,
    handleTriggerChange,
    handleActionSelection,
    deleteNode,
    openTriggerSelection,
    openActionSelection,
    closeSelection,
  } = useWorkflowEditor(initialWorkflowName);

  const { handleStartCampaign, handleSave } = useWorkflowActions();

  const nodeTypes = {
    trigger: (props: { data: NodeData; id: string; selected?: boolean }) => (
      <Node
        type="trigger"
        data={props.data}
        id={props.id}
        selected={props.selected}
        onEdit={handleEditNode}
        onDelete={deleteNode}
        onAddAction={() => openActionSelection()}
        onInsertAfter={() => openActionSelection()}
        onChangeTrigger={() => openTriggerSelection()}
      />
    ),
    action: (props: { data: NodeData; id: string; selected?: boolean }) => (
      <Node
        type="action"
        data={props.data}
        id={props.id}
        selected={props.selected}
        onEdit={handleEditNode}
        onDelete={deleteNode}
        onAddAction={() => openActionSelection()}
        onInsertAfter={() => openActionSelection()}
        onChangeTrigger={() => openTriggerSelection()}
      />
    ),
  };

  // Find the editing node
  const selectedNode = editingNodeId
    ? nodes.find((n) => n.id === editingNodeId) || null
    : null;

  return (
    <div className="flex-1 overflow-hidden border m-1 rounded-xl">
      <AutomationHeader />

      <WorkflowHeader
        workflowName={workflowName}
        onStartCampaign={handleStartCampaign}
        onSave={handleSave}
      />

      <div className="flex-1 flex h-[calc(100vh-139px)] relative">
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
          selectedNode={selectedNode}
          onSave={handleSaveNodeEdit}
        />
      </div>

      <SelectionDialog
        type="action"
        open={isActionDialogOpen}
        onClose={closeSelection}
        onSelectAction={handleActionSelection}
      />

      <SelectionDialog
        type="trigger"
        open={isTriggerDialogOpen}
        onClose={closeSelection}
        onSelectTrigger={handleTriggerChange}
      />
    </div>
  );
};
