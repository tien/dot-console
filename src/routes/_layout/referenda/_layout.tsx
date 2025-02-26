import { createFileRoute } from "@tanstack/react-router";
import { RouteTabs } from "~/components/route-tabs";

export const Route = createFileRoute("/_layout/referenda/_layout")({
  component: ReferendaPage,
});

function ReferendaPage() {
  return (
    <RouteTabs>
      <RouteTabs.Item to="/referenda" label="Active" />
      <RouteTabs.Item to="/referenda/concluded" label="Concluded" />
    </RouteTabs>
  );
}
