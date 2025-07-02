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
import { Copy, Edit, MoreVertical, Plus, Zap } from "lucide-react";
import { toast } from "sonner";

export interface NodeData extends Record<string, unknown> {
  title: string;
  description: string;
  icon: React.ReactNode;
  onDelete?: (nodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  canDelete?: boolean;
  parentId?: string;
  children?: string[];
  emailSubject?: string;
  emailTemplate?: string;
  propertyName?: string;
  propertyValue?: string;
  // Registry information
  registryKey?: string;
}

interface TriggerNodeProps {
  data: NodeData;
  id: string;
  selected?: boolean;
  onEdit?: (nodeId: string) => void;
  onAddAction?: () => void;
  onInsertAfter?: (nodeId: string) => void; // New prop for inserting after this node
  onChangeTrigger?: () => void; // New prop for changing trigger
}

export function TriggerNode({
  data,
  id,
  selected = false,
  onEdit,
  onAddAction,
  onInsertAfter,
  onChangeTrigger,
}: TriggerNodeProps) {
  const handleNodeClick = () => {
    (onEdit || data.onEdit)?.(id);
  };

  const handleChangeTrigger = () => {
    onChangeTrigger?.();
  };

  const handleRename = () => {
    (onEdit || data.onEdit)?.(id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data));
    toast.success("Trigger copied to clipboard");
  };

  return (
    <div
      className={cn(
        "bg-white border rounded-lg p-4 shadow-md w-96 relative group cursor-pointer transition-colors",
        selected
          ? "border-blue-800 border-2 shadow-lg bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={handleNodeClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Trigger
        </h1>
      </div>

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
            <DropdownMenuItem onClick={handleChangeTrigger}>
              <Edit className="w-4 h-4" />
              Change Trigger
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRename}>
              <Edit className="w-4 h-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="w-4 h-4" />
              Copy
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-start space-x-3 border rounded-lg p-4">
        <div className="p-2 rounded-lg">{data.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {data.title}
          </h4>
          <p className="text-xs text-gray-500">{data.description}</p>
        </div>
      </div>

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
                  onAddAction?.();
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
