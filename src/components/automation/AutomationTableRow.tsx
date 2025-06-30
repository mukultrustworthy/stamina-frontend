import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { AutomationTableActions } from "./AutomationTableActions";
import { useNavigate } from "react-router-dom";
import type { WorkflowResponse } from "@/types/workflow";

interface AutomationTableRowProps {
  workflow: WorkflowResponse;
}

export function AutomationTableRow({ workflow }: AutomationTableRowProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TableRow
      className="hover:bg-muted cursor-pointer"
      onClick={() => navigate(`/workflow/${workflow.id}`)}
    >
      <TableCell className="font-medium pl-6">
        <div>
          <div className="font-medium">{workflow.name}</div>
          {workflow.description && (
            <div className="text-sm text-muted-foreground mt-1">
              {workflow.description}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className={
            workflow.isActive
              ? "bg-green-100 text-green-800 hover:bg-green-100 border border-green-500"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100 border border-gray-300"
          }
        >
          <div
            className={`w-2 h-2 rounded-full ${
              workflow.isActive ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {workflow.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        <Badge variant="outline" className="font-mono">
          {workflow.segment}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(workflow.createdAt)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        v{workflow.latestVersion}
      </TableCell>
      <TableCell>
        <AutomationTableActions workflowId={workflow.id} />
      </TableCell>
    </TableRow>
  );
}
