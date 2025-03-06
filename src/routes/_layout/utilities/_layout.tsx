import { createFileRoute } from "@tanstack/react-router";
import { RouteTabs } from "~/components/route-tabs";

export const Route = createFileRoute("/_layout/utilities/_layout")({
  component: UtilitiesPage,
});

function UtilitiesPage() {
  return (
    <RouteTabs>
      <RouteTabs.Item
        to="/utilities/planck-convertor"
        label="Planck convertor"
      />
    </RouteTabs>
  );
}
