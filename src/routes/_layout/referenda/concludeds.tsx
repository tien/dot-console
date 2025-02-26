import { createFileRoute } from "@tanstack/react-router";
import { ConcludedReferenda } from "~/features/governance/components/concluded-referenda";

export const Route = createFileRoute("/_layout/referenda/concludeds")({
  component: ConcludedReferendaPage,
});

function ConcludedReferendaPage() {
  return <ConcludedReferenda />;
}
