import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CampaignStartDialog } from "./CampaignStartDialog";
import { ExecutionProgress } from "./ExecutionProgress";
import type {
  WorkflowNode,
  CampaignStartRequest,
  CampaignExecution,
} from "@/types/workflow";

interface WorkflowHeaderProps {
  onStartCampaign: (request: CampaignStartRequest) => void;
  workflowName: string;
  onSave: () => void;
  nodes: WorkflowNode[];
  currentExecution: CampaignExecution | null;
  isExecuting?: boolean;
  onCancelExecution?: () => void;
  onClearExecution?: () => void;
}

export function WorkflowHeader({
  onStartCampaign,
  onSave,
  workflowName,
  nodes,
  currentExecution,
  isExecuting = false,
  onCancelExecution,
  onClearExecution,
}: WorkflowHeaderProps) {
  const navigate = useNavigate();
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showExecutionProgress, setShowExecutionProgress] = useState(false);

  const handleBack = () => navigate("/");

  const handleStartCampaignClick = () => {
    setShowCampaignDialog(true);
  };

  const handleCampaignStart = (request: CampaignStartRequest) => {
    setShowCampaignDialog(false);
    setShowExecutionProgress(true);
    onStartCampaign(request);
  };

  const handleCloseExecutionProgress = () => {
    setShowExecutionProgress(false);
    onClearExecution?.();
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-500">Automation</span>
            <span className="text-sm text-gray-400">/</span>
            <span className="text-sm">{workflowName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button onClick={handleStartCampaignClick} disabled={isExecuting}>
            <Play className="w-4 h-4" />
            {isExecuting ? "Campaign Running..." : "Start Campaign"}
          </Button>
        </div>
      </div>

      <CampaignStartDialog
        open={showCampaignDialog}
        onClose={() => setShowCampaignDialog(false)}
        onStartCampaign={handleCampaignStart}
        workflowName={workflowName}
        nodes={nodes}
        isExecuting={isExecuting}
      />

      <ExecutionProgress
        open={showExecutionProgress}
        onClose={handleCloseExecutionProgress}
        execution={currentExecution}
        onCancel={onCancelExecution}
      />
    </>
  );
}
