import { createFileRoute } from "@tanstack/react-router";
import { RouteTabs } from "~/components/route-tabs";

export const Route = createFileRoute("/_layout/staking/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteTabs marginBottom={0}>
      <RouteTabs.Item label="Validators" to="/staking/validators" />
      <RouteTabs.Item label="Nomination pools" to="/staking/nomination-pools" />
    </RouteTabs>
  );
}
