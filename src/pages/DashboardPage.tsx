import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AutomationContent } from "@/components/automation/AutomationContent";

export function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <AutomationContent />
      </div>
    </SidebarProvider>
  );
}
