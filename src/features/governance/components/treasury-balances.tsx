import { useLazyLoadQuery, useSpendableBalance } from "@reactive-dot/react";
import { DenominatedNumber } from "@reactive-dot/utils";
import { AccountId, Binary } from "polkadot-api";
import { Suspense } from "react";
import { css } from "styled-system/css";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { Badge } from "~/components/ui/badge";
import { Heading } from "~/components/ui/heading";
import { useAssetHubChainId, useRelayChainId } from "~/hooks/chain";

export function TreasuryBalances() {
  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "0.5ch",
        padding: "1rem",
      })}
    >
      <header>
        <Heading as="h2" size="lg">
          Treasury
        </Heading>
      </header>
      <div className={css({ display: "flex", gap: "1em", flexWrap: "wrap" })}>
        <article>
          <header className={css({ marginBottom: "0.25em" })}>On Relay</header>
          <p>
            <Suspense fallback={<CircularProgressIndicator size="text" />}>
              <NativeBalance />
            </Suspense>
          </p>
        </article>
        <article>
          <header className={css({ marginBottom: "0.25em" })}>
            On Asset Hub
          </header>
          <Suspense fallback={<CircularProgressIndicator size="text" />}>
            <MaybeAssetHubBalances />
          </Suspense>
        </article>
      </div>
    </section>
  );
}

function NativeBalance() {
  const [ss58Prefix, treasuryPalletId] = useLazyLoadQuery(
    (builder) =>
      builder.constant("System", "SS58Prefix").constant("Treasury", "PalletId"),
    { chainId: useRelayChainId() },
  );

  const treasuryAccountBytes = new Uint8Array([
    ...Binary.fromText("modl").asBytes(),
    ...treasuryPalletId.asBytes(),
  ]);

  const treasuryAccount = AccountId(ss58Prefix).dec(
    Uint8Array.from(
      { length: 32 },
      (_, index) => treasuryAccountBytes.at(index) ?? 0,
    ),
  );

  return (
    <Balance
      value={useSpendableBalance(treasuryAccount, {
        chainId: useRelayChainId(),
      })}
    />
  );
}

function MaybeAssetHubBalances() {
  const treasuryAccount = useLazyLoadQuery(
    (builder) =>
      builder.runtimeApi("LocationToAccountApi", "convert_location", [
        {
          type: "V5",
          value: {
            parents: 1,
            interior: {
              type: "X1",
              value: { type: "PalletInstance", value: 19 },
            },
          },
        },
      ]),
    { chainId: useAssetHubChainId() },
  );

  return typeof treasuryAccount.value === "string" ? (
    <AssetHubBalances account={treasuryAccount.value} />
  ) : null;
}

type AssetHubBalancesProps = {
  account: string;
};

function AssetHubBalances({ account }: AssetHubBalancesProps) {
  const assets = useLazyLoadQuery(
    (builder) => builder.storageEntries("Assets", "Asset", []),
    { chainId: useAssetHubChainId() },
  );

  const _treasuryAssetHoldings = useLazyLoadQuery(
    (builder) =>
      builder.storages(
        "Assets",
        "Account",
        assets.map(([[assetId]]) => [assetId, account] as const),
      ),
    { chainId: useAssetHubChainId() },
  );

  const treasuryAssetHoldings = _treasuryAssetHoldings
    .map(
      (holding, index) =>
        [assets.at(index)![0][0], holding?.balance ?? 0n] as const,
    )
    .filter((x) => x[1] > 0n);

  return (
    <ul className={css({ display: "flex", gap: "0.5ch", flexWrap: "wrap" })}>
      {treasuryAssetHoldings.map(([assetId, balance]) => (
        // TODO: investigate why the suspense boundary is needed
        // flickers will happen without it
        <Suspense key={assetId}>
          <AssetBalance assetId={assetId} balance={balance} />
        </Suspense>
      ))}
    </ul>
  );
}

type AssetBalanceProps = {
  assetId: number;
  balance: bigint;
};

function AssetBalance({ assetId, balance }: AssetBalanceProps) {
  const metadata = useLazyLoadQuery(
    (builder) => builder.storage("Assets", "Metadata", [assetId]),
    { chainId: useAssetHubChainId() },
  );

  return (
    <Balance
      value={
        new DenominatedNumber(
          balance,
          metadata.decimals,
          metadata.symbol.asText(),
        )
      }
    />
  );
}

type BalanceProps = {
  value: DenominatedNumber;
};

function Balance({ value }: BalanceProps) {
  return (
    <Badge size="lg" fontWeight="medium">
      {value.toLocaleString(undefined, { notation: "compact" })}
    </Badge>
  );
}
