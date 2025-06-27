import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AutomationTableRow } from "./AutomationTableRow";

interface AutomationFlow {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  createdOn: string;
  automationStarted: number;
  opened: string;
  clicked: string;
}

interface AutomationTableProps {
  flows: AutomationFlow[];
}

export function AutomationTable({ flows }: AutomationTableProps) {
  return (
    <div className="px-8">
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="border-b">
              <TableHead className="font-medium text-muted-foreground pl-6">
                Broadcast Name
              </TableHead>
              <TableHead className="font-medium text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="font-medium text-muted-foreground">
                Created On
              </TableHead>
              <TableHead className="font-medium text-muted-foreground">
                Automation Started
              </TableHead>
              <TableHead className="font-medium text-muted-foreground">
                Opened
              </TableHead>
              <TableHead className="font-medium text-muted-foreground">
                Clicked
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flows.map((flow) => (
              <AutomationTableRow key={flow.id} flow={flow} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
