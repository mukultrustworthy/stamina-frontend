import React from "react";
import {
  Users,
  Mail,
  Database,
  Webhook,
  Clock,
  Link,
  User,
} from "lucide-react";
import type { TriggerCategory } from "@/types/workflow";

/**
 * Get the appropriate icon for a trigger category
 */
export function getTriggerIcon(category: TriggerCategory): React.ReactNode {
  switch (category) {
    case "webhook":
      return <Webhook className="w-5 h-5" />;
    case "database":
      return <Database className="w-5 h-5" />;
    case "schedule":
      return <Clock className="w-5 h-5" />;
    case "email":
      return <Mail className="w-5 h-5" />;
    case "external":
      return <Link className="w-5 h-5" />;
    case "manual":
      return <User className="w-5 h-5" />;
    default:
      return <Users className="w-5 h-5" />;
  }
}
