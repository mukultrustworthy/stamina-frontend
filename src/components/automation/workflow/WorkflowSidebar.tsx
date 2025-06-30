import { Mail, Settings } from "lucide-react";

type ActionType = "send-email" | "update-properties" | "update-property";

interface WorkflowSidebarProps {
  onAddAction: (type: ActionType) => void;
}

export function WorkflowSidebar({ onAddAction }: WorkflowSidebarProps) {
  return (
    <div className="w-96 bg-white border-2 p-4 h-[calc(100%-200px)] fixed top-36 right-4 rounded-xl z-[1000]">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Add Child Actions
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Actions will be added as children in the parent-child hierarchy
          </p>
          <div className="space-y-2">
            <div
              className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onAddAction("send-email")}
            >
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Send Email</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Send an email to the person
              </p>
            </div>
            <div
              className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onAddAction("update-properties")}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Update Properties</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Update multiple person properties
              </p>
            </div>
            <div
              className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onAddAction("update-property")}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium">
                  Update Single Property
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Update a specific person property
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
