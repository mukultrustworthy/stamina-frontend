import { SendToBack } from "lucide-react";

export function AutomationHeader() {
  return (
    <header className="border-b bg-background px-8 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SendToBack className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Automation</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
