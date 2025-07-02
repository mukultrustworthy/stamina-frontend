import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useGetTriggers } from "@/hooks/useWorkflowQueries";
import type { TriggerRegistryResponse } from "@/types/workflow";
import { useWorkflowEditor } from "@/hooks/useWorkflowEditor";

interface TriggerSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTrigger: (trigger: TriggerRegistryResponse) => void;
}

export function TriggerSelectionDialog({
  open,
  onClose,
  onSelectTrigger,
}: TriggerSelectionDialogProps) {
  const [search, setSearch] = useState("");
  const { data: triggers, isLoading } = useGetTriggers(true); // Only active triggers
  const { getTriggerIcon } = useWorkflowEditor("trigger");
  const handleSelectTrigger = (trigger: TriggerRegistryResponse) => {
    onSelectTrigger(trigger);
    onClose();
  };

  const filteredTriggers =
    triggers?.filter(
      (trigger) =>
        trigger.displayName.toLowerCase().includes(search.toLowerCase()) ||
        trigger.description?.toLowerCase().includes(search.toLowerCase()) ||
        trigger.key.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[60vh] max-w-lg w-full overflow-y-auto flex flex-col">
        <DialogHeader className="space-y-0">
          <DialogTitle>Change Trigger</DialogTitle>
          <DialogDescription>
            Select a trigger to start your workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-auto">
          <Search className="w-4 h-4" />
          <Input
            placeholder="Search for a trigger..."
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-3 h-full flex-1 overflow-y-auto border p-2 rounded-lg bg-muted border-gray-200">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-lg bg-background"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-5 w-5" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTriggers.length > 0 ? (
            filteredTriggers.map((trigger) => (
              <div
                key={trigger.key}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer bg-background hover:bg-gray-50 transition-colors"
                onClick={() => handleSelectTrigger(trigger)}
              >
                <div className="flex items-center space-x-3">
                  {getTriggerIcon(trigger.category)}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {trigger.displayName}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {trigger.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm">No triggers found.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
