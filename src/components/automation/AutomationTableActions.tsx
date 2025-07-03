import { Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/workflow/${workflowId}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteWorkflowMutation.mutate(workflowId);
    setIsDeleteDialogOpen(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workflow</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workflow? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={deleteWorkflowMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteWorkflowMutation.isPending}
            >
              {deleteWorkflowMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
