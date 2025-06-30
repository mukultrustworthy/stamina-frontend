import { Badge } from "@/components/ui/badge";
import { Handle, Position } from "@xyflow/react";
import { Edit, Plus } from "lucide-react";

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
}

interface TriggerNodeProps {
  data: NodeData;
  id: string;
  onEdit?: (nodeId: string) => void;
  onAddAction?: () => void;
}

export function TriggerNode({
  data,
  id,
  onEdit,
  onAddAction,
}: TriggerNodeProps) {
  return (
    <div className="bg-white border-2 border-blue-300 rounded-lg p-4 shadow-md min-w-[280px] relative group">
      {/* Edit button */}
      <button
        onClick={() => (onEdit || data.onEdit)?.(id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-blue-600 z-10"
      >
        <Edit className="w-3 h-3" />
      </button>

      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-blue-100">{data.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="default" className="bg-blue-500">
              Trigger (Parent)
            </Badge>
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {data.title}
          </h4>
          <p className="text-xs text-gray-500">{data.description}</p>
        </div>
      </div>

      {/* Plus button to add action */}
      {!data.childId && onAddAction && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={onAddAction}
            className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add child action button */}
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}
