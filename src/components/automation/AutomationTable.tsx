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

interface AutomationTableProps {
  // Optional prop to allow external filtering
  searchTerm?: string;
}

export function AutomationTable({ searchTerm }: AutomationTableProps) {
  const { data: workflows, isLoading, error } = useGetWorkflows();

  // Filter workflows based on search term
  const filteredWorkflows =
    workflows?.filter((workflow) =>
      searchTerm
        ? workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.description?.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    ) || [];

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
                  Segment
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
                Segment
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
            {filteredWorkflows.length === 0 ? (
              <TableRow>
                <td
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchTerm
                    ? "No workflows match your search."
                    : "No workflows found. Create your first workflow to get started."}
                </td>
              </TableRow>
            ) : (
              filteredWorkflows.map((workflow) => (
                <AutomationTableRow key={workflow.id} workflow={workflow} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
