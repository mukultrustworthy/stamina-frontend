import { QueryProvider } from "./providers/QueryProvider";
import { AppRouter } from "./router/AppRouter";
import { ThemeProvider } from "./components/ThemeProvider";
import "./App.css";

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppRouter />
      </ThemeProvider>
    </QueryProvider>
  );
}
