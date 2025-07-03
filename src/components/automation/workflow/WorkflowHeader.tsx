import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkflowHeaderProps {
  onStartCampaign: () => void;
  workflowName: string;
  onSave: () => void;
}

export function WorkflowHeader({
  onStartCampaign,
  onSave,
  workflowName,
}: WorkflowHeaderProps) {
  const navigate = useNavigate();
  const handleBack = () => navigate("/");

  return (
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
        <Button onClick={onStartCampaign}>
          <Play className="w-4 h-4" />
          Start Campaign
        </Button>
      </div>
    </div>
  );
}
