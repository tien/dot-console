import { CodecView } from "../../components/codec-view";
import { Heading, Table } from "../../components/ui";
import { Collapsible } from "@ark-ui/react";
import { IDLE } from "@reactive-dot/core";
import {
  useBlock,
  useChainId,
  useClient,
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import { differenceInMilliseconds, formatDuration } from "date-fns";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { css, cx } from "styled-system/css";
import { useStakingChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/statistics")({
  component: ExplorerPage,
});

function ExplorerPage() {
  const [blockMap, setBlockMap] = useState<
    Map<number, { hash: string; number: number }>
  >(new Map());

  const blocks = Array.from(blockMap.values()).toSorted(
    (a, b) => b.number - a.number,
  );

  const client = useClient();

  useEffect(() => {
    const subscription = client.finalizedBlock$.subscribe({
      next: (block) =>
        setBlockMap((blocks) => new Map(blocks).set(block.number, block)),
    });

    return () => subscription.unsubscribe();
  }, [client.finalizedBlock$]);

  return (
    <div
      className={css({
        display: "grid",
        gridTemplateAreas: `
          "statistics"
          "blocks"
          "events"
        `,
        "@media(min-width: 68rem)": {
          flex: "1 1 0",
          gridTemplateAreas: `
            "statistics statistics"
            "blocks     events"
          `,
          gridAutoRows: "min-content 1fr",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          overflow: "hidden",
        },
      })}
    >
      <Statistics className={css({ gridArea: "statistics" })} />
      <div className={css({ gridArea: "blocks", overflow: "auto" })}>
        <Blocks blocks={blocks} />
      </div>
      <div className={css({ gridArea: "events", overflow: "auto" })}>
        <Events blocks={blocks} />
      </div>
    </div>
  );
}

type StatisticsProps = {
  className?: string;
};

function Statistics({ className }: StatisticsProps) {
  const totalIssuance = useLazyLoadQuery((builder) =>
    builder.readStorage("Balances", "TotalIssuance", []),
  );

  return (
    <section
      className={cx(
        className,
        css({
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          "&>*": {
            flex: 1,
            padding: "0 1rem",
          },
          "@media(min-width: 68rem)": {
            flexDirection: "row",
            "&>*:not(:first-child)": {
              borderLeft: "1px solid",
            },
          },
        }),
      )}
    >
      <article>
        <header>
          <Heading as="h3">Block time</Heading>
        </header>
        <div>
          <BlockTime />
        </div>
      </article>
      <article>
        <header>
          <Heading as="h3">Total issuance</Heading>
        </header>
        <div>
          {useNativeTokenAmountFromPlanck(totalIssuance).toLocaleString()}
        </div>
      </article>
      <TotalStaked />
      <article>
        <header>
          <Heading as="h3">Last finalised block</Heading>
        </header>
        <div>
          <FinalizedBlockNumber />
        </div>
      </article>
      <article>
        <header>
          <Heading as="h3">Last best block</Heading>
        </header>
        <div>
          <BestBlockNumber />
        </div>
      </article>
    </section>
  );
}

function BlockTime() {
  const chainId = useChainId();

  if (
    chainId === "kusama" ||
    chainId === "polkadot" ||
    chainId === "paseo" ||
    chainId === "westend"
  ) {
    // eslint-disable-next-line no-var
    var babeChainId = chainId;
  } else {
    // eslint-disable-next-line no-var
    var auraChainId = chainId;
  }

  const expectedBabeBlockTime = useLazyLoadQuery(
    (builder) =>
      babeChainId === undefined
        ? undefined
        : builder.getConstant("Babe", "ExpectedBlockTime"),
    { chainId: babeChainId! },
  );

  const auraSlotDuration = useLazyLoadQuery(
    (builder) =>
      auraChainId === undefined
        ? undefined
        : builder.callApi("AuraApi", "slot_duration", []),
    { chainId: auraChainId! },
  );

  const expectedBlockTime =
    expectedBabeBlockTime !== IDLE
      ? expectedBabeBlockTime
      : auraSlotDuration !== IDLE
        ? auraSlotDuration
        : undefined;

  return (
    <div>
      Target: {formatDuration({ seconds: Number(expectedBlockTime) / 1000 })};
      Actual: <LastBlockTime />
    </div>
  );
}

function LastBlockTime() {
  const formatDistance = (from: Date) =>
    (differenceInMilliseconds(new Date(), from) / 1000).toLocaleString(
      undefined,
      { minimumFractionDigits: 1, maximumFractionDigits: 1 },
    ) + "s";

  const client = useClient();

  const [lastBlockTime, setLastBlockTime] = useState(new Date());

  useEffect(() => {
    const subscription = client.finalizedBlock$.subscribe({
      next: () => setLastBlockTime(new Date()),
    });

    return () => subscription.unsubscribe();
  }, [client.finalizedBlock$]);

  const [lastBlockTimeToNow, setLastBlockTimeToNow] = useState(() =>
    formatDistance(lastBlockTime),
  );

  useEffect(() => {
    const interval = setInterval(
      () => setLastBlockTimeToNow(formatDistance(lastBlockTime)),
      100,
    );

    return () => clearInterval(interval);
  }, [lastBlockTime]);

  return <span>{lastBlockTimeToNow}</span>;
}

function FinalizedBlockNumber() {
  return useBlock("finalized").number.toLocaleString();
}

function BestBlockNumber() {
  return useBlock("best").number.toLocaleString();
}

function TotalStaked() {
  const chainId = useChainId();
  const stakingChainId = useStakingChainId();

  const activeEra = useLazyLoadQuery(
    (builder) => builder.readStorage("Staking", "ActiveEra", []),
    { chainId: stakingChainId },
  );

  const queryResult = useLazyLoadQuery(
    (builder) =>
      activeEra === undefined
        ? false
        : builder
            .readStorage("Staking", "ErasTotalStake", [activeEra.index])
            .readStorage("NominationPools", "TotalValueLocked", []),
    { chainId: stakingChainId },
  );

  return (
    <article>
      <header>
        <Heading as="h3">
          Total staked {chainId !== stakingChainId && `@ relay-chain`}
        </Heading>
      </header>
      <div>
        {useNativeTokenAmountFromPlanck(
          queryResult === IDLE ? 0n : queryResult[0] + queryResult[1],
        ).toLocaleString()}
      </div>
    </article>
  );
}

type BlocksProps = {
  blocks: Array<{ hash: string; number: number }>;
  className?: string;
};

function Blocks({ blocks, className }: BlocksProps) {
  return (
    <article>
      <header
        className={css({
          position: "sticky",
          top: 0,
          padding: "0.5rem 1rem",
          backgroundColor: "var(--colors-bg-default)",
        })}
      >
        <Heading as="h3" size="xl">
          Recent blocks
        </Heading>
      </header>
      <Table.Root className={className}>
        <Table.Caption>Recent blocks</Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.Header>Number</Table.Header>
            <Table.Header>Hash</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {blocks.map((block) => (
            <Table.Row key={block.hash}>
              <Table.Cell>{block.number.toLocaleString()}</Table.Cell>
              <Table.Cell>{block.hash}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </article>
  );
}

type EventsProps = {
  blocks: Array<{ hash: string; number: number }>;
  className?: string;
};

function Events({ blocks, className }: EventsProps) {
  return (
    <article>
      <header
        className={css({
          position: "sticky",
          top: 0,
          padding: "0.5rem 1rem",
          backgroundColor: "var(--colors-bg-default)",
        })}
      >
        <Heading as="h3" size="xl">
          Recent events
        </Heading>
      </header>
      <Table.Root className={className}>
        <Table.Caption>Recent events</Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Height</Table.Header>
            <Table.Header>Index</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {blocks.map((block) => (
            <ErrorBoundary
              key={block.hash}
              fallback={
                <Table.Row>
                  <Table.Cell colSpan={3}>
                    Error fetching block #{block.number} events
                  </Table.Cell>
                </Table.Row>
              }
            >
              <Suspense>
                <BlockEvents
                  blockNumber={block.number}
                  blockHash={block.hash}
                />
              </Suspense>
            </ErrorBoundary>
          ))}
        </Table.Body>
      </Table.Root>
    </article>
  );
}

type BlockEventsProps = {
  blockNumber: number;
  blockHash: string;
};

function BlockEvents({ blockNumber, blockHash }: BlockEventsProps) {
  const events = useLazyLoadQuery((builder) =>
    builder.readStorage("System", "Events", [], {
      at: blockHash as `0x${string}`,
    }),
  );

  return (
    <>
      {events
        .map((event, index) => ({ ...event, eventIndex: index }))
        .filter(
          ({ event }) =>
            event.type !== "System" &&
            (!["Balances", "Treasury"].includes(event.type) ||
              !["Deposit", "UpdatedInactive", "Withdraw"].includes(
                event.value.type,
              )) &&
            (!["TransactionPayment"].includes(event.type) ||
              !["TransactionFeePaid"].includes(event.value.type)) &&
            (!["ParaInclusion", "ParasInclusion", "Inclusion"].includes(
              event.type,
            ) ||
              !["CandidateBacked", "CandidateIncluded"].includes(
                event.value.type,
              )) &&
            (!["RelayChainInfo"].includes(event.type) ||
              !["CurrentBlockNumbers"].includes(event.value.type)),
        )
        .map(({ event, eventIndex }, index) => (
          <Collapsible.Root key={blockHash + index} asChild>
            <div className={css({ display: "contents" })}>
              <Collapsible.Trigger asChild>
                <Table.Row className={css({ cursor: "pointer" })}>
                  <Table.Cell>
                    {event.type}.{event.value.type}
                  </Table.Cell>
                  <Table.Cell>{blockNumber.toLocaleString()}</Table.Cell>
                  <Table.Cell>{eventIndex}</Table.Cell>
                </Table.Row>
              </Collapsible.Trigger>
              <Collapsible.Content asChild>
                <Table.Row>
                  <Table.Cell colSpan={3} className={css({ padding: 0 })}>
                    <CodecView
                      value={event.value.value}
                      className={css({ borderRadius: 0 })}
                    />
                  </Table.Cell>
                </Table.Row>
              </Collapsible.Content>
            </div>
          </Collapsible.Root>
        ))}
    </>
  );
}
