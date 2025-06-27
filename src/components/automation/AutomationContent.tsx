import { AutomationHeader } from "./AutomationHeader";
import { AutomationFilters } from "./AutomationFilters";
import { AutomationTable } from "./AutomationTable";

interface AutomationFlow {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  createdOn: string;
  automationStarted: number;
  opened: string;
  clicked: string;
}

interface AutomationContentProps {
  className?: string;
}

const automationFlows: AutomationFlow[] = [
  {
    id: "1",
    name: "Welcome Flow",
    status: "Active",
    createdOn: "24 May, 2025",
    automationStarted: 291,
    opened: "22% | 5",
    clicked: "5.4% | 1",
  },
  {
    id: "2",
    name: "Flow 2",
    status: "Active",
    createdOn: "12 May, 2025",
    automationStarted: 21,
    opened: "22% | 5",
    clicked: "5.4% | 1",
  },
  {
    id: "3",
    name: "Flow 3",
    status: "Active",
    createdOn: "1 May, 2025",
    automationStarted: 0,
    opened: "0",
    clicked: "0",
  },
];

export function AutomationContent({ className }: AutomationContentProps) {
  return (
    <main
      className={`flex-1 overflow-hidden ${className} border m-1 rounded-xl`}
    >
      <AutomationHeader />

      <AutomationFilters />

      <AutomationTable flows={automationFlows} />
    </main>
  );
}
