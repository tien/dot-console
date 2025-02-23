import { getAssetId, NATIVE_ASSET_ID } from "../utils";
import type { polkadot_asset_hub } from "@polkadot-api/descriptors";
import { Query } from "@reactive-dot/core";
import {
  ChainProvider,
  QueryRenderer,
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import { DenominatedNumber } from "@reactive-dot/utils";
import { Suspense, useMemo } from "react";
import { css } from "styled-system/css";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { Table } from "~/components/ui/table";
import { AccountListItem } from "~/features/accounts/components/account-list-item";
import { useAssetHubChainId } from "~/hooks/chain";
import { stringifyCodec } from "~/utils";

export function AssetList() {
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
      <Suspense
        fallback={
          <Table.Foot>
            <Table.Row>
              <Table.Cell colSpan={6}>
                <div className={css({ display: "flex", padding: "1rem" })}>
                  <div className={css({ margin: "auto" })}>
                    <CircularProgressIndicator label="Loading assets" />
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Foot>
        }
      >
        <ChainProvider chainId={useAssetHubChainId()}>
          <SuspendableAssetList />
        </ChainProvider>
      </Suspense>
    </Table.Root>
  );
}

function SuspendableAssetList() {
  const assetHubChainId = useAssetHubChainId();

  const [nativeAssets, foreignAssets] = useLazyLoadQuery(
    (builder) =>
      builder
        .readStorageEntries("Assets", "Asset", [])
        .readStorageEntries("ForeignAssets", "Asset", []),
    { chainId: assetHubChainId },
  );

  const nativeValues = useLazyLoadQuery(
    (builder) =>
      builder.callApis(
        "AssetConversionApi",
        "quote_price_tokens_for_exact_tokens",
        [...nativeAssets, ...foreignAssets].map(
          ([[id], asset]) =>
            [NATIVE_ASSET_ID, getAssetId(id), asset.supply, false] as const,
        ),
      ),
    { chainId: assetHubChainId },
  );

  const nativeTokenAmount = useNativeTokenAmountFromPlanck();

  const assets = useMemo(
    () =>
      [...nativeAssets, ...foreignAssets]
        .map(([[id], asset], index) => ({
          id,
          ...asset,
          nativeValue:
            nativeValues[index] === undefined
              ? undefined
              : nativeTokenAmount(nativeValues[index]),
        }))
        .toSorted(
          (a, b) =>
            (b.nativeValue?.valueOf() ?? 0) - (a.nativeValue?.valueOf() ?? 0),
        ),
    [foreignAssets, nativeAssets, nativeTokenAmount, nativeValues],
  );

  return (
    <Table.Body>
      {assets.map((asset) => {
        const query = new Query<[], typeof polkadot_asset_hub>();
        const metadataQuery =
          typeof asset.id === "number"
            ? query.readStorage("Assets", "Metadata", [asset.id])
            : query.readStorage("ForeignAssets", "Metadata", [asset.id]);

        return (
          <Table.Row key={stringifyCodec(asset.id)}>
            <Table.Cell>
              <Suspense fallback={<CircularProgressIndicator />}>
                <QueryRenderer chainId={assetHubChainId} query={metadataQuery}>
                  {(metadata) => metadata.name.asText()}
                </QueryRenderer>
              </Suspense>
            </Table.Cell>
            <Table.Cell className={css({ maxWidth: "15rem" })}>
              <div className={css({ overflow: "auto" })}>
                <Suspense fallback={<CircularProgressIndicator />}>
                  <QueryRenderer
                    chainId={assetHubChainId}
                    query={metadataQuery}
                  >
                    {(metadata) =>
                      new DenominatedNumber(
                        asset!.supply,
                        metadata.decimals,
                        metadata.symbol.asText(),
                      ).toLocaleString()
                    }
                  </QueryRenderer>
                </Suspense>
              </div>
            </Table.Cell>
            <Table.Cell>
              {asset.nativeValue?.toLocaleString() ?? "N/A"}
            </Table.Cell>
            <Table.Cell>{asset.accounts.toLocaleString()}</Table.Cell>
            <Table.Cell
              css={{
                color: (() => {
                  switch (asset.status.type) {
                    case "Live":
                      return "green";
                    case "Frozen":
                      return "aqua";
                    case "Destroying":
                      return "fg.error";
                  }
                })(),
              }}
            >
              {asset.status.type}
            </Table.Cell>
            <Table.Cell
              className={css({ maxWidth: "20rem", overflow: "auto" })}
            >
              <AccountListItem address={asset!.owner} />
            </Table.Cell>
          </Table.Row>
        );
      })}
    </Table.Body>
  );
}
