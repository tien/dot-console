import { useAccounts, useLazyLoadQuery } from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { RouteTabs } from "~/components/route-tabs";
import { Badge } from "~/components/ui/badge";
import { useStakingChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/accounts/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteTabs>
      <RouteTabs.Item to="/accounts" label="General" />
      <RouteTabs.Item
        to="/accounts/validators"
        label="Validators"
        badge={
          <Suspense>
            <SuspendableValidatorCountBadge />
          </Suspense>
        }
      />
    </RouteTabs>
  );
}

function SuspendableValidatorCountBadge() {
  const accounts = useAccounts();
  const validators = useLazyLoadQuery(
    (builder) =>
      builder.readStorages(
        "Staking",
        "Validators",
        accounts.map((account) => [account.address] as const),
      ),
    { chainId: useStakingChainId() },
  ).filter((validator) => validator.commission > 0);

  if (validators.length === 0) {
    return null;
  }

  return <Badge>{validators.length}</Badge>;
}
