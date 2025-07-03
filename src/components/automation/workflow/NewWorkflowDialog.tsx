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
import { useCreateWorkflow } from "@/hooks/useWorkflowQueries";

const workflowSchema = z.object({
  name: z
    .string()
    .min(1, "Workflow name is required")
    .min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
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
    },
  });

  const createWorkflowMutation = useCreateWorkflow((workflow) => {
    form.reset();
    onOpenChange(false);

    navigate(`/workflow/${workflow.id}`, {
      state: {
        workflowName: workflow.name,
        workflowId: workflow.id,
        isNew: true,
      },
    });
  });

  const handleSubmit = async (data: WorkflowFormData) => {
    const workflowPayload = {
      name: data.name,
      description: data.description,
      trigger: {
        triggerKey: "manual_trigger",
        properties: {},
      },
      steps: [],
      edges: [],
      isActive: false,
    };

    createWorkflowMutation.mutate(workflowPayload);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
