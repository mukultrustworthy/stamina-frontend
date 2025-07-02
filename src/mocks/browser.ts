import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Setup the service worker with our handlers
export const worker = setupWorker(...handlers);

// Start the worker based on environment configuration
export const startMockServiceWorker = async () => {
  // Option 1: Environment-controlled (recommended)
  const shouldEnableMocks =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === "true";

  // Option 2: Always enable mocks (uncomment the line below for demo purposes)
  // const shouldEnableMocks = true;

  if (shouldEnableMocks) {
    try {
      await worker.start({
        onUnhandledRequest: "bypass",
        // Only show console warnings in development
        quiet: !import.meta.env.DEV,
      });

      if (!import.meta.env.DEV) {
        console.log("🔄 Mock Service Worker enabled for this environment");
      }
    } catch (error) {
      console.error("Failed to start Mock Service Worker:", error);
    }
  }
};
