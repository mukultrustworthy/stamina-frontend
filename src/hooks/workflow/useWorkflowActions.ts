import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";
import type {
  CampaignExecution,
  CampaignExecutionStep,
  CampaignExecutionLog,
  CampaignStartRequest,
  WorkflowNode,
} from "@/types/workflow";

export function useWorkflowActions() {
  const [currentExecution, setCurrentExecution] =
    useState<CampaignExecution | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const createExecutionStep = (
    node: WorkflowNode,
    index: number
  ): CampaignExecutionStep => ({
    id: `step-${index}`,
    name: node.data.title,
    type: node.type,
    status: "pending",
  });

  const createExecutionLog = useCallback(
    (
      stepId: string | undefined,
      level: "info" | "warning" | "error" | "debug",
      message: string,
      details?: Record<string, unknown>
    ): CampaignExecutionLog => ({
      id: generateId(),
      stepId,
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
    }),
    []
  );

  const updateExecution = useCallback((updates: Partial<CampaignExecution>) => {
    setCurrentExecution((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const updateStep = useCallback(
    (stepId: string, updates: Partial<CampaignExecutionStep>) => {
      setCurrentExecution((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          steps: prev.steps.map((step) =>
            step.id === stepId ? { ...step, ...updates } : step
          ),
        };
      });
    },
    []
  );

  const addLog = useCallback((log: CampaignExecutionLog) => {
    setCurrentExecution((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        logs: [...prev.logs, log],
      };
    });
  }, []);

  const simulateStepExecution = async (
    step: CampaignExecutionStep,
    triggerData: Record<string, unknown>,
    variables: Record<string, unknown>,
    testMode: boolean
  ): Promise<{
    success: boolean;
    output?: Record<string, unknown>;
    error?: string;
  }> => {
    // Simulate different execution times and results based on step type
    const executionTime = Math.random() * 2000 + 500; // 0.5-2.5 seconds

    addLog(createExecutionLog(step.id, "info", `Starting ${step.name}...`));

    // Simulate step input
    const stepInput = {
      triggerData,
      variables,
      stepType: step.type,
      stepName: step.name,
      testMode,
    };

    updateStep(step.id, {
      startedAt: new Date().toISOString(),
      input: stepInput,
    });

    await new Promise((resolve) => setTimeout(resolve, executionTime));

    // Simulate different outcomes based on step type
    const simulationResults = {
      trigger: () => ({
        success: true,
        output: {
          triggeredBy: "manual",
          timestamp: new Date().toISOString(),
          leadData: triggerData,
        },
      }),
      action: () => {
        // Randomly fail some actions for demonstration (10% failure rate)
        if (Math.random() < 0.1) {
          return {
            success: false,
            error: `Failed to execute ${step.name}: Network timeout after 30 seconds`,
          };
        }

        return {
          success: true,
          output: testMode
            ? {
                status: "simulated",
                message: `${step.name} would be executed in live mode`,
                testData: {
                  ...triggerData,
                  timestamp: new Date().toISOString(),
                },
              }
            : {
                status: "completed",
                message: `${step.name} executed successfully`,
                result: {
                  id: generateId(),
                  timestamp: new Date().toISOString(),
                },
              },
        };
      },
      condition: () => ({
        success: true,
        output: {
          conditionMet: Math.random() > 0.3, // 70% chance of condition being met
          evaluatedAt: new Date().toISOString(),
        },
      }),
      delay: () => ({
        success: true,
        output: {
          delayedUntil: new Date(Date.now() + 60000).toISOString(), // 1 minute delay
          status: "delay_completed",
        },
      }),
      loop: () => ({
        success: true,
        output: {
          iterations: 3,
          status: "loop_completed",
          results: ["iteration_1", "iteration_2", "iteration_3"],
        },
      }),
    };

    const result =
      simulationResults[step.type]?.() || simulationResults.action();

    updateStep(step.id, {
      completedAt: new Date().toISOString(),
      output: result.output,
      error: result.success
        ? undefined
        : "error" in result
        ? result.error
        : undefined,
      duration: executionTime,
    });

    if (result.success) {
      addLog(
        createExecutionLog(
          step.id,
          "info",
          `${step.name} completed successfully`,
          result.output
        )
      );
    } else {
      const errorMessage =
        !result.success && "error" in result
          ? (result as { success: false; error: string }).error
          : "Unknown error";
      addLog(
        createExecutionLog(
          step.id,
          "error",
          `${step.name} failed: ${errorMessage}`,
          { error: errorMessage }
        )
      );
    }

    return result;
  };

  const executeWorkflow = useCallback(
    async (request: CampaignStartRequest) => {
      const executionId = generateId();
      const steps = request.nodes.map(createExecutionStep);

      const execution: CampaignExecution = {
        id: executionId,
        workflowId: request.workflowId || "temp-workflow",
        workflowName: request.workflowName,
        status: "running",
        startedAt: new Date().toISOString(),
        triggerData: request.triggerData || {},
        variables: request.variables || {},
        currentStepIndex: 0,
        totalSteps: steps.length,
        steps,
        logs: [],
        progress: 0,
      };

      setCurrentExecution(execution);
      setIsExecuting(true);

      addLog(
        createExecutionLog(
          undefined,
          "info",
          `Starting campaign execution: ${request.workflowName}`,
          {
            executionId,
            testMode: request.testMode,
            triggerData: request.triggerData,
            variables: request.variables,
          }
        )
      );

      try {
        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];

          // Update current step
          updateExecution({
            currentStepIndex: i,
            progress: Math.round((i / steps.length) * 100),
          });

          updateStep(step.id, { status: "running" });

          // Execute the step
          const result = await simulateStepExecution(
            step,
            request.triggerData || {},
            request.variables || {},
            request.testMode || false
          );

          if (!result.success) {
            const errorMessage = result.error || "Unknown error";
            updateStep(step.id, { status: "failed" });
            updateExecution({
              status: "failed",
              completedAt: new Date().toISOString(),
              error: errorMessage,
            });

            addLog(
              createExecutionLog(
                undefined,
                "error",
                `Campaign execution failed at step ${i + 1}: ${step.name}`,
                { error: errorMessage }
              )
            );

            toast.error(`Campaign failed: ${errorMessage}`);
            setIsExecuting(false);
            return;
          }

          updateStep(step.id, { status: "completed" });
        }

        // Mark execution as completed
        updateExecution({
          status: "completed",
          completedAt: new Date().toISOString(),
          progress: 100,
          currentStepIndex: steps.length,
        });

        addLog(
          createExecutionLog(
            undefined,
            "info",
            `Campaign execution completed successfully`,
            {
              totalSteps: steps.length,
              duration: Date.now() - new Date(execution.startedAt).getTime(),
            }
          )
        );

        toast.success("Campaign executed successfully!");
      } catch (error) {
        updateExecution({
          status: "failed",
          completedAt: new Date().toISOString(),
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        });

        addLog(
          createExecutionLog(
            undefined,
            "error",
            `Campaign execution failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
            { error }
          )
        );

        toast.error("Campaign execution failed");
      } finally {
        setIsExecuting(false);
      }
    },
    [
      addLog,
      createExecutionLog,
      updateExecution,
      updateStep,
      simulateStepExecution,
    ]
  );

  const handleSave = useCallback(() => {
    // TODO: Implement save functionality
    toast.success("Workflow saved successfully");
  }, []);

  const handleStartCampaign = useCallback(
    (request: CampaignStartRequest) => {
      if (isExecuting) {
        toast.warning("A campaign is already running");
        return;
      }

      executeWorkflow(request);
    },
    [isExecuting, executeWorkflow]
  );

  const handleCancelExecution = useCallback(() => {
    if (currentExecution && isExecuting) {
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
      }

      updateExecution({
        status: "cancelled",
        completedAt: new Date().toISOString(),
      });

      addLog(
        createExecutionLog(
          undefined,
          "warning",
          "Campaign execution cancelled by user"
        )
      );

      setIsExecuting(false);
      toast.info("Campaign execution cancelled");
    }
  }, [
    currentExecution,
    isExecuting,
    updateExecution,
    addLog,
    createExecutionLog,
  ]);

  const clearExecution = useCallback(() => {
    setCurrentExecution(null);
    setIsExecuting(false);
  }, []);

  return {
    handleSave,
    handleStartCampaign,
    handleCancelExecution,
    clearExecution,
    currentExecution,
    isExecuting,
  };
}
