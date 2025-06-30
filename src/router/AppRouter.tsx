import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { UsersPage } from "../pages/UsersPage";
import { AutomationPage } from "../pages/AutomationPage";
import WorkflowEditorPage from "../pages/WorkflowEditorPage";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/automation",
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
