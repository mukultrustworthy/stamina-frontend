import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Play } from "lucide-react";

interface WorkflowHeaderProps {
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  onBack: () => void;
  onSave: () => void;
  onStartCampaign: () => void;
}

export function WorkflowHeader({
  workflowName,
  onWorkflowNameChange,
  onBack,
  onSave,
  onStartCampaign,
}: WorkflowHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-500">Automation</span>
          <span className="text-sm text-gray-400">/</span>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => onWorkflowNameChange(e.target.value)}
            className="text-sm font-semibold bg-transparent border-none outline-none focus:ring-0 text-gray-900 border-b border-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="outline" onClick={onSave}>
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button onClick={onStartCampaign}>
          <Play className="w-4 h-4" />
          Start Campaign
        </Button>
      </div>
    </div>
  );
}
