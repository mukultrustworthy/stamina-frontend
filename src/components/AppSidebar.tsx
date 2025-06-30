import { useState } from "react";
import { Search, ChevronDown, Settings, Bell } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  icon: string;
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
      { title: "Audience", icon: "👥" },
      { title: "Broadcast", icon: "📢" },
      { title: "Automation", icon: "⚙️", active: true },
      { title: "Email Templates", icon: "📧" },
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
    <div className="mb-4">
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={hasChildren ? onToggle : undefined}
          className={cn(
            "w-full justify-between text-sm font-medium text-gray-600 hover:bg-gray-50",
            hasChildren && "cursor-pointer"
          )}
        >
          {section.title}
          {hasChildren && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>

      {hasChildren && isExpanded && (
        <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
          {section.children.map((item, itemIndex) => (
            <SidebarMenuItem key={itemIndex}>
              <SidebarMenuButton
                className={cn(
                  "w-full justify-start text-sm",
                  item.active
                    ? "bg-muted text-muted-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.title}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
    <Sidebar variant="sidebar" collapsible="icon" side="left" className="pl-2">
      <SidebarHeader className="p-4 flex flex-row justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
            S
          </div>
          {open && <span className="font-semibold text-lg">Stamina</span>}
        </div>
        {open && <SidebarTrigger />}
      </SidebarHeader>

      <SidebarContent>
        <div className="px-2 py-2">
          <div className="relative mb-4 border rounded-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-10 bg-muted border-0 text-sm"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>

          <SidebarMenu>
            {sidebarSections.map((section, index) => (
              <SidebarSection
                key={index}
                section={section}
                isExpanded={expandedSections.has(index)}
                onToggle={() => toggleSection(index)}
              />
            ))}
          </SidebarMenu>
        </div>

        <div className="mt-auto px-3 py-2 border-t">
          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Agency Mode</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Brooklyn Simmons</span>
            <span className="text-xs text-muted-foreground">
              brooklyn@stamina.ai
            </span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
