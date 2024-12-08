import { useAccounts, useLazyLoadQuery } from "@reactive-dot/react";
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { css } from "styled-system/css";
import { Badge } from "~/components/ui/badge";
import { Tabs } from "~/components/ui/tabs";
import { useStakingChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/accounts/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  return (
    <div className={css({ padding: "2rem" })}>
      <Tabs.Root value={location.pathname}>
        <Tabs.List>
          <Tabs.Trigger asChild value="/accounts">
            <Link to="/accounts">General</Link>
          </Tabs.Trigger>
          <Tabs.Trigger asChild value="/accounts/validators">
            <Link to="/accounts/validators">
              Validators{" "}
              <Suspense>
                <SuspendableValidatorCountBadge />
              </Suspense>
            </Link>
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value={location.pathname}>
          <Outlet />
        </Tabs.Content>
      </Tabs.Root>
    </div>
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
