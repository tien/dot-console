import { useStakingChainId } from "../../../hooks/chain";
import { idle } from "@reactive-dot/core";
import {
  useBlock,
  useChainId,
  useClient,
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import { differenceInMilliseconds, formatDuration } from "date-fns";
import { useEffect, useState } from "react";
import { InfoHeader } from "~/components/info-header";

export type StatisticsProps = {
  className?: string | undefined;
};

export function Statistics({ className }: StatisticsProps) {
  const totalIssuance = useLazyLoadQuery((builder) =>
    builder.storage("Balances", "TotalIssuance", []),
  );

  return (
    <InfoHeader className={className}>
      <InfoHeader.Item title="Block time">
        <BlockTime />
      </InfoHeader.Item>
      <InfoHeader.Item title="Total issuance">
        {useNativeTokenAmountFromPlanck(totalIssuance).toLocaleString()}
      </InfoHeader.Item>
      <TotalStaked />
      <InfoHeader.Item title="Last finalised block">
        <FinalizedBlockNumber />
      </InfoHeader.Item>
      <InfoHeader.Item title="Last best block">
        <BestBlockNumber />
      </InfoHeader.Item>
    </InfoHeader>
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
        : builder.constant("Babe", "ExpectedBlockTime"),
    { chainId: babeChainId! },
  );

  const auraSlotDuration = useLazyLoadQuery(
    (builder) =>
      auraChainId === undefined
        ? undefined
        : builder.runtimeApi("AuraApi", "slot_duration", []),
    { chainId: auraChainId! },
  );

  const expectedBlockTime =
    expectedBabeBlockTime !== idle
      ? expectedBabeBlockTime
      : auraSlotDuration !== idle
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

  const [lastBestBlockNumber, setLastBestBlockNumber] = useState<number>();

  useEffect(() => {
    const subscription = client.bestBlocks$.subscribe({
      next: (bestBlocks) => setLastBestBlockNumber(bestBlocks.at(0)!.number),
    });

    return () => subscription.unsubscribe();
  }, [client.bestBlocks$]);

  const [lastBlockTime, setLastBlockTime] = useState(new Date());

  useEffect(() => {
    setLastBlockTime(new Date());
  }, [lastBestBlockNumber]);

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
    (builder) => builder.storage("Staking", "ActiveEra", []),
    { chainId: stakingChainId },
  );

  const queryResult = useLazyLoadQuery(
    (builder) =>
      activeEra === undefined
        ? false
        : builder
            .storage("Staking", "ErasTotalStake", [activeEra.index])
            .storage("NominationPools", "TotalValueLocked", []),
    { chainId: stakingChainId },
  );

  return (
    <InfoHeader.Item
      title={`Total staked ${chainId !== stakingChainId && `@ relay-chain`}`}
    >
      {useNativeTokenAmountFromPlanck(
        queryResult === idle ? 0n : queryResult[0] + queryResult[1],
        { chainId: stakingChainId },
      ).toLocaleString()}
    </InfoHeader.Item>
  );
}
