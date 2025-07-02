import { useState, useEffect } from "react";
import { type Node } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { workflowService } from "@/api/workflows";
import type {
  TriggerRegistryResponse,
  ActionRegistryResponse,
  WorkflowFilterCondition,
  FilterGroup,
  PropertySchema,
} from "@/types/workflow";
import { toast } from "sonner";

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
  // Registry information
  registryKey?: string;
  // Trigger-specific configuration
  triggerProperties?: Record<string, unknown>;
  triggerFilters?: FilterGroup;
  // Action-specific configuration
  actionProperties?: Record<string, unknown>;
  actionOperation?: string;
  actionResource?: string;
}

interface WorkflowSidebarProps {
  selectedNode: Node<NodeData> | null;
  onSave: (nodeId: string, updatedData: Partial<NodeData>) => void;
  onClose: () => void;
}

export function WorkflowSidebar({
  selectedNode,
  onSave,
  onClose,
}: WorkflowSidebarProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailTemplate, setEmailTemplate] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [propertyValue, setPropertyValue] = useState("");

  // Trigger-specific state
  const [triggerProperties, setTriggerProperties] = useState<
    Record<string, unknown>
  >({});
  const [triggerFilters, setTriggerFilters] = useState<FilterGroup>({
    combinator: "AND",
    conditions: [],
  });

  // Action-specific state
  const [actionProperties, setActionProperties] = useState<
    Record<string, unknown>
  >({});
  const [actionOperation, setActionOperation] = useState<string>("");
  const [actionResource, setActionResource] = useState<string>("");

  const isTrigger = selectedNode?.type === "trigger";
  const registryKey =
    selectedNode?.data?.registryKey || (isTrigger ? "lead_created" : null);

  // Fetch trigger registry data
  const { data: triggerRegistry } = useQuery<TriggerRegistryResponse>({
    queryKey: ["trigger-registry", registryKey],
    queryFn: () => workflowService.triggers.getTriggerByKey(registryKey!),
    enabled: isTrigger && !!registryKey,
  });

  // Fetch action registry data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: actionRegistry } = useQuery<ActionRegistryResponse>({
    queryKey: ["action-registry", registryKey],
    queryFn: () => workflowService.actions.getActionByKey(registryKey!),
    enabled: !isTrigger && !!registryKey,
  });

  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.data.title);
      setDescription(selectedNode.data.description);
      setEmailSubject(selectedNode.data.emailSubject || "");
      setEmailTemplate(selectedNode.data.emailTemplate || "");
      setPropertyName(selectedNode.data.propertyName || "");
      setPropertyValue(selectedNode.data.propertyValue || "");

      // Set trigger-specific data
      setTriggerProperties(selectedNode.data.triggerProperties || {});
      setTriggerFilters(
        selectedNode.data.triggerFilters || {
          combinator: "AND",
          conditions: [],
        }
      );

      // Set action-specific data
      setActionProperties(selectedNode.data.actionProperties || {});
      setActionOperation(selectedNode.data.actionOperation || "");
      setActionResource(selectedNode.data.actionResource || "");
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (!selectedNode) return;

    const updatedData: Partial<NodeData> = {
      title,
      description,
      emailSubject,
      emailTemplate,
      propertyName,
      propertyValue,
    };

    // Add trigger-specific data
    if (isTrigger) {
      updatedData.triggerProperties = triggerProperties;
      updatedData.triggerFilters = triggerFilters;
    } else {
      // Add action-specific data
      updatedData.actionProperties = actionProperties;
      updatedData.actionOperation = actionOperation;
      updatedData.actionResource = actionResource;
    }

    onSave(selectedNode.id, updatedData);
    toast.success("Node saved successfully");
  };

  const handlePropertyChange = (propertyName: string, value: unknown) => {
    setTriggerProperties((prev) => ({
      ...prev,
      [propertyName]: value,
    }));
  };

  const handleActionPropertyChange = (propertyName: string, value: unknown) => {
    setActionProperties((prev) => ({
      ...prev,
      [propertyName]: value,
    }));
  };

  const addFilterCondition = () => {
    const newCondition: WorkflowFilterCondition = {
      variable: "",
      operator: "equals",
      value: "",
      type: "string",
    };

    setTriggerFilters((prev) => ({
      ...prev,
      conditions: [...prev.conditions, newCondition],
    }));
  };

  const removeFilterCondition = (index: number) => {
    setTriggerFilters((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const updateFilterCondition = (
    index: number,
    updates: Partial<WorkflowFilterCondition>
  ) => {
    setTriggerFilters((prev) => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === index ? { ...condition, ...updates } : condition
      ),
    }));
  };

  const renderPropertyField = (property: PropertySchema) => {
    const value = triggerProperties[property.name] || "";

    if (property.type === "options" && property.options) {
      return (
        <div key={property.name} className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">
            {property.displayName}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <select
            value={String(value)}
            onChange={(e) =>
              handlePropertyChange(property.name, e.target.value)
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select {property.displayName}</option>
            {property.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={property.name} className="space-y-2">
        <Label className="text-xs font-medium text-gray-700">
          {property.displayName}
          {property.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          type={property.type === "number" ? "number" : "text"}
          value={String(value)}
          onChange={(e) =>
            handlePropertyChange(
              property.name,
              property.type === "number"
                ? Number(e.target.value) || 0
                : e.target.value
            )
          }
          placeholder={`Enter ${property.displayName.toLowerCase()}`}
          className="text-sm"
        />
      </div>
    );
  };

  const renderActionPropertyField = (property: PropertySchema) => {
    const value = actionProperties[property.name] || "";

    if (property.type === "options" && property.options) {
      return (
        <div key={property.name} className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">
            {property.displayName}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <select
            value={String(value)}
            onChange={(e) =>
              handleActionPropertyChange(property.name, e.target.value)
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select {property.displayName}</option>
            {property.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (property.type === "date") {
      return (
        <div key={property.name} className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">
            {property.displayName}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            type="date"
            value={String(value)}
            onChange={(e) =>
              handleActionPropertyChange(property.name, e.target.value)
            }
            className="text-sm"
          />
        </div>
      );
    }

    return (
      <div key={property.name} className="space-y-2">
        <Label className="text-xs font-medium text-gray-700">
          {property.displayName}
          {property.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          type={property.type === "number" ? "number" : "text"}
          value={String(value)}
          onChange={(e) =>
            handleActionPropertyChange(
              property.name,
              property.type === "number"
                ? Number(e.target.value) || 0
                : e.target.value
            )
          }
          placeholder={`Enter ${property.displayName.toLowerCase()}`}
          className="text-sm"
        />
      </div>
    );
  };

  if (!selectedNode) return null;

  return (
    <div className="w-96 bg-white border-2 p-4 h-[calc(100%-160px)] fixed top-36 right-4 rounded-xl z-[1000] overflow-y-auto">
      {/* Header */}
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
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Basic Fields */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-medium text-gray-700">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="text-sm"
          />
        </div>

        {/* Trigger-specific Fields */}
        {isTrigger && triggerRegistry && (
          <>
            {/* Trigger Properties */}
            {triggerRegistry.propertiesSchema?.properties?.length > 0 && (
              <div className="space-y-3">
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Trigger Configuration
                  </h4>
                  <div className="text-xs text-gray-500 mb-3">
                    Configure how this trigger should behave
                  </div>
                  {triggerRegistry.propertiesSchema.properties.map(
                    renderPropertyField
                  )}
                </div>
              </div>
            )}

            {/* Filter Conditions */}
            {triggerRegistry.filterSchema?.fields &&
              triggerRegistry.filterSchema.fields.length > 0 && (
                <div className="space-y-3">
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Filter Conditions
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={addFilterCondition}
                        className="text-xs h-7"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Filter
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Add conditions to filter when this trigger should fire
                    </div>

                    {/* Combinator */}
                    {triggerFilters.conditions.length > 1 && (
                      <div className="mb-3">
                        <Label className="text-xs font-medium text-gray-700">
                          Combine conditions with
                        </Label>
                        <select
                          value={triggerFilters.combinator}
                          onChange={(e) =>
                            setTriggerFilters((prev) => ({
                              ...prev,
                              combinator: e.target.value as "AND" | "OR",
                            }))
                          }
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md mt-1"
                        >
                          <option value="AND">
                            AND (all conditions must match)
                          </option>
                          <option value="OR">
                            OR (any condition can match)
                          </option>
                        </select>
                      </div>
                    )}

                    {/* Filter Conditions */}
                    <div className="space-y-2">
                      {triggerFilters.conditions.map((condition, index) => (
                        <div
                          key={index}
                          className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700">
                              Condition {index + 1}
                            </span>
                            <button
                              onClick={() => removeFilterCondition(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {/* Variable */}
                            <div>
                              <Label className="text-xs text-gray-600">
                                Field
                              </Label>
                              <select
                                value={condition.variable}
                                onChange={(e) =>
                                  updateFilterCondition(index, {
                                    variable: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                              >
                                <option value="">Select field</option>
                                {triggerRegistry.filterSchema?.fields.map(
                                  (field) => (
                                    <option key={field.name} value={field.name}>
                                      {field.displayName}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>

                            {/* Operator */}
                            <div>
                              <Label className="text-xs text-gray-600">
                                Operator
                              </Label>
                              <select
                                value={condition.operator}
                                onChange={(e) =>
                                  updateFilterCondition(index, {
                                    operator: e.target
                                      .value as WorkflowFilterCondition["operator"],
                                  })
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                              >
                                <option value="equals">Equals</option>
                                <option value="not_equals">Not Equals</option>
                                <option value="contains">Contains</option>
                                <option value="greater_than">
                                  Greater Than
                                </option>
                                <option value="less_than">Less Than</option>
                              </select>
                            </div>

                            {/* Value */}
                            <div className="col-span-2">
                              <Label className="text-xs text-gray-600">
                                Value
                              </Label>
                              <Input
                                value={String(condition.value)}
                                onChange={(e) =>
                                  updateFilterCondition(index, {
                                    value: e.target.value,
                                  })
                                }
                                placeholder="Enter value"
                                className="text-xs h-7"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {triggerFilters.conditions.length === 0 && (
                      <div className="text-xs text-gray-500 italic text-center py-3">
                        No filter conditions added. This trigger will fire for
                        all events.
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Available Variables Info */}
            {triggerRegistry.availableVariables &&
              Object.keys(triggerRegistry.availableVariables).length > 0 && (
                <div className="space-y-2">
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Available Variables
                    </h4>
                    <div className="text-xs text-gray-500 mb-2">
                      You can use these variables in your workflow actions:
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="space-y-1">
                        {Object.entries(triggerRegistry.availableVariables).map(
                          ([name, type]) => (
                            <div
                              key={name}
                              className="flex justify-between text-xs"
                            >
                              <code className="text-blue-800 font-mono">
                                {`{{${name}}}`}
                              </code>
                              <span className="text-blue-600">{type}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </>
        )}

        {/* Action-specific Fields */}
        {!isTrigger && actionRegistry && (
          <>
            {/* Action Properties */}
            {actionRegistry.propertiesSchema?.properties?.length > 0 && (
              <div className="space-y-3">
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Action Configuration
                  </h4>
                  <div className="text-xs text-gray-500 mb-3">
                    Configure the parameters for this action
                  </div>
                  {actionRegistry.propertiesSchema.properties.map(
                    renderActionPropertyField
                  )}
                </div>
              </div>
            )}

            {/* Operation Schema */}
            {actionRegistry.operationSchema &&
              Object.keys(actionRegistry.operationSchema).length > 0 && (
                <div className="space-y-3">
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Operation Settings
                    </h4>
                    <div className="text-xs text-gray-500 mb-3">
                      Select the resource and operation for this action
                    </div>

                    {/* Resource Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-700">
                        Resource
                      </Label>
                      <select
                        value={actionResource}
                        onChange={(e) => setActionResource(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Resource</option>
                        {Object.entries(actionRegistry.operationSchema).map(
                          ([key, schema]) => (
                            <option key={key} value={key}>
                              {schema.displayName}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Operation Selection */}
                    {actionResource &&
                      actionRegistry.operationSchema[actionResource] && (
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-gray-700">
                            Operation
                          </Label>
                          <select
                            value={actionOperation}
                            onChange={(e) => setActionOperation(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Operation</option>
                            {actionRegistry.operationSchema[
                              actionResource
                            ].operations.map((operation) => (
                              <option key={operation} value={operation}>
                                {operation.charAt(0).toUpperCase() +
                                  operation.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                  </div>
                </div>
              )}

            {/* Credentials Schema */}
            {actionRegistry.credentialsSchema && (
              <div className="space-y-3">
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Credentials Required
                  </h4>
                  <div className="text-xs text-gray-500 mb-3">
                    This action requires the following credentials
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    {actionRegistry.credentialsSchema.required?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-yellow-800 mb-1">
                          Required:
                        </p>
                        <div className="space-y-1">
                          {actionRegistry.credentialsSchema.required.map(
                            (cred) => (
                              <div
                                key={cred}
                                className="text-xs text-yellow-700"
                              >
                                • {cred}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {actionRegistry.credentialsSchema.optional?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-yellow-800 mb-1">
                          Optional:
                        </p>
                        <div className="space-y-1">
                          {actionRegistry.credentialsSchema.optional.map(
                            (cred) => (
                              <div
                                key={cred}
                                className="text-xs text-yellow-700"
                              >
                                • {cred}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Preview */}
            {(actionResource ||
              actionOperation ||
              Object.keys(actionProperties).length > 0) && (
              <div className="space-y-2">
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Action Preview
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="space-y-1 text-xs">
                      {actionResource && actionOperation && (
                        <div className="text-green-800 font-medium">
                          Action: {actionOperation} {actionResource}
                        </div>
                      )}
                      {Object.keys(actionProperties).length > 0 && (
                        <div className="text-green-700">
                          <div className="font-medium mb-1">Parameters:</div>
                          {Object.entries(actionProperties).map(
                            ([key, value]) => (
                              <div key={key} className="ml-2">
                                • {key}: {String(value) || "(not set)"}
                              </div>
                            )
                          )}
                        </div>
                      )}
                      {Object.keys(actionProperties).length === 0 &&
                        !actionResource &&
                        !actionOperation && (
                          <div className="text-green-600 italic">
                            Configure the action properties to see preview
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4 mt-6 border-t">
        <Button variant="outline" onClick={onClose} size="sm">
          Cancel
        </Button>
        <Button onClick={handleSave} size="sm">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
