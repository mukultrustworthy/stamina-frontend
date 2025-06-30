import { Badge } from "@/components/ui/badge";
import { Handle, Position } from "@xyflow/react";
import { Edit, X, Plus } from "lucide-react";

interface NodeData extends Record<string, unknown> {
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
}

interface ActionNodeProps {
  data: NodeData;
  id: string;
  onEdit?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onAddAction?: () => void;
}

export function ActionNode({
  data,
  id,
  onEdit,
  onDelete,
  onAddAction,
}: ActionNodeProps) {
  return (
    <div className="bg-white border-2 border-green-300 rounded-lg p-4 shadow-md min-w-[280px] relative group">
      {/* Edit button */}
      <button
        onClick={() => (onEdit || data.onEdit)?.(id)}
        className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-blue-600 z-10"
      >
        <Edit className="w-3 h-3" />
      </button>

      {/* Delete button */}
      {data.canDelete && (
        <button
          onClick={() => (onDelete || data.onDelete)?.(id)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600 z-10"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-green-100">{data.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="secondary" className="bg-green-500 text-white">
              Action (Child)
            </Badge>
            {data.parentId && (
              <Badge variant="outline" className="text-xs">
                Parent: {data.parentId}
              </Badge>
            )}
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {data.title}
          </h4>
          <p className="text-xs text-gray-500">{data.description}</p>

          {/* Show additional properties if available */}
          {data.emailSubject && (
            <p className="text-xs text-blue-600 mt-1">
              📧 Subject: {data.emailSubject}
            </p>
          )}
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

      {/* Plus button to add action */}
      {!data.childId && onAddAction && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={onAddAction}
            className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Connection handles */}
      <Handle type="target" position={Position.Top} id="target" />
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}
