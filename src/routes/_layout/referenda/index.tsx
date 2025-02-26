import { createFileRoute } from "@tanstack/react-router";
import { ActiveReferenda } from "~/features/governance/components/active-referenda";

export const Route = createFileRoute("/_layout/referenda/")({
  component: ReferendaPage,
});

function ReferendaPage() {
  return <ActiveReferenda />;
}
