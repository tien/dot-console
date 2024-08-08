import Identicon from "../../components/identicon";
import { Card, Heading, Text } from "../../components/ui";
import type { PolkadotAccount } from "@reactive-dot/core";
import {
  useAccounts,
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import { Fragment, type ReactNode, Suspense } from "react";
import { css } from "styled-system/css";
import { Spinner } from "~/components/ui/spinner";
import { usePeopleChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/accounts")({
  component: AccountsPage,
});

function AccountsPage() {
  const accounts = useAccounts();

  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem 4rem",
      })}
    >
      {accounts.map((account) => (
        <AccountItem
          key={account.wallet.id + account.address}
          account={account}
        />
      ))}
    </section>
  );
}

type AccountItemProps = {
  account: PolkadotAccount;
};

function AccountItem({ account }: AccountItemProps) {
  return (
    <Card.Root>
      <Card.Header
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0.5rem",
        })}
      >
        <Identicon address={account.address} size="2.2rem" />
        <div>
          <Card.Title
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            })}
          >
            <Heading>{account.name}</Heading>
          </Card.Title>
          <Card.Description>{account.address}</Card.Description>
        </div>
      </Card.Header>
      <Card.Body className={css({ "& dd": { fontWeight: "bold" } })}>
        <AccountBalances account={account} />
        <AccountIdentity account={account} />
      </Card.Body>
    </Card.Root>
  );
}

type AccountBalancesProps = {
  account: PolkadotAccount;
};

function AccountBalances(props: AccountBalancesProps) {
  return (
    <Suspense
      fallback={
        <AccountBalancesTemplate
          spendable={<Spinner />}
          free={<Spinner />}
          frozen={<Spinner />}
          reserved={<Spinner />}
        />
      }
    >
      <SuspensibleAccountBalances {...props} />
    </Suspense>
  );
}

function SuspensibleAccountBalances({ account }: AccountBalancesProps) {
  const systemAccount = useLazyLoadQuery((builder) =>
    builder.readStorage("System", "Account", [account.address]),
  );

  const { free, frozen, reserved } = systemAccount.data;

  const spendable = free - frozen - reserved;
  const clampedSpendable = spendable < 0n ? 0n : spendable;

  return (
    <AccountBalancesTemplate
      spendable={useNativeTokenAmountFromPlanck(
        clampedSpendable,
      ).toLocaleString()}
      free={useNativeTokenAmountFromPlanck(free).toLocaleString()}
      frozen={useNativeTokenAmountFromPlanck(frozen).toLocaleString()}
      reserved={useNativeTokenAmountFromPlanck(reserved).toLocaleString()}
    />
  );
}

type AccountBalancesTemplateProps = {
  spendable: ReactNode;
  free: ReactNode;
  frozen: ReactNode;
  reserved: ReactNode;
};

function AccountBalancesTemplate({
  spendable,
  free,
  frozen,
  reserved,
}: AccountBalancesTemplateProps) {
  return (
    <dl className={css({ display: "flex", gap: "1rem", "&>*": { flex: 1 } })}>
      <div>
        <dt>Spendable</dt>
        <dd>{spendable}</dd>
      </div>
      <div>
        <dt>Free</dt>
        <dd>{free}</dd>
      </div>
      <div>
        <dt>Frozen</dt>
        <dd>{frozen}</dd>
      </div>
      <div>
        <dt>Reserved</dt>
        <dd>{reserved}</dd>
      </div>
    </dl>
  );
}

type AccountIdentityProps = {
  account: PolkadotAccount;
};

export function AccountIdentity(props: AccountIdentityProps) {
  return (
    <Suspense
      fallback={
        <Text className={css({ margin: "1rem 0 0.5rem 0" })}>
          Searching for identities...
        </Text>
      }
    >
      <SuspensibleAccountIdentity {...props} />
    </Suspense>
  );
}

export function SuspensibleAccountIdentity({ account }: AccountIdentityProps) {
  const [registration, username] =
    useLazyLoadQuery(
      (builder) =>
        builder.readStorage("Identity", "IdentityOf", [account.address]),
      { chainId: usePeopleChainId() },
    ) ?? [];

  if (registration === undefined) {
    return null;
  }

  const { additional, pgp_fingerprint, ...knowns } =
    "additional" in registration.info
      ? registration.info
      : { ...registration.info, additional: undefined };

  return (
    <section>
      <header className={css({ margin: "1rem 0 0.5rem 0" })}>
        <Heading as="h3" size="xl">
          Identity
        </Heading>
      </header>
      <dl
        className={css({
          display: "grid",
          gridTemplateColumns: "min-content minmax(0, 1fr)",
          gap: "0.5rem",
        })}
      >
        {username !== undefined && (
          <>
            <dt>Username</dt>
            <dd>{username.asText()}</dd>
          </>
        )}
        {Object.entries(knowns)
          .filter(([_, value]) => value.value !== undefined)
          .map(([key, value]) => (
            <Fragment key={key}>
              <dt className={css({ textTransform: "capitalize" })}>{key}</dt>
              <dd>{value.value!.asText()}</dd>
            </Fragment>
          ))}
      </dl>
    </section>
  );
}
