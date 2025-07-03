import React from "react";

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
