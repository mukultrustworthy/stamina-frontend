import { AutomationHeader } from "./AutomationHeader";
import { AutomationFilters } from "./AutomationFilters";
import { AutomationTable } from "./AutomationTable";
import { cn } from "@/lib/utils";

interface AutomationContentProps {
  className?: string;
}

export function AutomationContent({ className }: AutomationContentProps) {
  return (
    <main
      className={cn("flex-1 overflow-hidden border m-1 rounded-xl", className)}
    >
      <AutomationHeader />

      <AutomationFilters />

      <AutomationTable />
    </main>
  );
}
