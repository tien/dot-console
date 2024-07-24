import { Button, Heading, Progress } from "../components/ui";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
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
          alignItems: "center",
          gap: "1rem",
          padding: "1rem 2rem",
          borderBottom: "1px solid currentcolor",
        })}
      >
        <Heading as="h1" size="2xl">
          📟 ĐÓTConsole
        </Heading>
        <nav
          className={css({
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          })}
        >
          <Button variant="ghost" asChild>
            <Link
              to="/query"
              activeProps={{ className: css({ color: "accent.default" }) }}
            >
              Query
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link
              to="/extrinsic"
              activeProps={{ className: css({ color: "accent.default" }) }}
            >
              Extrinsic
            </Link>
          </Button>
        </nav>
        <dc-connection-button />
      </header>
      <main className={css({ display: "contents" })}>
        <Suspense fallback={<Progress type="circular" value={null} />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
