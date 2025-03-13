import { QueryRenderer, useLazyLoadQuery } from "@reactive-dot/react";
import { DenominatedNumber } from "@reactive-dot/utils";
import { Suspense, useMemo } from "react";
import { css } from "styled-system/css";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { Table } from "~/components/ui/table";
import { AccountListItem } from "~/features/accounts/components/account-list-item";
import { USDT_ASSET_ID } from "~/features/assets/utils";
import { useAssetHubChainId, useCollectivesChainId } from "~/hooks/chain";

type CoreCollectiveProps = {
  type: "fellowship" | "ambassador";
};

export function CoreCollective({ type }: CoreCollectiveProps) {
  const collectivesChainId = useCollectivesChainId();

  const palletName = useMemo(() => {
    switch (type) {
      case "fellowship":
        return "Fellowship" as const;
      case "ambassador":
        return "Ambassador" as const;
    }
  }, [type]);

  const [coreMembers, params] = useLazyLoadQuery(
    (builder) =>
      builder
        .storageEntries(`${palletName}Core`, "Member")
        .storage(`${palletName}Core`, "Params"),
    { chainId: collectivesChainId },
  );

  const ranks = useLazyLoadQuery(
    (builder) =>
      builder.storages(
        `${palletName}Collective`,
        "Members",
        coreMembers.map(([key]) => key),
      ),
    { chainId: collectivesChainId },
  );

  const members = useMemo(
    () =>
      coreMembers
        .map(([[address], member], index) => {
          const rank = ranks.at(index);

          return {
            ...member,
            address,
            rank,
            salary:
              (rank === undefined
                ? 0n
                : member.is_active
                  ? params.active_salary[rank]
                  : params.passive_salary[rank]) ?? 0n,
          };
        })
        .toSorted((a, b) => (b.rank ?? -Infinity) - (a.rank ?? -Infinity)),
    [coreMembers, params.active_salary, params.passive_salary, ranks],
  );

  const assetHubChainId = useAssetHubChainId();

  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header>Rank</Table.Header>
          <Table.Header>Member</Table.Header>
          <Table.Header>Salary</Table.Header>
          <Table.Header>Status</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {members.map((member) => (
          <Table.Row key={member.address}>
            <Table.Cell>{member.rank ?? "Unranked"}</Table.Cell>
            <Table.Cell>
              <AccountListItem address={member.address} />
            </Table.Cell>
            <Table.Cell>
              <Suspense fallback={<CircularProgressIndicator size="text" />}>
                <QueryRenderer
                  chainId={assetHubChainId}
                  query={(builder) =>
                    builder.storage("Assets", "Metadata", [USDT_ASSET_ID])
                  }
                >
                  {(metadata) =>
                    new DenominatedNumber(
                      member.salary,
                      metadata.decimals,
                      metadata.symbol.asText(),
                    ).toLocaleString()
                  }
                </QueryRenderer>
              </Suspense>
            </Table.Cell>
            <Table.Cell
              className={css({
                color: member.is_active ? "success.text" : "error.text",
              })}
            >
              {member.is_active ? "Active" : "Inactive"}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
