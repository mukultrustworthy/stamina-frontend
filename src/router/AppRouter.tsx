import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { UsersPage } from "../pages/UsersPage";
import { DashboardPage } from "../pages/DashboardPage";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
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
]);

export function AppRouter() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <RouterProvider router={router} />
    </SidebarProvider>
  );
}
