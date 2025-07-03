import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { WorkflowResponse } from "@/types/workflow";

export interface FilterOption {
  label: string;
  value: string;
}

export interface AutomationFilters {
  sortBy: string;
  status: string;
  search: string;
}

interface AutomationFiltersStore extends AutomationFilters {
  updateFilter: (key: keyof AutomationFilters, value: string) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  getCurrentSortLabel: () => string;
  getCurrentStatusLabel: () => string;
  getProcessedWorkflows: (
    workflows: WorkflowResponse[] | undefined
  ) => WorkflowResponse[];
  getEmptyStateMessage: () => string;
}

const automationFilterOptions: FilterOption[] = [
  {
    label: "Date created",
    value: "date-created",
  },
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Status",
    value: "status",
  },
];

const automationStatusOptions: FilterOption[] = [
  {
    label: "All statuses",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

const initialFilters: AutomationFilters = {
  sortBy: "date-created",
  status: "all",
  search: "",
};

export const useAutomationFilters = create<AutomationFiltersStore>()(
  devtools(
    (set, get) => ({
      ...initialFilters,
      updateFilter: (key, value) => {
        set(
          (state) => ({
            ...state,
            [key]: value,
          }),
          undefined,
          `updateFilter/${key}`
        );
      },

      resetFilters: () => {
        set(() => initialFilters, undefined, "resetFilters");
      },

      setSearchQuery: (query) => {
        set(
          (state) => ({
            ...state,
            search: query,
          }),
          undefined,
          "setSearchQuery"
        );
      },

      getCurrentSortLabel: () => {
        const state = get();
        return (
          automationFilterOptions.find(
            (option) => option.value === state.sortBy
          )?.label || "Date created"
        );
      },

      getCurrentStatusLabel: () => {
        const state = get();
        return (
          automationStatusOptions.find(
            (option) => option.value === state.status
          )?.label || "All statuses"
        );
      },

      getProcessedWorkflows: (workflows) => {
        if (!workflows) return [];

        const { sortBy, status, search } = get();

        return workflows
          .filter((workflow) => {
            if (status === "all") return true;
            if (status === "active") return workflow.isActive;
            if (status === "inactive") return !workflow.isActive;
            return true;
          })
          .filter((workflow) => {
            if (!search) return true;
            const searchLower = search.toLowerCase();
            return (
              workflow.name.toLowerCase().includes(searchLower) ||
              workflow.description?.toLowerCase().includes(searchLower)
            );
          })
          .sort((a, b) => {
            switch (sortBy) {
              case "name":
                return a.name.localeCompare(b.name);
              case "status":
                if (a.isActive === b.isActive) {
                  return a.name.localeCompare(b.name);
                }
                return a.isActive ? -1 : 1;
              case "date-created":
              default:
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
            }
          });
      },

      getEmptyStateMessage: () => {
        const { search, status } = get();

        if (search && status !== "all") {
          return `No ${status} workflows match your search "${search}".`;
        }
        if (search) {
          return `No workflows match your search "${search}".`;
        }
        if (status === "active") {
          return "No active workflows found.";
        }
        if (status === "inactive") {
          return "No inactive workflows found.";
        }
        return "No workflows found. Create your first workflow to get started.";
      },
    }),
    {
      name: "automation-filters",
    }
  )
);

export { automationFilterOptions, automationStatusOptions };
