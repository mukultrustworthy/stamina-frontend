import { type Node } from "@xyflow/react";
import {
  Users,
  Mail,
  Settings,
  Database,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import type {
  NodeData,
  NodeRelation,
  ActionType,
  ActionNodeData,
} from "./types";

// Layout constants
export const NODE_VERTICAL_SPACING = 180;
export const NODE_HORIZONTAL_SPACING = 0;

// Default node IDs
export const DEFAULT_TRIGGER_ID = "trigger-1";
export const DEFAULT_ACTION_ID = "action-1";

// Default registry keys
export const DEFAULT_TRIGGER_REGISTRY_KEY = "lead_created";
export const DEFAULT_ACTION_REGISTRY_KEY = "send_email";

// Node positioning
export const DEFAULT_NODE_POSITION = { x: 0, y: 0 };
export const DEFAULT_ACTION_POSITION = { x: 0, y: 255 };

// Action type data configuration
export const actionTypeData: Record<ActionType, ActionNodeData> = {
  "send-email": {
    title: "Send Email",
    description: "Send an email to the person",
    icon: <Mail className="w-5 h-5" />,
    registryKey: "send_email",
    emailSubject: "Welcome Email",
    emailTemplate:
      "Hello! Welcome to our platform. We're excited to have you on board.",
  },
  "create-task": {
    title: "Create Task",
    description: "Create a follow-up task",
    icon: <CheckCircle className="w-5 h-5" />,
    registryKey: "create_task",
  },
  "update-lead-status": {
    title: "Update Lead Status",
    description: "Update lead status and properties",
    icon: <Users className="w-5 h-5" />,
    registryKey: "update_lead_status",
  },
  "http-request": {
    title: "HTTP Request",
    description: "Make HTTP requests to external APIs",
    icon: <Settings className="w-5 h-5" />,
    registryKey: "http_request",
  },
  "ai-generate-text": {
    title: "AI Generate Text",
    description: "Generate text using AI models",
    icon: <Sparkles className="w-5 h-5" />,
    registryKey: "ai_generate_text",
  },
  "database-query": {
    title: "Database Query",
    description: "Execute database queries and operations",
    icon: <Database className="w-5 h-5" />,
    registryKey: "database_query",
  },
  "transform-data": {
    title: "Transform Data",
    description: "Transform and manipulate data",
    icon: <Settings className="w-5 h-5" />,
    registryKey: "transform_data",
  },
};

// Default initial node relations
export const DEFAULT_NODE_RELATIONS: Record<string, NodeRelation> = {
  [DEFAULT_TRIGGER_ID]: { childId: DEFAULT_ACTION_ID },
  [DEFAULT_ACTION_ID]: { parentId: DEFAULT_TRIGGER_ID },
};

// Default initial nodes configuration
export const DEFAULT_INITIAL_NODES: Node<NodeData>[] = [
  {
    id: DEFAULT_TRIGGER_ID,
    type: "trigger",
    position: DEFAULT_NODE_POSITION,
    draggable: false,
    selected: true,
    data: {
      title: "New Audience",
      description: "Fires when a new person is added to the audience list",
      icon: <Users className="w-5 h-5" />,
      canDelete: false,
      childId: DEFAULT_ACTION_ID,
      registryKey: DEFAULT_TRIGGER_REGISTRY_KEY,
    },
  },
  {
    id: DEFAULT_ACTION_ID,
    type: "action",
    position: DEFAULT_ACTION_POSITION,
    draggable: false,
    data: {
      title: "Send Welcome Email",
      description: "Send a welcome email to the new audience member",
      icon: <Mail className="w-5 h-5" />,
      canDelete: true,
      parentId: DEFAULT_TRIGGER_ID,
      emailSubject: "Welcome to our platform!",
      emailTemplate:
        "Hi there! Welcome to our platform. We're excited to have you on board.",
      registryKey: DEFAULT_ACTION_REGISTRY_KEY,
    },
  },
];

// Default fallback values
export const DEFAULT_EMAIL_SUBJECT = "Welcome Email";
export const DEFAULT_EMAIL_TEMPLATE =
  "Hello! Welcome to our platform. We're excited to have you on board.";

// Auto-edit delay
export const AUTO_EDIT_DELAY = 0;
