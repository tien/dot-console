import { idle } from "@reactive-dot/core";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import {
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import { BigIntMath } from "@reactive-dot/utils";
import ActionRightIcon from "@w3f/polkadot-icons/solid/ActionRight";
import { Binary } from "polkadot-api";
import {
  Fragment,
  Suspense,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { css } from "styled-system/css";
import { Center } from "styled-system/jsx";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { TooltipBox } from "~/components/tooltip-box";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { HoverCard } from "~/components/ui/hover-card";
import { IconButton } from "~/components/ui/icon-button";
import { Popover } from "~/components/ui/popover";
import { Progress } from "~/components/ui/progress";
import { Table } from "~/components/ui/table";
import { AccountListItem } from "~/features/accounts/components/account-list-item";
import { useStakingChainId } from "~/hooks/chain";
import { ellipsize } from "~/utils";

type AccountProps = {
  account: WalletAccount;
};

type ValidatorAccountProps = AccountProps & { className?: string | undefined };

export function ValidatorAccount({
  account,
  className,
}: ValidatorAccountProps) {
  return (
    <Suspense
      fallback={<Progress type="linear" value={null} className={className} />}
    >
      <Card.Root className={className}>
        <Card.Header>
          <AccountListItem address={account.address} name={account.name} />
        </Card.Header>
        <Card.Body>
          <Suspense
            fallback={
              <CircularProgressIndicator label="Loading staked balance" />
            }
          >
            <SuspendableStaked account={account} />
          </Suspense>
          <hr className={css({ margin: "1rem 0" })} />
          <dl
            className={css({
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              alignItems: "center",
              gap: "0.5rem",
              "&>dt": {
                fontSize: "1.125em",
                fontWeight: "bold",
              },
              "&>dd": {
                justifySelf: "end",
                maxWidth: "stretch",
              },
            })}
          >
            <Suspense>
              <SuspendableControllerAccount account={account} />
            </Suspense>
            <dt>Reward destination</dt>
            <dd>
              <Suspense fallback={<CircularProgressIndicator />}>
                <SuspendableRewardDestination account={account} />
              </Suspense>
            </dd>
            <dt>Commission</dt>
            <dd>
              <Suspense fallback={<CircularProgressIndicator />}>
                <SuspendableCommission account={account} />
              </Suspense>
            </dd>
            <dt>Session keys</dt>
            <dd>
              <Suspense fallback={<CircularProgressIndicator />}>
                <SuspendableSessionKey account={account} />
              </Suspense>
            </dd>
          </dl>
          <hr className={css({ margin: "1rem 0" })} />
          <Suspense
            fallback={
              <Center>
                <CircularProgressIndicator label="Loading nominators" />
              </Center>
            }
          >
            <SuspendableNominatorList account={account} />
          </Suspense>
        </Card.Body>
      </Card.Root>
    </Suspense>
  );
}

function SuspendableStaked({ account }: AccountProps) {
  const nativeTokenAmountFromPlanck = useNativeTokenAmountFromPlanck();

  const [currentEra, minActiveStake] = useLazyLoadQuery(
    (builder) =>
      builder
        .readStorage("Staking", "CurrentEra", [])
        .readStorage("Staking", "MinimumActiveStake", []),
    { chainId: useStakingChainId() },
  );

  const overview = useLazyLoadQuery(
    (builder) =>
      currentEra !== undefined &&
      builder.readStorage("Staking", "ErasStakersOverview", [
        currentEra,
        account.address,
      ]),
    { chainId: useStakingChainId() },
  );

  if (overview === idle || overview === undefined) {
    return null;
  }

  return (
    <dl className={css({ containerType: "inline-size" })}>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "2em",
          "& dd": { fontWeight: "bold" },
          "@container(max-width: 40rem)": {
            flexDirection: "column",
            alignItems: "revert",
            gap: "1rem",
            "&>*:nth-child(even)": {
              display: "none",
            },
          },
        })}
      >
        <div>
          <dt>Total</dt>
          <dd>
            {nativeTokenAmountFromPlanck(overview.total).toLocaleString()}
          </dd>
        </div>
        <div>=</div>
        <div>
          <dt>Self</dt>
          <dd>{nativeTokenAmountFromPlanck(overview.own).toLocaleString()}</dd>
        </div>
        <div>+</div>
        <div>
          <dt>
            Nominated{" "}
            {overview.nominator_count > 0 && (
              <sup>({overview.nominator_count.toLocaleString()} members)</sup>
            )}
          </dt>
          <dd>
            {nativeTokenAmountFromPlanck(
              overview.total - overview.own,
            ).toLocaleString()}
          </dd>
        </div>
      </div>
      <div className={css({ marginTop: "1rem" })}>
        <dt>Min active stake</dt>
        <dd
          className={css({
            fontWeight: "bold",
            color:
              overview.total < minActiveStake ? "error.text" : "success.text",
          })}
        >
          {nativeTokenAmountFromPlanck(
            BigIntMath.min(overview.total, minActiveStake),
          ).toLocaleString(undefined, {
            style: "decimal",
            notation: "compact",
          })}
          /
          {nativeTokenAmountFromPlanck(minActiveStake).toLocaleString(
            undefined,
            {
              style: "decimal",
              notation: "compact",
            },
          )}{" "}
          {nativeTokenAmountFromPlanck(minActiveStake).denomination}
        </dd>
      </div>
    </dl>
  );
}

function SuspendableControllerAccount({ account }: AccountProps) {
  const controller = useLazyLoadQuery(
    (query) => query.readStorage("Staking", "Bonded", [account.address]),
    { chainId: useStakingChainId() },
  );

  if (controller === undefined) {
    return null;
  }

  return (
    <>
      <dt>Controller</dt>
      <dd>
        <Action>
          <AccountListItem address={controller} />
        </Action>
      </dd>
    </>
  );
}

function SuspendableRewardDestination({ account }: AccountProps) {
  return (
    <Action>
      <SuspendableRewardDestinationType account={account} />
    </Action>
  );
}

function SuspendableRewardDestinationType({ account }: AccountProps) {
  const payee = useLazyLoadQuery(
    (query) => query.readStorage("Staking", "Payee", [account.address]),
    { chainId: useStakingChainId() },
  );

  if (payee === undefined) {
    return null;
  }

  if (payee.type === "Account") {
    return <AccountListItem address={payee.value} />;
  }

  return payee.type;
}

function SuspendableCommission({ account }: AccountProps) {
  const preferences = useLazyLoadQuery(
    (query) => query.readStorage("Staking", "Validators", [account.address]),
    { chainId: useStakingChainId() },
  );

  if (preferences === undefined) {
    return null;
  }
  return (
    <Action>
      {(preferences.commission / 1_000_000_000).toLocaleString(undefined, {
        style: "percent",
        maximumFractionDigits: 2,
      })}
    </Action>
  );
}

function SuspendableSessionKey({ account }: AccountProps) {
  return (
    <Action>
      <SuspendableSessionKeyValue account={account} />
    </Action>
  );
}

function SuspendableSessionKeyValue({ account }: AccountProps) {
  const sessionKeys = useLazyLoadQuery((query) =>
    query.readStorage("Session", "NextKeys", [account.address]),
  );

  if (sessionKeys === undefined) {
    return null;
  }

  if (sessionKeys instanceof Binary) {
    return sessionKeys.asHex();
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        textDecoration="underline"
        className={css({ cursor: "pointer" })}
      >
        {ellipsize(
          Binary.fromBytes(
            Object.values(sessionKeys)
              .map((key) => key.asBytes())
              .reduce(
                (prev, curr) => new Uint8Array([...prev, ...curr]),
                new Uint8Array(),
              ),
          ).asHex(),
          6,
        )}
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content maxWidth="unset">
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <dl
            className={css({
              display: "grid",
              gridTemplateColumns: "max-content minmax(0, 1fr)",
              gap: "1em",
            })}
          >
            {Object.entries(sessionKeys).map(([type, key]) => (
              <Fragment key={type}>
                <dt>{type}</dt>
                <dd
                  className={css({
                    justifySelf: "end",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                  })}
                >
                  {key.asHex()}
                </dd>
              </Fragment>
            ))}
          </dl>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}

function SuspendableNominatorList({ account }: AccountProps) {
  const nativeTokenAmountFromPlanck = useNativeTokenAmountFromPlanck();

  const currentEra = useLazyLoadQuery(
    (builder) => builder.readStorage("Staking", "CurrentEra", []),
    { chainId: useStakingChainId() },
  );

  const overview = useLazyLoadQuery(
    (builder) =>
      currentEra !== undefined &&
      builder.readStorage("Staking", "ErasStakersOverview", [
        currentEra,
        account.address,
      ]),
    { chainId: useStakingChainId() },
  );

  const nominatorPages = useLazyLoadQuery(
    (builder) =>
      currentEra !== undefined &&
      overview !== idle &&
      overview !== undefined &&
      builder.readStorages(
        "Staking",
        "ErasStakersPaged",
        Array.from({ length: overview.page_count }).map(
          (_, index) => [currentEra, account.address, index] as const,
        ),
      ),
    { chainId: useStakingChainId() },
  );

  const nominators = useMemo(
    () =>
      nominatorPages === idle
        ? []
        : nominatorPages
            .filter((page) => page !== undefined)
            .flatMap((page) => page?.others)
            .toSorted((a, b) => (b.value - a.value > 0 ? 1 : 0)),
    [nominatorPages],
  );

  const [visibleCount, setVisibleCount] = useState(3);

  const showMore = () => setVisibleCount((count) => count + 3);

  const hasMore = visibleCount < nominators.length;

  return (
    <div className={css({ overflow: "auto" })}>
      <Table.Root>
        <Table.Head>
          <Table.Row>
            <Table.Header>Nominator</Table.Header>
            <Table.Header>Stake</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {nominators.slice(0, visibleCount).map((nominator) => (
            <Table.Row key={nominator.who}>
              <Table.Cell>
                <AccountListItem address={nominator.who} />
              </Table.Cell>
              <Table.Cell>
                {nativeTokenAmountFromPlanck(nominator.value).toLocaleString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        {hasMore && (
          <Table.Foot>
            <Table.Row className={css({ backgroundColor: "transparent" })}>
              <Table.Cell colSpan={2}>
                <Button
                  variant="ghost"
                  onClick={showMore}
                  className={css({ width: "stretch" })}
                >
                  Show more
                </Button>
              </Table.Cell>
            </Table.Row>
          </Table.Foot>
        )}
      </Table.Root>
    </div>
  );
}

function Action({ children }: PropsWithChildren) {
  return (
    <div
      className={css({ display: "flex", alignItems: "center", gap: "0.5em" })}
    >
      {children}
      <TooltipBox tooltip="Coming soon">
        <IconButton variant="ghost" size="lg" disabled>
          <ActionRightIcon fill="currentcolor" />
        </IconButton>
      </TooltipBox>
    </div>
  );
}
