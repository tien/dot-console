// sort-imports-ignore
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { scan } from "react-scan";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

scan({
  enabled: process.env["NODE_ENV"] === "development",
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
