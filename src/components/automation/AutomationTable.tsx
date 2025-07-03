import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AutomationTableRow } from "./AutomationTableRow";
import { useGetWorkflows } from "@/hooks/useWorkflowQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { useAutomationFilters } from "@/hooks/useAutomationFilters";

export function AutomationTable() {
  const { data: workflows, isLoading, error } = useGetWorkflows();
  const { getProcessedWorkflows, getEmptyStateMessage } =
    useAutomationFilters();
  const processedWorkflows = getProcessedWorkflows(workflows);

  if (isLoading) {
    return (
      <div className="px-8">
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="border-b">
                <TableHead className="font-medium text-muted-foreground pl-6">
                  Workflow Name
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  Created On
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  Version
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <td className="pl-6 py-4">
                    <Skeleton className="h-4 w-48" />
                  </td>
                  <td className="py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-4">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="py-4">
                    <Skeleton className="h-4 w-8" />
                  </td>
                  <td className="py-4">
                    <Skeleton className="h-8 w-8" />
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8">
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Failed to load workflows. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8">
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="border-b">
              <TableHead className="font-medium text-muted-foreground pl-6">
                Workflow Name
              </TableHead>
              <TableHead className="font-medium text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="font-medium text-muted-foreground">
                Created On
              </TableHead>
              <TableHead className="font-medium text-muted-foreground">
                Version
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedWorkflows.length === 0 ? (
              <TableRow>
                <td
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  {getEmptyStateMessage()}
                </td>
              </TableRow>
            ) : (
              processedWorkflows.map((workflow) => (
                <AutomationTableRow key={workflow.id} workflow={workflow} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
