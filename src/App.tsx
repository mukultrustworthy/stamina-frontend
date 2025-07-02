import { QueryProvider } from "./providers/QueryProvider";
import { AppRouter } from "./router/AppRouter";
import { ThemeProvider } from "./components/ThemeProvider";
import "./App.css";
import { Toaster } from "sonner";

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppRouter />
        <Toaster position="top-center" richColors />
      </ThemeProvider>
    </QueryProvider>
  );
}
