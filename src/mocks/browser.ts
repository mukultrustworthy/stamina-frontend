import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Setup the service worker with our handlers
export const worker = setupWorker(...handlers);

// Start the worker only in development
export const startMockServiceWorker = async () => {
  if (import.meta.env.DEV) {
    try {
      await worker.start({
        onUnhandledRequest: "bypass",
      });
      console.log("🎭 Mock Service Worker started");
    } catch (error) {
      console.error("Failed to start Mock Service Worker:", error);
    }
  }
};
