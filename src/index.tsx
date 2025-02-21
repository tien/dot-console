// sort-imports-ignore
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { scan } from "react-scan";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { css } from "styled-system/css";
import { Center } from "styled-system/jsx";
import { CircularProgressIndicator } from "./components/circular-progress-indicator";

scan({
  enabled: process.env["NODE_ENV"] === "development",
});

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <Center className={css({ flex: 1 })}>
      <CircularProgressIndicator size="xl" label="Loading" />
    </Center>
  ),
});

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
