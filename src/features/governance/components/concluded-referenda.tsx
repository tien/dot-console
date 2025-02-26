import { useReferendumOffChainDiscussion } from "../hooks/use-referendum-off-chain-discussion";
import { SuspendableReferndumDiscussionLink } from "./referendum-discussion-link";
import { useLazyLoadQuery } from "@reactive-dot/react";
import { Suspense, use } from "react";
import { useInView } from "react-intersection-observer";
import { Center } from "styled-system/jsx";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { Badge } from "~/components/ui/badge";
import { Table } from "~/components/ui/table";
import { AccountListItem } from "~/features/accounts/components/account-list-item";
import { useGovernanceChainId } from "~/hooks/chain";
import { range } from "~/utils";

export function ConcludedReferenda() {
  const [referendumCount, decidingCount] = useLazyLoadQuery(
    (builder) =>
      builder
        .readStorage("Referenda", "ReferendumCount", [])
        .readStorageEntries("Referenda", "DecidingCount", []),
    {
      chainId: useGovernanceChainId(),
    },
  );

  const activeReferendumCount = decidingCount.reduce(
    (prev, curr) => prev + curr[1],
    0,
  );

  const concludedRange = range(
    0,
    referendumCount - activeReferendumCount + 1,
  ).toReversed();

  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Cell>Referendum</Table.Cell>
          <Table.Cell whiteSpace="nowrap">Concluded at</Table.Cell>
          <Table.Cell>Proposer</Table.Cell>
          <Table.Cell>Discussion</Table.Cell>
          <Table.Cell>Outcome</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {concludedRange.map((number) => (
          <LazyReferendumItem key={number} number={number} />
        ))}
      </Table.Body>
    </Table.Root>
  );
}

type ReferendumProps = {
  number: number;
};

function LazyReferendumItem({ number }: ReferendumProps) {
  const [ref, inView] = useInView({ triggerOnce: true, delay: 100 });

  const fallback = (
    <Table.Row ref={ref}>
      <Table.Cell>{number.toLocaleString()}</Table.Cell>
      <Table.Cell colSpan={4} display={inView ? undefined : "none"}>
        <Center>
          <CircularProgressIndicator />
        </Center>
      </Table.Cell>
    </Table.Row>
  );

  return (
    <Suspense key={number} fallback={fallback}>
      {!inView ? fallback : <ConcludedReferendumItem number={number} />}
    </Suspense>
  );
}

function ConcludedReferendumItem({ number }: ReferendumProps) {
  const info = useLazyLoadQuery(
    (builder) =>
      builder.readStorage("Referenda", "ReferendumInfoFor", [number]),
    { chainId: useGovernanceChainId() },
  );

  const offChainData = useReferendumOffChainDiscussion(number);

  switch (info?.type) {
    case "Ongoing":
    case undefined:
      return null;
    case "Approved":
    case "Cancelled":
    case "Killed":
    case "Rejected":
    case "TimedOut": {
      const [at, proposer] =
        typeof info.value === "number"
          ? ([info.value, undefined] as const)
          : info.value;

      return (
        <Table.Row>
          <Table.Cell>{number.toLocaleString()}</Table.Cell>
          <Table.Cell>{at.toLocaleString()}</Table.Cell>
          <Table.Cell>
            <AccountListItem
              address={
                proposer === undefined
                  ? use(offChainData).proposer
                  : proposer.who
              }
            />
          </Table.Cell>
          <Table.Cell>
            <SuspendableReferndumDiscussionLink dataPromise={offChainData} />
          </Table.Cell>
          <Table.Cell>
            <Badge
              variant="solid"
              colorPalette={(() => {
                switch (info.type) {
                  case "Approved":
                    return "success";
                  case "TimedOut":
                    return "warning";
                  case "Cancelled":
                  case "Killed":
                  case "Rejected":
                    return "error";
                }
              })()}
            >
              {info.type}
            </Badge>
          </Table.Cell>
        </Table.Row>
      );
    }
  }
}
