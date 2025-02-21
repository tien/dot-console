import { useAccounts, useLazyLoadQuery } from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { ValidatorAccount } from "~/features/staking/components/validator-account";
import { useStakingChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/accounts/_layout/validators")({
  component: ValidatorsPage,
});

function ValidatorsPage() {
  const accounts = useAccounts();
  const validatorPreferences = useLazyLoadQuery(
    (query) =>
      query.readStorages(
        "Staking",
        "Validators",
        accounts.map((account) => [account.address] as const),
      ),
    { chainId: useStakingChainId() },
  );

  const validators = validatorPreferences
    .map((preference, index) => ({ account: accounts.at(index)!, preference }))
    .filter(({ preference }) => preference.commission > 0)
    .map(({ account }) => account);

  return (
    <ul className={css({ padding: "2rem" })}>
      {validators.map((validator) => (
        <ValidatorAccount
          key={validator.wallet.id + validator.address}
          account={validator}
          className={css({ maxWidth: "64rem", margin: "auto" })}
        />
      ))}
    </ul>
  );
}
