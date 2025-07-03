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
import type { ActionType } from "@/hooks/workflow/types";
import type { TriggerRegistryResponse } from "@/types/workflow";
import { actionTypeData, getTriggerIcon } from "@/hooks/workflow/constants";
import { useGetTriggers } from "@/hooks/queries/useWorkflowQueries";

type SelectionType = "action" | "trigger";

interface BaseItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ActionItem extends BaseItem {
  type: ActionType;
}

interface TriggerItem extends BaseItem {
  data: TriggerRegistryResponse;
}

interface SelectionDialogProps {
  type: SelectionType;
  open: boolean;
  onClose: () => void;
  onSelectAction?: (type: ActionType) => void;
  onSelectTrigger?: (trigger: TriggerRegistryResponse) => void;
}

export function SelectionDialog({
  type,
  open,
  onClose,
  onSelectAction,
  onSelectTrigger,
}: SelectionDialogProps) {
  const [search, setSearch] = useState("");
  const { data: triggers, isLoading } = useGetTriggers(type === "trigger");

  const dialogConfig = {
    action: {
      title: "Add Action",
      description: "Select an action to add to your workflow.",
      searchPlaceholder: "Search for an action...",
      noItemsMessage: "No actions found.",
    },
    trigger: {
      title: "Change Trigger",
      description: "Select a trigger to start your workflow.",
      searchPlaceholder: "Search for a trigger...",
      noItemsMessage: "No triggers found.",
    },
  };

  const config = dialogConfig[type];

  const items: (ActionItem | TriggerItem)[] =
    type === "action"
      ? Object.entries(actionTypeData).map(([actionType, data]) => ({
          id: actionType,
          type: actionType as ActionType,
          title: data.title,
          description: data.description,
          icon: data.icon,
        }))
      : (triggers || []).map((trigger) => ({
          id: trigger.key,
          data: trigger,
          title: trigger.displayName,
          description: trigger.description || "",
          icon: getTriggerIcon(trigger.category),
        }));

  const filteredItems = items.filter((item) => {
    const searchLower = search.toLowerCase();
    if (type === "action") {
      return item.title.toLowerCase().includes(searchLower);
    } else {
      const triggerItem = item as TriggerItem;
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        triggerItem.data.key.toLowerCase().includes(searchLower)
      );
    }
  });

  const handleItemSelect = (item: ActionItem | TriggerItem) => {
    if (type === "action" && onSelectAction) {
      onSelectAction((item as ActionItem).type);
    } else if (type === "trigger" && onSelectTrigger) {
      onSelectTrigger((item as TriggerItem).data);
      onClose();
    }
  };

  const showLoading = type === "trigger" && isLoading;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[60vh] max-w-lg w-full overflow-y-auto flex flex-col">
        <DialogHeader className="space-y-0">
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mb-auto">
          <Search className="w-4 h-4" />
          <Input
            placeholder={config.searchPlaceholder}
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-3 h-full flex-1 overflow-y-auto border p-2 rounded-lg bg-muted border-gray-200">
          {showLoading ? (
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
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer bg-background hover:bg-gray-50 transition-colors"
                onClick={() => handleItemSelect(item)}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm">{config.noItemsMessage}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
