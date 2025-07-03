import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ActionType } from "@/hooks/workflow/types";
import { actionTypeData } from "@/hooks/workflow/constants";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ActionSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectAction: (type: ActionType) => void;
}

export function ActionSelectionDialog({
  open,
  onClose,
  onSelectAction,
}: ActionSelectionDialogProps) {
  const [search, setSearch] = useState("");
  // Use the centralized action data instead of hardcoded values
  const actions = Object.entries(actionTypeData).map(([type, data]) => ({
    type: type as ActionType,
    title: data.title,
    description: data.description,
    icon: data.icon,
  }));

  const handleSelectAction = (type: ActionType) => {
    onSelectAction(type);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[60vh] max-w-lg w-full overflow-y-auto flex flex-col">
        <DialogHeader className="space-y-0">
          <DialogTitle>Add Action</DialogTitle>
          <DialogDescription>
            Select an action to add to your workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-auto">
          <Search className="w-4 h-4" />
          <Input
            placeholder="Search for an action..."
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-3 h-full flex-1 overflow-y-auto border p-2 rounded-lg bg-muted border-gray-200">
          {actions.length > 0 ? (
            actions
              .filter((action) =>
                action.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((action) => (
                <div
                  key={action.type}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer bg-background hover:bg-gray-50 transition-colors"
                  onClick={() => handleSelectAction(action.type)}
                >
                  <div className="flex items-center space-x-3">
                    {action.icon}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {action.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm">No actions found.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
