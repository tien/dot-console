import { createFileRoute } from "@tanstack/react-router";
import { RouteTabs } from "~/components/route-tabs";
import { useCollectivesChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/collectives/_layout")({
  component: CollectivesPage,
});

function CollectivesPage() {
  if (useCollectivesChainId(false) === undefined) {
    return null;
  }

  return (
    <RouteTabs>
      <RouteTabs.Item to="/collectives/fellowship" label="Fellowship" />
      <RouteTabs.Item to="/collectives/ambassador" label="Ambassador" />
    </RouteTabs>
  );
}
