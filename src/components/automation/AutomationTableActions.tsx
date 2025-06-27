import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AutomationTableActions() {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:border-blue-500 border border-transparent hover:text-blue-500 cursor-pointer"
      >
        <Edit3 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:border-red-500 border border-transparent hover:text-red-500 cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
