import { createFileRoute } from "@tanstack/react-router";
import { ConcludedReferenda } from "~/features/governance/components/concluded-referenda";

export const Route = createFileRoute("/_layout/referenda/_layout/concluded")({
  component: ConcludedReferendaPage,
});

function ConcludedReferendaPage() {
  return <ConcludedReferenda />;
}
