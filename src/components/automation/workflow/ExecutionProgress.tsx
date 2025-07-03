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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  X,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Users,
  Mail,
  CheckCircle,
  Settings,
  Copy,
  ExternalLink,
} from "lucide-react";
import type {
  CampaignExecution,
  CampaignExecutionStep,
} from "@/types/workflow";

interface ExecutionProgressProps {
  open: boolean;
  onClose: () => void;
  execution: CampaignExecution | null;
  onCancel?: () => void;
}

export function ExecutionProgress({
  open,
  onClose,
  execution,
  onCancel,
}: ExecutionProgressProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showLogs, setShowLogs] = useState(true);

  // Auto-expand failed or currently running steps
  useEffect(() => {
    if (execution) {
      const newExpanded = new Set<string>();
      execution.steps.forEach((step) => {
        if (step.status === "failed" || step.status === "running") {
          newExpanded.add(step.id);
        }
      });
      setExpandedSteps(newExpanded);
    }
  }, [execution]);

  if (!execution) return null;

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStepIcon = (step: CampaignExecutionStep) => {
    const statusIconMap = {
      pending: <Clock className="w-4 h-4 text-gray-400" />,
      running: <Clock className="w-4 h-4 text-blue-500 animate-spin" />,
      completed: <Check className="w-4 h-4 text-green-500" />,
      failed: <X className="w-4 h-4 text-red-500" />,
      skipped: <AlertCircle className="w-4 h-4 text-yellow-500" />,
    };
    return statusIconMap[step.status];
  };

  const getStepTypeIcon = (step: CampaignExecutionStep) => {
    const typeIconMap = {
      trigger: <Users className="w-4 h-4" />,
      action: <Mail className="w-4 h-4" />,
      condition: <CheckCircle className="w-4 h-4" />,
      delay: <Clock className="w-4 h-4" />,
      loop: <Settings className="w-4 h-4" />,
    };
    return typeIconMap[step.type] || <Settings className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: "bg-gray-100 text-gray-800",
      running: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-orange-100 text-orange-800",
      skipped: "bg-yellow-100 text-yellow-800",
    };
    return (
      colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-800"
    );
  };

  const getLogIcon = (level: string) => {
    const iconMap = {
      info: <CheckCircle className="w-3 h-3 text-blue-500" />,
      warning: <AlertCircle className="w-3 h-3 text-yellow-500" />,
      error: <X className="w-3 h-3 text-red-500" />,
      debug: <Settings className="w-3 h-3 text-gray-500" />,
    };
    return (
      iconMap[level as keyof typeof iconMap] || (
        <CheckCircle className="w-3 h-3 text-gray-500" />
      )
    );
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const currentStep = execution.steps.find((step) => step.status === "running");
  const completedSteps = execution.steps.filter(
    (step) => step.status === "completed"
  ).length;
  const failedSteps = execution.steps.filter(
    (step) => step.status === "failed"
  ).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{ maxWidth: "80%", width: "100%" }}
        className="h-[90vh] overflow-y-auto flex flex-col gap-6"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {execution.status === "running" && (
              <Clock className="w-5 h-5 animate-spin text-blue-500" />
            )}
            {execution.status === "completed" && (
              <Check className="w-5 h-5 text-green-500" />
            )}
            {execution.status === "failed" && (
              <X className="w-5 h-5 text-red-500" />
            )}
            Campaign Execution: {execution.workflowName}
          </DialogTitle>
          <DialogDescription>
            Execution ID: {execution.id} • Started at{" "}
            {formatTimestamp(execution.startedAt)}
          </DialogDescription>
        </DialogHeader>

        {/* Execution Summary */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg h-20">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {execution.progress}%
            </div>
            <div className="text-xs text-gray-600">Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {completedSteps}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{failedSteps}</div>
            <div className="text-xs text-gray-600">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {execution.totalSteps}
            </div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${execution.progress}%` }}
          />
        </div>

        {/* Current Step */}
        {currentStep && (
          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin text-blue-500" />
              <span className="font-medium text-blue-800">
                Currently executing: {currentStep.name}
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden flex h-full">
          {/* Steps Panel */}
          <div className="flex-1 overflow-y-auto border-r pr-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm mb-3">Execution Steps</h3>
              {execution.steps.map((step, index) => (
                <div key={step.id} className="border rounded-lg">
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleStepExpansion(step.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 text-xs font-medium bg-white border rounded-full">
                        {index + 1}
                      </span>
                      {getStepIcon(step)}
                      {getStepTypeIcon(step)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{step.name}</span>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(step.status)}
                        >
                          {step.status}
                        </Badge>
                        {step.duration && (
                          <span className="text-xs text-gray-500">
                            {formatDuration(step.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                    {expandedSteps.has(step.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>

                  {expandedSteps.has(step.id) && (
                    <div className="px-3 pb-3 space-y-3">
                      <Separator />
                      {step.input && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-gray-700">
                              Input
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  JSON.stringify(step.input, null, 2)
                                )
                              }
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(step.input, null, 2)}
                          </pre>
                        </div>
                      )}
                      {step.output && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-gray-700">
                              Output
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  JSON.stringify(step.output, null, 2)
                                )
                              }
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(step.output, null, 2)}
                          </pre>
                        </div>
                      )}
                      {step.error && (
                        <div>
                          <span className="text-xs font-medium text-red-700">
                            Error
                          </span>
                          <div className="text-xs text-red-600 bg-red-50 p-2 rounded mt-1">
                            {step.error}
                          </div>
                        </div>
                      )}
                      {step.retryCount && step.retryCount > 0 && (
                        <div className="text-xs text-orange-600">
                          Retried {step.retryCount} time(s)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Logs Panel */}
          {showLogs && (
            <div className="w-1/3 pl-4 h-full flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Execution Logs</h3>
              </div>
              <div className="space-y-1 overflow-y-auto flex-1">
                {execution.logs.map((log) => (
                  <div key={log.id} className="text-xs p-2 border rounded">
                    <div className="flex items-center gap-2 mb-1">
                      {getLogIcon(log.level)}
                      <span className="font-medium">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {log.level}
                      </Badge>
                    </div>
                    <div className="text-gray-700">{log.message}</div>
                    {log.details && (
                      <pre className="text-gray-600 mt-1 overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showLogs && (
            <Button
              variant="ghost"
              size="sm"
              className="self-start"
              onClick={() => setShowLogs(true)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Show Logs
            </Button>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {execution.status === "running" && onCancel && (
            <Button variant="destructive" onClick={onCancel}>
              Cancel Execution
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            {execution.status === "running" ? "Close" : "Done"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
