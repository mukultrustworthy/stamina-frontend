import { useState } from "react";
import { Search, ChevronDown, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewWorkflowDialog } from "./NewWorkflowDialog";

export function AutomationFilters() {
  const [isNewWorkflowDialogOpen, setIsNewWorkflowDialogOpen] = useState(false);
  return (
    <div className="flex items-center gap-3 px-8 py-4 justify-between">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <span>Last modified</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Last modified</DropdownMenuItem>
            <DropdownMenuItem>Date created</DropdownMenuItem>
            <DropdownMenuItem>Name</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>All statuses</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All statuses</DropdownMenuItem>
            <DropdownMenuItem>Active</DropdownMenuItem>
            <DropdownMenuItem>Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>

        <Button
          className="gap-2"
          onClick={() => setIsNewWorkflowDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>

      <NewWorkflowDialog
        open={isNewWorkflowDialogOpen}
        onOpenChange={setIsNewWorkflowDialogOpen}
      />
    </div>
  );
}
