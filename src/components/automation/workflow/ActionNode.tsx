import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreVertical, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Specific node data properties
interface BaseNodeData {
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

// Intersection type for React Flow compatibility while maintaining type safety
type NodeData = BaseNodeData & Record<string, unknown>;

interface ActionNodeProps {
  data: NodeData;
  id: string;
  selected?: boolean;
  onEdit?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onAddAction?: () => void;
  onInsertAfter?: (nodeId: string) => void; // New prop for inserting after this node
}

export function ActionNode({
  data,
  id,
  selected = false,
  onEdit,
  onDelete,
  onAddAction,
  onInsertAfter,
}: ActionNodeProps) {
  const handleNodeClick = () => {
    (onEdit || data.onEdit)?.(id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data));
    toast.success("Node copied to clipboard");
  };

  const handleRename = () => {
    (onEdit || data.onEdit)?.(id);
  };

  return (
    <div
      className={cn(
        "bg-white p-4 h-20 border rounded-lg shadow-md w-96 relative group cursor-pointer transition-colors",
        selected
          ? "border-blue-800 border-2 shadow-lg bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={handleNodeClick}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-gray-100 flex items-center justify-center">
          {data.icon}
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
                <DropdownMenuItem onClick={handleRename}>
                  <Edit className="w-4 h-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="w-4 h-4" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => (onDelete || data.onDelete)?.(id)}
                >
                  <Trash className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">{data.title}</h4>
          <p className="text-xs text-gray-500 line-clamp-2">
            {data.description}
          </p>
          {data.propertyName && (
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

      {/* make line from trigger to action */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
        <div className="w-0.5 h-10 bg-black"></div>
      </div>
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
        <div className="w-0.5 h-10 bg-black"></div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={(e) => {
                e.stopPropagation();
                // Use insertAfter if available, fallback to onAddAction for end-of-chain behavior
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
