import { type AssetId, getAssetId, NATIVE_ASSET_ID } from "../utils";
import type { polkadot_asset_hub } from "@polkadot-api/descriptors";
import { idle, Query } from "@reactive-dot/core";
import {
  ChainProvider,
  QueryOptionsProvider,
  QueryRenderer,
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import { DenominatedNumber } from "@reactive-dot/utils";
import CloseIcon from "@w3f/polkadot-icons/solid/Close";
import { Suspense, useDeferredValue, useMemo } from "react";
import { InView } from "react-intersection-observer";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { CodecView } from "~/components/codec-view";
import { Code } from "~/components/ui/code";
import { Dialog } from "~/components/ui/dialog";
import { IconButton } from "~/components/ui/icon-button";
import { Table } from "~/components/ui/table";
import { AccountListItem } from "~/features/accounts/components/account-list-item";
import { useAssetHubChainId } from "~/hooks/chain";
import { stringifyCodec } from "~/utils";

export function AssetList() {
  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header>Id</Table.Header>
          <Table.Header>Name</Table.Header>
          <Table.Header>Supply</Table.Header>
          <Table.Header>TVL</Table.Header>
          <Table.Header>Holders</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header>Owner</Table.Header>
        </Table.Row>
      </Table.Head>
      <Suspense
        fallback={
          <Table.Foot>
            <Table.Row>
              <Table.Cell colSpan={7}>
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
        .storageEntries("Assets", "Asset")
        .storageEntries("ForeignAssets", "Asset"),
    { chainId: assetHubChainId },
  );

  const assets = useMemo(
    () =>
      [...nativeAssets, ...foreignAssets].toSorted(
        ([_, a], [__, b]) => b.accounts - a.accounts,
      ),
    [foreignAssets, nativeAssets],
  );

  return (
    <Table.Body>
      {assets.map(([[id], asset]) => {
        const query = new Query<[], typeof polkadot_asset_hub>();
        const metadataQuery =
          typeof id === "number"
            ? query.storage("Assets", "Metadata", [id])
            : query.storage("ForeignAssets", "Metadata", [id]);

        return (
          <InView key={stringifyCodec(id)}>
            {({ ref, inView }) => (
              <QueryOptionsProvider active={inView}>
                <Table.Row ref={ref}>
                  <Table.Cell>
                    {typeof id === "number" ? (
                      id
                    ) : (
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <Code cursor="pointer">MultiLocation</Code>
                        </Dialog.Trigger>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                          <Dialog.Content
                            padding="2rem"
                            width="min(100dvw, 50rem)"
                            maxHeight="100dvh"
                            overflow="auto"
                          >
                            <Dialog.Title marginBottom="1em">
                              MultiLocation
                            </Dialog.Title>
                            <CodecView
                              value={id}
                              className={css({ overflow: "auto" })}
                            />
                            <Dialog.CloseTrigger
                              asChild
                              position="absolute"
                              top="2"
                              right="2"
                            >
                              <IconButton variant="ghost" size="sm">
                                <CloseIcon fill="currentcolor" />
                              </IconButton>
                            </Dialog.CloseTrigger>
                          </Dialog.Content>
                        </Dialog.Positioner>
                      </Dialog.Root>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Suspense
                      fallback={<CircularProgressIndicator size="text" />}
                    >
                      <QueryRenderer
                        chainId={assetHubChainId}
                        query={metadataQuery}
                      >
                        {(metadata) => metadata.name.asText()}
                      </QueryRenderer>
                    </Suspense>
                  </Table.Cell>
                  <Table.Cell className={css({ maxWidth: "15rem" })}>
                    <div className={css({ overflow: "auto" })}>
                      <Suspense
                        fallback={<CircularProgressIndicator size="text" />}
                      >
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
                    <Suspense
                      fallback={<CircularProgressIndicator size="text" />}
                    >
                      <AssetTvl id={id} />
                    </Suspense>
                  </Table.Cell>
                  <Table.Cell>{asset.accounts.toLocaleString()}</Table.Cell>
                  <Table.Cell
                    style={{
                      color: (() => {
                        switch (asset.status.type) {
                          case "Live":
                            return token.var("colors.success.text");
                          case "Frozen":
                            return token.var("colors.warning.text");
                          case "Destroying":
                            return token.var("colors.error.text");
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
              </QueryOptionsProvider>
            )}
          </InView>
        );
      })}
    </Table.Body>
  );
}

type AssetTvlProps = { id: AssetId };

function AssetTvl({ id }: AssetTvlProps) {
  const poolId = useLazyLoadQuery(
    (builder) =>
      builder.storage("AssetConversion", "Pools", [
        [NATIVE_ASSET_ID, getAssetId(id)],
      ]),
    { chainId: useAssetHubChainId() },
  );

  const poolAsset = useLazyLoadQuery(
    (builder) =>
      poolId !== undefined && builder.storage("PoolAssets", "Asset", [poolId]),
    { chainId: useAssetHubChainId() },
  );

  const poolOwnerAsset = useDeferredValue(
    useLazyLoadQuery(
      (builder) =>
        poolAsset !== idle &&
        poolAsset !== undefined &&
        (typeof id === "number"
          ? builder.storage("Assets", "Account", [id, poolAsset.owner])
          : builder.storage("ForeignAssets", "Account", [id, poolAsset.owner])),
      { chainId: useAssetHubChainId() },
    ),
  );

  const tvl = useLazyLoadQuery(
    (builder) =>
      poolOwnerAsset !== idle &&
      poolOwnerAsset !== undefined &&
      builder.runtimeApi(
        "AssetConversionApi",
        "quote_price_tokens_for_exact_tokens",
        [NATIVE_ASSET_ID, getAssetId(id), poolOwnerAsset.balance, false],
      ),
    { chainId: useAssetHubChainId() },
  );

  const nativeTokenAmountFromPlank = useNativeTokenAmountFromPlanck();

  return tvl === idle || tvl === undefined
    ? "N/A"
    : nativeTokenAmountFromPlank(tvl).toLocaleString();
}
