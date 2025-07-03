import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { startMockServiceWorker } from "./mocks/browser";

// Start mock service worker and then render the app
async function startApp() {
  await startMockServiceWorker();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

startApp();
