import { useState } from "react";
import { ChevronDown, Plus, Filter, SortAsc, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { NewWorkflowDialog } from "./workflow/NewWorkflowDialog";
import {
  useAutomationFilters,
  automationFilterOptions,
  automationStatusOptions,
} from "@/hooks/useAutomationFilters";
import { Badge } from "../ui/badge";

export function AutomationFilters() {
  const [isNewWorkflowDialogOpen, setIsNewWorkflowDialogOpen] = useState(false);
  const {
    search,
    updateFilter,
    getCurrentSortLabel,
    getCurrentStatusLabel,
    setSearchQuery,
    status,
  } = useAutomationFilters();

  return (
    <div className="flex items-center gap-3 px-8 py-4 justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={search}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 cursor-pointer w-40 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                <span className="text-sm">{getCurrentSortLabel()}</span>
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {automationFilterOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => updateFilter("sortBy", option.value)}
                className="cursor-pointer"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 cursor-pointer w-40 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm">{getCurrentStatusLabel()}</span>
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {automationStatusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => updateFilter("status", option.value)}
                className="cursor-pointer"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Filters Button */}
        {status !== "all" && (
          <Badge
            className="cursor-pointer flex items-center gap-2 capitalize px-3 py-0.5"
            onClick={() => updateFilter("status", "all")}
          >
            {status}
            <X className="h-4 w-4" />
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          className="gap-2 cursor-pointer"
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
