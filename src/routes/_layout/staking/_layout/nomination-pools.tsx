import {
  ChainProvider,
  QueryRenderer,
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { css } from "styled-system/css";
import { Center } from "styled-system/jsx";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { InfoHeader } from "~/components/info-header";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useStakingChainId } from "~/hooks/chain";

export const Route = createFileRoute(
  "/_layout/staking/_layout/nomination-pools",
)({
  component: NominationPoolsPage,
});

function NominationPoolsPage() {
  return (
    <ChainProvider chainId={useStakingChainId()}>
      <InfoHeader>
        <InfoHeader.Item title="Total staked">
          <Suspense fallback={<CircularProgressIndicator size="text" />}>
            <SuspendableTotalValueLocked />
          </Suspense>
        </InfoHeader.Item>
        <InfoHeader.Item title="Pools">
          <Suspense fallback={<CircularProgressIndicator size="text" />}>
            <QueryRenderer
              chainId={useStakingChainId()}
              query={(builder) =>
                builder.storage("NominationPools", "CounterForBondedPools")
              }
            >
              {(count) => `${count.toLocaleString()} pools`}
            </QueryRenderer>
          </Suspense>
        </InfoHeader.Item>
        <InfoHeader.Item title="Pool stakers">
          <Suspense fallback={<CircularProgressIndicator size="text" />}>
            <QueryRenderer
              chainId={useStakingChainId()}
              query={(builder) =>
                builder.storage("NominationPools", "CounterForPoolMembers")
              }
            >
              {(count) => `${count.toLocaleString()} members`}
            </QueryRenderer>
          </Suspense>
        </InfoHeader.Item>
      </InfoHeader>
      <Suspense
        fallback={
          <Center>
            <CircularProgressIndicator label="Loading pools" />
          </Center>
        }
      >
        <SuspendableNominationPoolList />
      </Suspense>
    </ChainProvider>
  );
}

function SuspendableTotalValueLocked() {
  return useNativeTokenAmountFromPlanck(
    useLazyLoadQuery(
      (builder) => builder.storage("NominationPools", "TotalValueLocked"),
      { chainId: useStakingChainId() },
    ),
  ).toLocaleString();
}

function SuspendableNominationPoolList() {
  const nominationPools = useLazyLoadQuery(
    (builder) => builder.storageEntries("NominationPools", "BondedPools"),
    { chainId: useStakingChainId() },
  );

  return (
    <ol
      className={css({
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(30rem, 1fr))",
        gap: 4,
        margin: "1rem",
      })}
    >
      {nominationPools
        .toSorted(([[a]], [[b]]) => a - b)
        .map(([[poolId]]) => (
          <li key={poolId}>
            <NominationPoolCard number={poolId} />
          </li>
        ))}
    </ol>
  );
}

type NominationPoolProps = {
  number: number;
};

function NominationPoolCard({ number }: NominationPoolProps) {
  return (
    <Suspense
      fallback={
        <Card.Root>
          <Card.Header>
            <Card.Title textStyle="md">
              <span className={css({ fontWeight: "bold" })}>
                #{number.toLocaleString()}
              </span>
            </Card.Title>
          </Card.Header>
          <Card.Body
            className={css({
              textStyle: "sm",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            })}
          >
            <Skeleton>
              <Badge variant="solid" size="sm">
                Open
              </Badge>
            </Skeleton>
            <Skeleton className={css({ display: "flex", gap: "0.25em" })}>
              <div>... cut</div> | <div>... members</div> |{" "}
              <div>... staked</div>
            </Skeleton>
          </Card.Body>
        </Card.Root>
      }
    >
      <SuspendableNominationPoolCard number={number} />
    </Suspense>
  );
}

function SuspendableNominationPoolCard({ number }: NominationPoolProps) {
  const stakingChainId = useStakingChainId();

  const [bondedPool, metadata] = useLazyLoadQuery(
    (builder) =>
      builder
        .storage("NominationPools", "BondedPools", [number])
        .storage("NominationPools", "Metadata", [number]),
    { chainId: stakingChainId },
  );

  const commission = useNativeTokenAmountFromPlanck(
    bondedPool?.commission.current?.[0] ?? 0,
    { chainId: stakingChainId },
  )
    .mapPlanck((planck) => planck * 10n)
    .valueOf();

  if (bondedPool === undefined) {
    return null;
  }

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title
          textStyle="md"
          className={css({
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          })}
        >
          <span className={css({ fontWeight: "bold" })}>
            #{number.toLocaleString()}
          </span>{" "}
          |{" "}
          <span className={css({ fontWeight: "normal" })}>
            {metadata.asText()}
          </span>
        </Card.Title>
      </Card.Header>
      <Card.Body
        className={css({
          textStyle: "sm",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        })}
      >
        <Badge
          variant="solid"
          size="sm"
          colorPalette={(() => {
            switch (bondedPool.state.type) {
              case "Open":
                return "success";
              case "Blocked":
                return "error";
              case "Destroying":
                return "warning";
            }
          })()}
        >
          {bondedPool.state.type}
        </Badge>
        <span>
          <span>
            {commission.toLocaleString(undefined, { style: "percent" })} cut
          </span>{" "}
          | <span>{bondedPool.member_counter.toLocaleString()} members</span> |{" "}
          <span>
            <span className={css({ color: "success.text" })}>
              <Suspense fallback="...">
                <SuspendablePoolBalance number={number} /> staked
              </Suspense>
            </span>
          </span>
        </span>
      </Card.Body>
    </Card.Root>
  );
}

function SuspendablePoolBalance({ number }: NominationPoolProps) {
  const bondedPool = useLazyLoadQuery(
    (builder) => builder.storage("NominationPools", "BondedPools", [number]),
    { chainId: useStakingChainId() },
  );

  const balance = useNativeTokenAmountFromPlanck(
    useLazyLoadQuery(
      (builder) =>
        builder.runtimeApi("NominationPoolsApi", "points_to_balance", [
          number,
          bondedPool?.points ?? 0n,
        ]),
      { chainId: useStakingChainId() },
    ),
    { chainId: useStakingChainId() },
  );

  return balance.toLocaleString(undefined, { notation: "compact" });
}
