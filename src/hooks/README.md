# 🪝 Hooks Documentation

This directory contains all custom React hooks used throughout the application. The hooks are organized by feature and functionality to provide clean separation of concerns and reusability.

## 📁 Directory Structure

```
src/hooks/
├── README.md                    # This documentation file
├── useMobile.ts                 # Mobile device detection
├── useWorkflowEditor.tsx        # Main workflow editor orchestration
├── automation/
│   └── useAutomationFilters.ts  # Automation filtering and sorting
├── queries/
│   └── useWorkflowQueries.ts    # API queries and mutations
└── workflow/
    ├── index.ts                 # Workflow hooks exports
    ├── constants.tsx            # Workflow constants and configurations
    ├── types.ts                 # TypeScript type definitions
    ├── useDialogManager.ts      # Dialog state management
    ├── useNodeOperations.ts     # Node CRUD operations
    ├── useWorkflowActions.ts    # Workflow action handlers
    └── useWorkflowState.ts      # Core workflow state management
```

## 📱 General Purpose Hooks

### `useMobile` - Mobile Device Detection

Detects whether the user is on a mobile device based on screen width.

```typescript
import { useIsMobile } from "@/hooks/useMobile";

function MyComponent() {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "mobile-layout" : "desktop-layout"}>
      {/* Responsive content */}
    </div>
  );
}
```

**Features:**

- Uses a breakpoint of 768px (mobile < 768px)
- Listens to window resize events for real-time updates
- Returns `boolean` indicating mobile state
- Handles SSR by returning `false` initially

---

## 🔄 Workflow Management Hooks

### `useWorkflowEditor` - Main Workflow Editor Orchestration

The primary hook that orchestrates the entire workflow editor functionality by combining multiple specialized hooks.

```typescript
import { useWorkflowEditor } from "@/hooks/useWorkflowEditor";

function WorkflowEditor() {
  const {
    // State
    workflowName,
    nodes,
    onNodesChange,
    editingNodeId,
    isSelectionOpen,
    isTriggerDialogOpen,
    isActionDialogOpen,

    // Actions
    handleEditNode,
    handleSaveNodeEdit,
    handleTriggerChange,
    handleActionSelection,
    handleInsertAction,
    handleAddAction,
    handleInsertAfter,
    deleteNode,
    openTriggerSelection,
    openActionSelection,
    closeSelection,
  } = useWorkflowEditor("My Workflow");

  return <div>{/* Workflow editor UI */}</div>;
}
```

**Combines:**

- `useWorkflowState` - Core workflow state
- `useDialogState` - Dialog management
- `useNodeOperations` - Node operations

### `useWorkflowState` - Core Workflow State Management

Manages the fundamental workflow state including nodes and workflow metadata.

```typescript
import { useWorkflowState } from "@/hooks/workflow/useWorkflowState";

function WorkflowContainer() {
  const {
    workflowName,
    setWorkflowName,
    nodes,
    setNodes,
    onNodesChange, // For React Flow integration
  } = useWorkflowState("Initial Workflow Name");
}
```

**Features:**

- Integrates with React Flow's `useNodesState`
- Manages workflow metadata (name, etc.)
- Provides default initial nodes configuration
- Handles node state updates

### `useDialogManager` - Dialog State Management

Centralized management for all dialog states in the workflow editor.

```typescript
import { useDialogState } from "@/hooks/workflow/useDialogManager";

function WorkflowDialogs() {
  const {
    isSelectionOpen,
    isTriggerDialogOpen,
    isActionDialogOpen,
    openTriggerSelection,
    openActionSelection,
    closeSelection,
    isEditOpen,
    editingNodeId,
    openEdit,
    closeEdit,
  } = useDialogState();
}
```

**Dialog Types:**

- **Selection Dialog** - Choosing triggers/actions
- **Edit Dialog** - Editing node properties
- **Trigger Dialog** - Specifically for trigger selection
- **Action Dialog** - Specifically for action selection

### `useNodeOperations` - Node CRUD Operations

Provides comprehensive node manipulation functionality with proper relationship management.

```typescript
import { useNodeOperations } from "@/hooks/workflow/useNodeOperations";

function NodeManager({ nodes, setNodes }) {
  const { updateNode, deleteNode, addActionNode, insertActionAfter } =
    useNodeOperations({ nodes, setNodes });

  // Update node properties
  const handleUpdate = () => {
    updateNode("node-1", {
      title: "New Title",
      emailSubject: "Updated Subject",
    });
  };

  // Add action to end of workflow
  const handleAddAction = () => {
    addActionNode("send-email");
  };

  // Insert action after specific node
  const handleInsertAction = () => {
    insertActionAfter("trigger-1", "create-task");
  };

  // Delete a node (maintains workflow integrity)
  const handleDelete = () => {
    deleteNode("action-2");
  };
}
```

**Features:**

- **Smart Positioning** - Automatically calculates node positions
- **Relationship Management** - Maintains parent-child relationships
- **Gap Filling** - Repositions nodes when deleting to fill gaps
- **Insertion Logic** - Handles inserting nodes at any position
- **Validation** - Prevents deletion of non-deletable nodes

### `useWorkflowActions` - Workflow Action Handlers

Handles high-level workflow actions like saving and campaign execution.

```typescript
import { useWorkflowActions } from "@/hooks/workflow/useWorkflowActions";

function WorkflowToolbar() {
  const { handleSave, handleStartCampaign } = useWorkflowActions();

  return (
    <div>
      <button onClick={handleSave}>Save Workflow</button>
      <button onClick={handleStartCampaign}>Start Campaign</button>
    </div>
  );
}
```

**Actions:**

- `handleSave` - Saves workflow (shows success toast)
- `handleStartCampaign` - Starts campaign execution (shows success toast)

> **Note:** Currently contains placeholder implementations with TODO comments for actual API integration.

---

## 🔍 Query Hooks (React Query Integration)

### `useWorkflowQueries` - API Queries and Mutations

Comprehensive React Query hooks for all workflow-related API operations.

#### Query Hooks

```typescript
import {
  useGetWorkflows,
  useGetWorkflow,
  useGetActions,
  useGetTriggers,
  useGetActionsByCategory,
  useGetTriggersByCategory,
} from "@/hooks/queries/useWorkflowQueries";

function WorkflowData() {
  // Get all workflows
  const { data: workflows, isLoading } = useGetWorkflows();

  // Get specific workflow
  const { data: workflow } = useGetWorkflow("workflow-id");

  // Get available actions
  const { data: actions } = useGetActions(true); // active only

  // Get actions by category
  const { data: emailActions } = useGetActionsByCategory("email");

  // Get available triggers
  const { data: triggers } = useGetTriggers();

  // Get triggers by category
  const { data: webhookTriggers } = useGetTriggersByCategory("webhook");
}
```

#### Mutation Hooks

```typescript
import {
  useCreateWorkflow,
  useUpdateWorkflow,
  useDeleteWorkflow,
  useExecuteWorkflow,
} from "@/hooks/queries/useWorkflowQueries";

function WorkflowActions() {
  const createWorkflow = useCreateWorkflow((workflow) => {
    console.log("Created:", workflow);
  });

  const updateWorkflow = useUpdateWorkflow();

  const deleteWorkflow = useDeleteWorkflow(() => {
    // Navigate away after deletion
  });

  const executeWorkflow = useExecuteWorkflow();

  const handleCreate = () => {
    createWorkflow.mutate({
      name: "New Workflow",
      description: "A new workflow",
      isActive: true,
    });
  };

  const handleUpdate = () => {
    updateWorkflow.mutate({
      id: "workflow-id",
      updates: { name: "Updated Name" },
    });
  };

  const handleDelete = () => {
    deleteWorkflow.mutate("workflow-id");
  };

  const handleExecute = () => {
    executeWorkflow.mutate({
      id: "workflow-id",
      execution: { data: {} },
    });
  };
}
```

**Features:**

- **Automatic Caching** - Smart query key management
- **Optimistic Updates** - Immediate UI feedback
- **Error Handling** - Automatic toast notifications
- **Cache Invalidation** - Proper cache updates after mutations
- **Success Callbacks** - Optional success handlers
- **Loading States** - Built-in loading indicators

**Query Keys Structure:**

```typescript
// Workflows
["workflows"][("workflows", "list")][("workflows", "list", { filters })][ // All workflows // Workflow lists // Filtered lists
  ("workflows", "detail", id)
][ // Specific workflow
  // Actions
  "workflow-actions"
][("workflow-actions", "list", { category })][ // All actions // Filtered actions
  // Triggers
  "workflow-triggers"
][("workflow-triggers", "list", { category })]; // All triggers // Filtered triggers
```

---

## 🎯 Automation Hooks

### `useAutomationFilters` - Automation Filtering and Sorting

Zustand-based state management for automation list filtering, sorting, and searching.

```typescript
import { useAutomationFilters } from "@/hooks/automation/useAutomationFilters";

function AutomationList() {
  const {
    // Current filter state
    sortBy,
    status,
    search,

    // Actions
    updateFilter,
    resetFilters,
    setSearchQuery,

    // Computed values
    getCurrentSortLabel,
    getCurrentStatusLabel,
    getProcessedWorkflows,
    getEmptyStateMessage,
  } = useAutomationFilters();

  const { data: workflows } = useGetWorkflows();
  const processedWorkflows = getProcessedWorkflows(workflows);

  return (
    <div>
      {/* Search input */}
      <input
        value={search}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search workflows..."
      />

      {/* Sort dropdown */}
      <select
        value={sortBy}
        onChange={(e) => updateFilter("sortBy", e.target.value)}
      >
        <option value="date-created">Date Created</option>
        <option value="name">Name</option>
        <option value="status">Status</option>
      </select>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => updateFilter("status", e.target.value)}
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* Results */}
      {processedWorkflows.length === 0 ? (
        <p>{getEmptyStateMessage()}</p>
      ) : (
        processedWorkflows.map((workflow) => (
          <div key={workflow.id}>{workflow.name}</div>
        ))
      )}
    </div>
  );
}
```

**Filter Options:**

- **Sort By:** Date Created, Name, Status
- **Status:** All, Active, Inactive
- **Search:** Text search across name and description

**Features:**

- **Zustand Store** - Persistent state management
- **DevTools Integration** - Redux DevTools support
- **Computed Processing** - Automatic filtering, sorting, and searching
- **Smart Empty States** - Context-aware empty state messages
- **Real-time Updates** - Immediate UI feedback

---

## 🏗️ Architecture Patterns

### Hook Composition

The workflow editor demonstrates excellent hook composition patterns:

```typescript
// ✅ Good: Single responsibility hooks
const useWorkflowState = () => {
  /* state only */
};
const useDialogManager = () => {
  /* dialogs only */
};
const useNodeOperations = () => {
  /* node operations only */
};

// ✅ Good: Orchestration hook combining focused hooks
const useWorkflowEditor = () => {
  const workflowState = useWorkflowState();
  const dialogs = useDialogManager();
  const nodeOps = useNodeOperations();

  // Coordinate between them
  return { ...workflowState, ...dialogs, ...nodeOps };
};
```

### State Management Layers

1. **Local State** - `useState` for component-specific state
2. **Shared State** - Zustand for cross-component state (filters)
3. **Server State** - React Query for API data
4. **Flow State** - React Flow's built-in state management

### Error Handling

All mutation hooks follow consistent error handling patterns:

```typescript
const useSomeMutation = () => {
  return useMutation({
    mutationFn: apiCall,
    onSuccess: (data) => {
      // Invalidate queries
      // Show success toast
      // Call success callback
    },
    onError: (error) => {
      // Extract error message
      // Show error toast
      // Handle specific error cases
    },
  });
};
```

## 🧪 Testing Considerations

When testing components that use these hooks, consider:

### Mocking React Query

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
```

### Mocking Zustand Stores

```typescript
import { useAutomationFilters } from "@/hooks/automation/useAutomationFilters";

// Reset store before each test
beforeEach(() => {
  useAutomationFilters.getState().resetFilters();
});
```

### Testing Custom Hooks

```typescript
import { renderHook, act } from "@testing-library/react";
import { useWorkflowState } from "@/hooks/workflow/useWorkflowState";

test("workflow state management", () => {
  const { result } = renderHook(() => useWorkflowState("Test Workflow"));

  expect(result.current.workflowName).toBe("Test Workflow");

  act(() => {
    result.current.setWorkflowName("Updated Workflow");
  });

  expect(result.current.workflowName).toBe("Updated Workflow");
});
```

## 📋 Best Practices

1. **Single Responsibility** - Each hook has one clear purpose
2. **Composition Over Inheritance** - Combine smaller hooks into larger ones
3. **Consistent APIs** - Similar patterns across all hooks
4. **Type Safety** - Full TypeScript coverage
5. **Error Boundaries** - Proper error handling and user feedback
6. **Performance** - Memoization and optimization where needed
7. **Testing** - Comprehensive test coverage for hook logic

## 🔧 Development Guidelines

When adding new hooks:

1. **Place in appropriate directory** based on functionality
2. **Follow naming conventions** (`useFeatureName`)
3. **Export from index files** for clean imports
4. **Add TypeScript types** for all parameters and returns
5. **Include JSDoc comments** for complex hooks
6. **Add to this README** with examples
7. **Write tests** for hook functionality

---

This documentation covers all hooks in the application. Each hook is designed with specific responsibilities and can be composed together to build complex functionality while maintaining clean separation of concerns.
