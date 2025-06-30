import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDeleteWorkflow } from "@/hooks/useWorkflowQueries";

interface AutomationTableActionsProps {
  workflowId: string;
}

export function AutomationTableActions({
  workflowId,
}: AutomationTableActionsProps) {
  const navigate = useNavigate();
  const deleteWorkflowMutation = useDeleteWorkflow();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    navigate(`/workflow/${workflowId}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    if (
      confirm(
        "Are you sure you want to delete this workflow? This action cannot be undone."
      )
    ) {
      deleteWorkflowMutation.mutate(workflowId);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:border-blue-500 border border-transparent hover:text-blue-500 cursor-pointer"
        onClick={handleEdit}
        disabled={deleteWorkflowMutation.isPending}
      >
        <Edit3 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:border-red-500 border border-transparent hover:text-red-500 cursor-pointer"
        onClick={handleDelete}
        disabled={deleteWorkflowMutation.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
