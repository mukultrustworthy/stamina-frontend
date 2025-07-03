import { AutomationHeader } from "./AutomationHeader";
import { AutomationFilters } from "./AutomationFilters";
import { AutomationTable } from "./AutomationTable";

export function AutomationContent() {
  return (
    <main className="flex-1 overflow-hidden border m-1 rounded-xl">
      <AutomationHeader />
      <AutomationFilters />
      <AutomationTable />
    </main>
  );
}
