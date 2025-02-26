import { useLazyLoadQuery } from "@reactive-dot/react";
import { Suspense } from "react";
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
          <Table.Cell>Concluded at</Table.Cell>
          <Table.Cell>Proposer</Table.Cell>
          <Table.Cell>Outcome</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {concludedRange.map((number) => (
          <Suspense key={number}>
            <ConcludedReferendaItem number={number} />
          </Suspense>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

type ConcludedReferendaItemProps = {
  number: number;
};

function ConcludedReferendaItem({ number }: ConcludedReferendaItemProps) {
  const info = useLazyLoadQuery(
    (builder) =>
      builder.readStorage("Referenda", "ReferendumInfoFor", [number]),
    { chainId: useGovernanceChainId() },
  );

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
            {proposer === undefined ? undefined : (
              <AccountListItem address={proposer.who} />
            )}
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
