import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AutomationPage } from "../pages/AutomationPage";
import { WorkflowEditorPage } from "../pages/WorkflowEditorPage";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AutomationPage />,
  },
  {
    path: "/workflow/:slug",
    element: <WorkflowEditorPage />,
  },
]);

export function AppRouter() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <RouterProvider router={router} />
    </SidebarProvider>
  );
}
