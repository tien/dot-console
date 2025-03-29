import { createFileRoute } from "@tanstack/react-router";
import { ReferendaTable } from "~/features/governance/components/referenda";
import { TreasuryBalances } from "~/features/governance/components/treasury-balances";

export const Route = createFileRoute("/_layout/referenda/")({
  component: ReferendaPage,
});

function ReferendaPage() {
  return (
    <div>
      <TreasuryBalances />
      <ReferendaTable />
    </div>
  );
}
