import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Copy, Edit, MoreVertical, Plus, Trash, Zap } from "lucide-react";
import { toast } from "sonner";
import type { NodeData } from "@/hooks/workflow/types";

interface NodeProps {
  type: "trigger" | "action";
  data: NodeData;
  id: string;
  selected?: boolean;
  onEdit?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onAddAction?: () => void;
  onInsertAfter?: (nodeId: string) => void;
  onChangeTrigger?: () => void;
}

export function Node({
  type,
  data,
  id,
  selected = false,
  onEdit,
  onDelete,
  onAddAction,
  onInsertAfter,
  onChangeTrigger,
}: NodeProps) {
  const handleNodeClick = () => {
    (onEdit || data.onEdit)?.(id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data));
    toast.success(
      `${type === "trigger" ? "Trigger" : "Action"} copied to clipboard`
    );
  };

  const handleRename = () => {
    (onEdit || data.onEdit)?.(id);
  };

  const handleChangeTrigger = () => {
    onChangeTrigger?.();
  };

  const handleAddAction = () => {
    onAddAction?.();
  };

  const handleDelete = () => {
    (onDelete || data.onDelete)?.(id);
  };

  const isTrigger = type === "trigger";

  return (
    <div
      className={cn(
        "bg-white border rounded-lg p-4 shadow-md w-96 relative group cursor-pointer transition-colors",
        selected
          ? "border-blue-800 border-2 shadow-lg bg-blue-50"
          : "border-gray-200 hover:border-gray-300",
        !isTrigger && "h-20"
      )}
      onClick={handleNodeClick}
    >
      {isTrigger && (
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Trigger
          </h1>
        </div>
      )}

      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isTrigger && (
              <DropdownMenuItem onClick={handleChangeTrigger}>
                <Edit className="w-4 h-4" />
                Change Trigger
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleRename}>
              <Edit className="w-4 h-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="w-4 h-4" />
              Copy
            </DropdownMenuItem>
            {!isTrigger && (
              <DropdownMenuItem onClick={handleDelete}>
                <Trash className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className={cn(
          "flex items-start space-x-3",
          isTrigger && "border rounded-lg p-4"
        )}
      >
        <div
          className={cn(
            "p-2 rounded-lg flex items-center justify-center",
            !isTrigger && "bg-gray-100"
          )}
        >
          {data.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "text-sm font-medium text-gray-900",
              isTrigger && "mb-1"
            )}
          >
            {data.title}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-2">
            {data.description}
          </p>

          {!isTrigger && data.propertyName && (
            <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
              <p className="text-xs text-purple-700 font-medium">
                🏷️ Property Update:
              </p>
              <p className="text-xs text-purple-600">
                {data.propertyName} → {data.propertyValue || "not set"}
              </p>
            </div>
          )}
        </div>
      </div>

      {!isTrigger && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <div className="w-0.5 h-10 bg-black"></div>
        </div>
      )}

      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
        <div className="w-0.5 h-10 bg-black"></div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={(e) => {
                e.stopPropagation();
                if (onInsertAfter) {
                  onInsertAfter(id);
                } else {
                  handleAddAction();
                }
              }}
              className="rounded-full cursor-pointer hover:bg-black hover:text-white size-6 flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent side="right">Add Step</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
