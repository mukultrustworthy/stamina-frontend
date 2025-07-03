import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Clock,
  Users,
  Mail,
  CheckCircle,
  AlertCircle,
  Settings,
  Database,
  Sparkles,
} from "lucide-react";
import type { WorkflowNode, CampaignStartRequest } from "@/types/workflow";

interface CampaignStartDialogProps {
  open: boolean;
  onClose: () => void;
  onStartCampaign: (request: CampaignStartRequest) => void;
  workflowName: string;
  nodes: WorkflowNode[];
  isExecuting?: boolean;
}

export function CampaignStartDialog({
  open,
  onClose,
  onStartCampaign,
  workflowName,
  nodes,
  isExecuting = false,
}: CampaignStartDialogProps) {
  const [testMode, setTestMode] = useState(true);
  const [triggerData, setTriggerData] = useState<Record<string, string>>({});
  const [variables, setVariables] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setTestMode(true);
      setTriggerData({
        email: "test@example.com",
        name: "John Doe",
        company: "Acme Corp",
      });
      setVariables({
        userId: "test-user-123",
        source: "manual",
      });
    }
  }, [open]);

  const getNodeIcon = (node: WorkflowNode) => {
    const iconMap = {
      trigger: <Users className="w-4 h-4" />,
      action: <Mail className="w-4 h-4" />,
      condition: <CheckCircle className="w-4 h-4" />,
      delay: <Clock className="w-4 h-4" />,
      loop: <Settings className="w-4 h-4" />,
    };

    // Try to get specific icons based on registry key
    if (node.data.registryKey) {
      const registryIconMap: Record<string, React.ReactNode> = {
        send_email: <Mail className="w-4 h-4" />,
        create_task: <CheckCircle className="w-4 h-4" />,
        update_lead_status: <Users className="w-4 h-4" />,
        database_query: <Database className="w-4 h-4" />,
        ai_generate_text: <Sparkles className="w-4 h-4" />,
        http_request: <Settings className="w-4 h-4" />,
      };
      return registryIconMap[node.data.registryKey] || iconMap[node.type];
    }

    return iconMap[node.type] || <Settings className="w-4 h-4" />;
  };

  const getNodeTypeColor = (type: string) => {
    const colorMap = {
      trigger: "bg-blue-100 text-blue-800",
      action: "bg-green-100 text-green-800",
      condition: "bg-yellow-100 text-yellow-800",
      delay: "bg-purple-100 text-purple-800",
      loop: "bg-orange-100 text-orange-800",
    };
    return (
      colorMap[type as keyof typeof colorMap] || "bg-gray-100 text-gray-800"
    );
  };

  const handleStart = () => {
    const request: CampaignStartRequest = {
      workflowName,
      nodes,
      triggerData: Object.fromEntries(
        Object.entries(triggerData).filter(([, value]) => value.trim() !== "")
      ),
      variables: Object.fromEntries(
        Object.entries(variables).filter(([, value]) => value.trim() !== "")
      ),
      testMode,
    };
    onStartCampaign(request);
  };

  const totalSteps = nodes.length;
  const actionSteps = nodes.filter((node) => node.type !== "trigger").length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{ maxWidth: "80%", width: "100%" }}
        className="max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Start Campaign: {workflowName}
          </DialogTitle>
          <DialogDescription>
            Execute this workflow with test data or configure custom trigger
            data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex flex-col gap-6">
          {/* Workflow Summary */}
          <div className="space-y-3 border p-4 rounded-lg bg-muted">
            <h3 className="text-sm font-medium">Workflow Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{totalSteps} Total Steps</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <span>{actionSteps} Actions</span>
              </div>
              <div className="flex items-center gap-2">
                {testMode ? (
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                ) : (
                  <Play className="w-4 h-4 text-green-600" />
                )}
                <span>{testMode ? "Test Mode" : "Live Mode"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Workflow Steps Preview */}
            <div className="space-y-3 border p-4 rounded-lg flex-1">
              <h3 className="text-sm font-medium">Execution Flow</h3>
              <div className="space-y-2">
                {nodes.map((node, index) => (
                  <div
                    key={node.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 text-xs font-medium bg-white border rounded-full">
                        {index + 1}
                      </span>
                      {getNodeIcon(node)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {node.data.title}
                        </span>
                        <Badge
                          variant="secondary"
                          className={getNodeTypeColor(node.type)}
                        >
                          {node.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {node.data.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 border p-4 rounded-lg flex flex-col gap-6">
              {/* Trigger Data Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Trigger Data</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(triggerData).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={`trigger-${key}`} className="text-xs">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <Input
                        id={`trigger-${key}`}
                        value={value}
                        onChange={(e) =>
                          setTriggerData({
                            ...triggerData,
                            [key]: e.target.value,
                          })
                        }
                        className="h-8 text-sm"
                        placeholder={`Enter ${key}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Variables Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Variables</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(variables).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={`var-${key}`} className="text-xs">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <Input
                        id={`var-${key}`}
                        value={value}
                        onChange={(e) =>
                          setVariables({ ...variables, [key]: e.target.value })
                        }
                        className="h-8 text-sm"
                        placeholder={`Enter ${key}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isExecuting}>
            Cancel
          </Button>
          <Button onClick={handleStart} disabled={isExecuting}>
            {isExecuting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Campaign
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
