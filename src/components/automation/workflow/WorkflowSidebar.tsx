import { useState, useEffect } from "react";
import { type Node } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { NodeData } from "@/hooks/workflow/types";

interface WorkflowSidebarProps {
  selectedNode: Node<NodeData> | null;
  onSave: (nodeId: string, updatedData: Partial<NodeData>) => void;
}

export function WorkflowSidebar({
  selectedNode,
  onSave,
}: WorkflowSidebarProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    configuration: {} as Record<string, unknown>,
  });

  const isTrigger = selectedNode?.type === "trigger";

  useEffect(() => {
    if (selectedNode) {
      setFormData({
        title: selectedNode.data.title || "",
        description: selectedNode.data.description || "",
        configuration: selectedNode.data.configuration || {},
      });
    }
  }, [selectedNode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfigChange = (key: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    if (!selectedNode) return;

    onSave(selectedNode.id, {
      title: formData.title,
      description: formData.description,
      configuration: formData.configuration,
    });

    toast.success("Node saved successfully");
  };

  if (!selectedNode) return null;

  return (
    <div className="w-96 bg-white border-2 p-4 h-[calc(100%-160px)] fixed top-36 right-4 rounded-xl z-[1000] overflow-y-auto">
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gray-100">
            {selectedNode.data.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Edit {isTrigger ? "Trigger" : "Action"}
            </h3>
            <p className="text-xs text-gray-500">{selectedNode.data.title}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-medium text-gray-700">
            Title
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter title"
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-xs font-medium text-gray-700"
          >
            Description
          </Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter description"
            className="text-sm"
          />
        </div>

        <div className="border-t pt-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Configuration
          </h4>

          {!isTrigger && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Email Subject
                </Label>
                <Input
                  value={String(formData.configuration.emailSubject || "")}
                  onChange={(e) =>
                    handleConfigChange("emailSubject", e.target.value)
                  }
                  placeholder="Enter email subject"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Email Template
                </Label>
                <textarea
                  value={String(formData.configuration.emailTemplate || "")}
                  onChange={(e) =>
                    handleConfigChange("emailTemplate", e.target.value)
                  }
                  placeholder="Enter email template"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                />
              </div>
            </div>
          )}

          {isTrigger && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Property Name
                </Label>
                <Input
                  value={String(formData.configuration.propertyName || "")}
                  onChange={(e) =>
                    handleConfigChange("propertyName", e.target.value)
                  }
                  placeholder="Enter property name"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Property Value
                </Label>
                <Input
                  value={String(formData.configuration.propertyValue || "")}
                  onChange={(e) =>
                    handleConfigChange("propertyValue", e.target.value)
                  }
                  placeholder="Enter property value"
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs space-y-1">
              <div>
                <strong>Type:</strong> {isTrigger ? "Trigger" : "Action"}
              </div>
              <div>
                <strong>Title:</strong> {formData.title || "Untitled"}
              </div>
              {formData.description && (
                <div>
                  <strong>Description:</strong> {formData.description}
                </div>
              )}
              {Object.keys(formData.configuration).length > 0 && (
                <div className="pt-2 border-t border-gray-300">
                  <div className="font-medium mb-1">Configuration:</div>
                  {Object.entries(formData.configuration).map(
                    ([key, value]) => (
                      <div key={key} className="ml-2">
                        • {key}: {String(value) || "(not set)"}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 mt-6 border-t">
        <Button onClick={handleSave} size="sm">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
