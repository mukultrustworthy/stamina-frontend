import { AutomationHeader } from "./AutomationHeader";
import { AutomationFilters } from "./AutomationFilters";
import { AutomationTable } from "./AutomationTable";

interface AutomationContentProps {
  className?: string;
}

export function AutomationContent({ className }: AutomationContentProps) {
  return (
    <main
      className={`flex-1 overflow-hidden ${className} border m-1 rounded-xl`}
    >
      <AutomationHeader />

      <AutomationFilters />

      <AutomationTable />
    </main>
  );
}
