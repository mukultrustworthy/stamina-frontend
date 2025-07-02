import { useState, useEffect } from "react";
import { type Node } from "@xyflow/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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

interface EditNodeDialogProps {
  node: Node<NodeData> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeId: string, updatedData: Partial<NodeData>) => void;
}

export function EditNodeDialog({
  node,
  isOpen,
  onClose,
  onSave,
}: EditNodeDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailTemplate, setEmailTemplate] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [propertyValue, setPropertyValue] = useState("");

  useEffect(() => {
    if (node) {
      setTitle(node.data.title);
      setDescription(node.data.description);
      setEmailSubject(node.data.emailSubject || "");
      setEmailTemplate(node.data.emailTemplate || "");
      setPropertyName(node.data.propertyName || "");
      setPropertyValue(node.data.propertyValue || "");
    }
  }, [node]);

  const handleSave = () => {
    if (!node) return;

    const updatedData: Partial<NodeData> = {
      title,
      description,
      emailSubject,
      emailTemplate,
      propertyName,
      propertyValue,
    };

    onSave(node.id, updatedData);
    toast.success("Node updated successfully");
  };

  if (!node) return null;

  const isTrigger = node.type === "trigger";
  const isEmailAction = node.data.title.toLowerCase().includes("email");
  const isPropertyAction =
    node.data.title.toLowerCase().includes("properties") ||
    node.data.title.toLowerCase().includes("property") ||
    (node.data.title.toLowerCase().includes("update") &&
      !node.data.title.toLowerCase().includes("email"));

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent style={{ width: "600px" }} className="p-4">
        <SheetHeader>
          <SheetTitle>
            Edit {isTrigger ? "Trigger" : "Action"}: {node.data.title}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          {/* Email-specific fields */}
          {isEmailAction && (
            <>
              <div className="space-y-2">
                <Label htmlFor="emailSubject">Email Subject</Label>
                <Input
                  id="emailSubject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailTemplate">Email Template</Label>
                <textarea
                  id="emailTemplate"
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  placeholder="Enter email template"
                  className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </>
          )}

          {/* Property update fields */}
          {isPropertyAction && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input
                    id="propertyName"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="e.g., status, category, score"
                  />
                  <p className="text-xs text-gray-500">
                    The name of the property you want to update
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyValue">Property Value</Label>
                  <Input
                    id="propertyValue"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    placeholder="e.g., active, premium, 100"
                  />
                  <p className="text-xs text-gray-500">
                    The new value to set for this property
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    Preview:
                  </p>
                  <p className="text-sm text-blue-700">
                    {propertyName && propertyValue
                      ? `Set "${propertyName}" = "${propertyValue}"`
                      : "Enter property name and value to see preview"}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
