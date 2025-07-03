import { useCallback } from "react";
import { toast } from "sonner";

export function useWorkflowActions() {
  const handleSave = useCallback(() => {
    // TODO: Implement save functionality
    toast.success("Workflow saved successfully");
  }, []);

  const handleStartCampaign = useCallback(() => {
    // TODO: Implement start campaign functionality
    toast.success("Campaign started successfully");
  }, []);

  return {
    handleSave,
    handleStartCampaign,
  };
}
