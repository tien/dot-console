import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { css } from "styled-system/css";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { Tabs } from "~/components/ui/tabs";
import { useCollectivesChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/collectives/_layout")({
  component: CollectivesPage,
});

function CollectivesPage() {
  const location = useLocation();

  if (useCollectivesChainId(false) === undefined) {
    return null;
  }

  return (
    <div>
      <Tabs.Root
        value={location.pathname}
        className={css({ margin: "1rem 0 2rem 0" })}
      >
        <Tabs.List>
          <Tabs.Trigger value="/collectives/fellowship" asChild>
            <Link to="/collectives/fellowship">Fellowship</Link>
          </Tabs.Trigger>
          <Tabs.Trigger value="/collectives/ambassador" asChild>
            <Link to="/collectives/ambassador">Ambassador</Link>
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
      </Tabs.Root>
      <Outlet />
    </div>
  );
}
