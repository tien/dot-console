import { useAccounts } from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { AccountCard } from "~/features/accounts/components/account-info";

export const Route = createFileRoute("/_layout/accounts/_layout/")({
  component: AccountsPage,
});

function AccountsPage() {
  const accounts = useAccounts();

  if (accounts.length === 0) {
    return (
      <p className={css({ textAlign: "center" })}>No connected accounts</p>
    );
  }

  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem",
      })}
    >
      {accounts.map((account) => (
        <AccountCard
          key={account.wallet.id + account.address}
          address={account.address}
          name={account.name}
        />
      ))}
    </section>
  );
}
