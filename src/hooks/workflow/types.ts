import React from "react";

export interface BaseNodeData {
  title: string;
  description: string;
  icon: React.ReactNode;
  onDelete?: (nodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  canDelete?: boolean;
  parentId?: string;
  childId?: string;
  emailSubject?: string;
  emailTemplate?: string;
  propertyName?: string;
  propertyValue?: string;
  registryKey?: string;
  configuration?: Record<string, unknown>;
}

export type NodeData = BaseNodeData & Record<string, unknown>;

export interface NodeRelation {
  parentId?: string;
  childId?: string;
}

export type ActionType =
  | "send-email"
  | "create-task"
  | "update-lead-status"
  | "http-request"
  | "ai-generate-text"
  | "database-query"
  | "transform-data";

export type TriggerCategory =
  | "webhook"
  | "database"
  | "schedule"
  | "email"
  | "external"
  | "manual";

export interface TriggerNodeData {
  title: string;
  description: string;
  icon: React.ReactNode;
  registryKey?: string;
}

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
