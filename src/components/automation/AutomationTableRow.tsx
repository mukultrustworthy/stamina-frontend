import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { AutomationTableActions } from "./AutomationTableActions";
import { useNavigate } from "react-router-dom";

interface AutomationFlow {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  createdOn: string;
  automationStarted: number;
  opened: string;
  clicked: string;
}

interface AutomationTableRowProps {
  flow: AutomationFlow;
}

export function AutomationTableRow({ flow }: AutomationTableRowProps) {
  const navigate = useNavigate();
  return (
    <TableRow
      className="hover:bg-muted cursor-pointer"
      onClick={() => navigate(`/workflow/${flow.name}`)}
    >
      <TableCell className="font-medium pl-6">{flow.name}</TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 hover:bg-green-100 border border-green-500"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          {flow.status}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{flow.createdOn}</TableCell>
      <TableCell className="text-muted-foreground">
        {flow.automationStarted}
      </TableCell>
      <TableCell className="text-muted-foreground">{flow.opened}</TableCell>
      <TableCell className="text-muted-foreground">{flow.clicked}</TableCell>
      <TableCell>
        <AutomationTableActions />
      </TableCell>
    </TableRow>
  );
}
