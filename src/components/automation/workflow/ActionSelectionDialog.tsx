import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Settings } from "lucide-react";

type ActionType = "send-email" | "update-properties" | "update-property";

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
  const actions = [
    {
      type: "send-email" as ActionType,
      title: "Send Email",
      description: "Send an email to the person",
      icon: <Mail className="w-5 h-5 text-green-500" />,
    },
    {
      type: "update-properties" as ActionType,
      title: "Update Properties",
      description: "Update multiple person properties",
      icon: <Settings className="w-5 h-5 text-purple-500" />,
    },
    {
      type: "update-property" as ActionType,
      title: "Update Single Property",
      description: "Update a specific person property",
      icon: <Settings className="w-5 h-5 text-indigo-500" />,
    },
  ];

  const handleSelectAction = (type: ActionType) => {
    onSelectAction(type);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Action</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {actions.map((action) => (
            <div
              key={action.type}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
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
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
