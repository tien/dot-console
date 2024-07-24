import { Heading, Progress } from "../components/ui";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { css } from "styled-system/css";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
      })}
    >
      <header
        className={css({
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem 2rem",
          borderBottom: "1px solid currentcolor",
        })}
      >
        <Heading as="h1" size="2xl">
          📟 ĐÓTConsole
        </Heading>
        <dc-connection-button />
      </header>
      <main
        className={css({
          flex: "1 1 0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          "@media(min-width: 68rem)": {
            flexDirection: "row",
          },
        })}
      >
        <Suspense fallback={<Progress type="circular" value={null} />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
