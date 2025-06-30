import React from "react";
import { Users, Mail, Settings } from "lucide-react";

// Specific node data properties
export interface BaseNodeData {
  title: string;
  description: string;
  icon: React.ReactNode;
  onDelete?: (nodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  canDelete?: boolean;
  parentId?: string;
  childId?: string; // Only one child per node
  emailSubject?: string;
  emailTemplate?: string;
  propertyName?: string;
  propertyValue?: string;
  // Registry information
  registryKey?: string;
}

// Intersection type for React Flow compatibility while maintaining type safety
export type NodeData = BaseNodeData & Record<string, unknown>;

export interface NodeRelation {
  parentId?: string;
  childId?: string; // Only one child per node
}

export type ActionType =
  | "send-email"
  | "create-task"
  | "update-lead-status"
  | "http-request"
  | "ai-generate-text"
  | "database-query"
  | "transform-data";

export interface ActionNodeData {
  title: string;
  description: string;
  icon: React.ReactNode;
  registryKey?: string;
  emailSubject?: string;
  emailTemplate?: string;
  propertyName?: string;
  propertyValue?: string;
}

export const actionTypeData: Record<ActionType, ActionNodeData> = {
  "send-email": {
    title: "Send Email",
    description: "Send an email to the person",
    icon: <Mail className="w-5 h-5 text-green-600" />,
    registryKey: "send_email",
    emailSubject: "Welcome Email",
    emailTemplate:
      "Hello! Welcome to our platform. We're excited to have you on board.",
  },
  "create-task": {
    title: "Create Task",
    description: "Create a follow-up task",
    icon: <Settings className="w-5 h-5 text-green-600" />,
    registryKey: "create_task",
  },
  "update-lead-status": {
    title: "Update Lead Status",
    description: "Update lead status and properties",
    icon: <Users className="w-5 h-5 text-green-600" />,
    registryKey: "update_lead_status",
  },
  "http-request": {
    title: "HTTP Request",
    description: "Make HTTP requests to external APIs",
    icon: <Settings className="w-5 h-5 text-blue-600" />,
    registryKey: "http_request",
  },
  "ai-generate-text": {
    title: "AI Generate Text",
    description: "Generate text using AI models",
    icon: <Mail className="w-5 h-5 text-purple-600" />,
    registryKey: "ai_generate_text",
  },
  "database-query": {
    title: "Database Query",
    description: "Execute database queries and operations",
    icon: <Settings className="w-5 h-5 text-green-600" />,
    registryKey: "database_query",
  },
  "transform-data": {
    title: "Transform Data",
    description: "Transform and manipulate data",
    icon: <Settings className="w-5 h-5 text-yellow-600" />,
    registryKey: "transform_data",
  },
};
