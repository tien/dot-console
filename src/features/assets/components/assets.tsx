import type { XcmV3Junctions } from "@polkadot-api/descriptors";
import {
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import { Suspense, useMemo } from "react";
import { css } from "styled-system/css";
import { AccountListItem } from "~/components/account-list-item";
import { Table } from "~/components/ui/table";
import { useAssetHubChainId } from "~/hooks/chain";

export function SuspendableAssetList() {
  const [nativeAssets, foreignAssets] = useLazyLoadQuery(
    (builder) =>
      builder
        .readStorageEntries("Assets", "Asset", [])
        .readStorageEntries("ForeignAssets", "Asset", []),
    { chainId: useAssetHubChainId() },
  );

  const [nativeMetadatum, foreignMetadatum, nativeValues] = useLazyLoadQuery(
    (builder) =>
      builder
        .readStorages(
          "Assets",
          "Metadata",
          nativeAssets.map(([[id]]) => [id] as const),
        )
        .readStorages(
          "ForeignAssets",
          "Metadata",
          foreignAssets.map(([[id]]) => [id] as const),
        )
        .callApis(
          "AssetConversionApi",
          "quote_price_tokens_for_exact_tokens",
          [...nativeAssets, ...foreignAssets].map(
            ([[id], asset]) =>
              [
                {
                  parents: 1,
                  interior: {
                    type: "Here",
                    value: undefined,
                  },
                },
                typeof id === "number"
                  ? {
                      parents: 0,
                      interior: {
                        type: "X2",
                        value: [
                          { type: "PalletInstance", value: 50 },
                          { type: "GeneralIndex", value: BigInt(id) },
                        ],
                      } as XcmV3Junctions,
                    }
                  : id,
                asset.supply,
                false,
              ] as const,
          ),
        ),
    { chainId: useAssetHubChainId() },
  );

  const nativeTokenAmount = useNativeTokenAmountFromPlanck();

  const assets = useMemo(
    () =>
      [
        ...nativeAssets.map(([id, asset], index) => ({
          id,
          ...asset,
          ...nativeMetadatum.at(index)!,
        })),
        ...foreignAssets.map(([id, asset], index) => ({
          id,
          ...asset,
          ...foreignMetadatum.at(index)!,
        })),
      ]
        .map((asset, index) => ({
          ...asset,
          nativeValue:
            nativeValues[index] === undefined
              ? undefined
              : nativeTokenAmount(nativeValues[index]),
        }))
        .toSorted((a, b) =>
          (a.nativeValue ?? 0n) === (b.nativeValue ?? 0n)
            ? 0
            : (a.nativeValue ?? 0n) > (b.nativeValue ?? 0n)
              ? -1
              : 1,
        ),
    [
      foreignAssets,
      foreignMetadatum,
      nativeAssets,
      nativeMetadatum,
      nativeTokenAmount,
      nativeValues,
    ],
  );

  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Supply</Table.Header>
          <Table.Header>Native value</Table.Header>
          <Table.Header>Holders</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header>Owner</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {assets.map((asset, index) => (
          // INVESTIGATE: not having a suspense here will cause parent re-render for every child for some reason
          <Suspense key={index}>
            <Table.Row>
              <Table.Cell>{asset.name.asText()}</Table.Cell>
              <Table.Cell className={css({ maxWidth: "15rem" })}>
                <div className={css({ overflow: "auto" })}>
                  {asset.supply.toLocaleString(undefined, {
                    notation: "compact",
                  })}
                </div>
              </Table.Cell>
              <Table.Cell>
                {asset.nativeValue?.toLocaleString(undefined, {
                  notation: "compact",
                }) ?? "N/A"}
              </Table.Cell>
              <Table.Cell>{asset?.accounts.toLocaleString()}</Table.Cell>
              <Table.Cell>{asset?.status.type}</Table.Cell>
              <Table.Cell
                className={css({ maxWidth: "20rem", overflow: "auto" })}
              >
                <AccountListItem address={asset!.owner} />
              </Table.Cell>
            </Table.Row>
          </Suspense>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
