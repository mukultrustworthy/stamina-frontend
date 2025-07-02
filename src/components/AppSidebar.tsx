import { useState } from "react";
import {
  Search,
  ChevronDown,
  Settings,
  Bell,
  Users,
  Radio,
  Workflow,
  Mail,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

interface SidebarSection {
  title: string;
  children: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Sales engagement",
    children: [],
  },
  {
    title: "Marketing",
    children: [
      { title: "Audience", icon: Users },
      { title: "Broadcast", icon: Radio },
      { title: "Automation", icon: Workflow, active: true },
      { title: "Email Templates", icon: Mail },
    ],
  },
  {
    title: "CRM",
    children: [],
  },
  {
    title: "Sales enablement",
    children: [],
  },
  {
    title: "Hire",
    children: [],
  },
];

// Component for sidebar section with proper props interface
interface SidebarSectionProps {
  section: SidebarSection;
  isExpanded: boolean;
  onToggle: () => void;
}

function SidebarSection({
  section,
  isExpanded,
  onToggle,
}: SidebarSectionProps) {
  const hasChildren = section.children.length > 0;

  return (
    <div className="mb-1">
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={hasChildren ? onToggle : undefined}
          className={cn(
            "w-full justify-between text-sm font-medium text-gray-700 hover:bg-gray-50 h-8 px-3",
            hasChildren && "cursor-pointer",
            !hasChildren && "cursor-default"
          )}
        >
          {section.title}
          {hasChildren && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200 text-gray-400",
                isExpanded && "rotate-180"
              )}
            />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>

      {hasChildren && isExpanded && (
        <div className="ml-3 mt-1 space-y-0">
          {section.children.map((item, itemIndex) => {
            const IconComponent = item.icon;
            return (
              <SidebarMenuItem key={itemIndex}>
                <SidebarMenuButton
                  className={cn(
                    "w-full justify-start text-sm h-8 px-3 rounded-md",
                    item.active
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AppSidebar() {
  const { open } = useSidebar();
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([1]) // Marketing section expanded by default
  );
  const [agencyMode, setAgencyMode] = useState(false);

  const toggleSection = (index: number) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(index)) {
      newExpandedSections.delete(index);
    } else {
      newExpandedSections.add(index);
    }
    setExpandedSections(newExpandedSections);
  };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      side="left"
      className="border-r border-gray-200"
    >
      <SidebarHeader className="p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white font-bold text-sm">
            S
          </div>
          {open && (
            <span className="font-semibold text-lg text-gray-900">Stamina</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-10 pr-12 h-9 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-500 focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-500">
              ⌘K
            </kbd>
          </div>
        </div>

        <SidebarMenu className="space-y-1">
          {sidebarSections.map((section, index) => (
            <SidebarSection
              key={index}
              section={section}
              isExpanded={expandedSections.has(index)}
              onToggle={() => toggleSection(index)}
            />
          ))}
        </SidebarMenu>

        <div className="mt-auto pt-6">
          <div className="rounded-lg bg-gray-50 p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                Agency Mode
              </span>
              <Switch
                checked={agencyMode}
                onCheckedChange={setAgencyMode}
                className="data-[state=checked]:bg-gray-900"
              />
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md"
          >
            <Bell className="h-4 w-4 text-gray-600" />
          </Button>
          <span className="text-sm font-medium text-gray-900">
            Notifications
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md"
          >
            <Settings className="h-4 w-4 text-gray-600" />
          </Button>
          <span className="text-sm font-medium text-gray-900">Settings</span>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
              BS
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-900 truncate">
              Brooklyn Simmons
            </span>
            <span className="text-xs text-gray-500 truncate">
              brooklyn@stamina.ai
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
