import { createFileRoute } from "@tanstack/react-router";
import { ReferendaTable } from "~/features/governance/components/referenda";

export const Route = createFileRoute("/_layout/referenda/")({
  component: ReferendaPage,
});

function ReferendaPage() {
  return <ReferendaTable />;
}
