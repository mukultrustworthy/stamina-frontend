import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { toast } from "sonner";

export const worker = setupWorker(...handlers);

export const startMockServiceWorker = async () => {
  const shouldEnableMocks =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === "true";

  if (shouldEnableMocks) {
    try {
      await worker.start({
        onUnhandledRequest: "bypass",
        quiet: !import.meta.env.DEV,
      });

      if (!import.meta.env.DEV) {
        toast.success("🔄 Mock Service Worker enabled for this environment");
      }
    } catch (error) {
      toast.error("Failed to start Mock Service Worker");
      console.error("Failed to start Mock Service Worker:", error);
    }
  }
};
