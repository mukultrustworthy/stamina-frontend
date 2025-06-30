import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useCreateWorkflow } from "@/hooks/useWorkflowQueries";
import type { WorkflowSegment } from "@/types/workflow";

const workflowSchema = z.object({
  name: z
    .string()
    .min(1, "Workflow name is required")
    .min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  segment: z.enum(["CRM", "SALES", "MARKETING"]),
});

type WorkflowFormData = z.infer<typeof workflowSchema>;

interface NewWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewWorkflowDialog({
  open,
  onOpenChange,
}: NewWorkflowDialogProps) {
  const navigate = useNavigate();

  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      description: "",
      segment: "CRM",
    },
  });

  const createWorkflowMutation = useCreateWorkflow((workflow) => {
    // Reset form and close dialog
    form.reset();
    onOpenChange(false);

    // Navigate to workflow editor with the workflow ID
    navigate(`/workflow/${workflow.id}`, {
      state: {
        workflowName: workflow.name,
        workflowId: workflow.id,
        isNew: true,
      },
    });
  });

  const handleSubmit = async (data: WorkflowFormData) => {
    // Create a basic workflow structure with minimal trigger and steps
    const workflowPayload = {
      name: data.name,
      description: data.description,
      segment: data.segment as WorkflowSegment,
      trigger: {
        triggerKey: "manual_trigger", // Default trigger for new workflows
        properties: {},
      },
      steps: [], // Start with empty steps - will be configured in editor
      edges: [], // Start with empty edges
      isActive: false, // New workflows start inactive
    };

    createWorkflowMutation.mutate(workflowPayload);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Give your workflow a name to get started. You can always change this
            later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter workflow name..."
                      {...field}
                      disabled={createWorkflowMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe what this workflow does..."
                      {...field}
                      disabled={createWorkflowMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="segment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segment</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          disabled={createWorkflowMutation.isPending}
                        >
                          {field.value}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onClick={() => field.onChange("CRM")}>
                          CRM
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => field.onChange("SALES")}
                        >
                          SALES
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => field.onChange("MARKETING")}
                        >
                          MARKETING
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createWorkflowMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createWorkflowMutation.isPending}>
                {createWorkflowMutation.isPending
                  ? "Creating..."
                  : "Create Workflow"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
