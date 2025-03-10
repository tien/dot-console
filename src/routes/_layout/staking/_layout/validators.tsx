import {
  ChainProvider,
  QueryOptionsProvider,
  QueryRenderer,
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { Center } from "styled-system/jsx";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { InfoHeader } from "~/components/info-header";
import { Table } from "~/components/ui/table";
import { AccountListItem } from "~/features/accounts/components/account-list-item";
import { useStakingChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/staking/_layout/validators")({
  component: ValidatorsPage,
});

function ValidatorsPage() {
  return (
    <ChainProvider chainId={useStakingChainId()}>
      <InfoHeader>
        <InfoHeader.Item title="Total staked">
          <Suspense fallback={<CircularProgressIndicator />}>
            <SuspendableTotalStaked />
          </Suspense>
        </InfoHeader.Item>
        <InfoHeader.Item title="Active validators">
          <Suspense fallback={<CircularProgressIndicator />}>
            <SuspendableActiveValidators />
          </Suspense>
        </InfoHeader.Item>
        <InfoHeader.Item title="Total validators">
          <Suspense fallback={<CircularProgressIndicator />}>
            <SuspendableTotalValidators />
          </Suspense>
        </InfoHeader.Item>
        <InfoHeader.Item title="Nominators">
          <Suspense fallback={<CircularProgressIndicator />}>
            <QueryRenderer
              chainId={useStakingChainId()}
              query={(builder) =>
                builder.readStorage("Staking", "CounterForNominators", [])
              }
            >
              {(count) => count.toLocaleString()}
            </QueryRenderer>
          </Suspense>
        </InfoHeader.Item>
      </InfoHeader>
      <ValidatorList />
    </ChainProvider>
  );
}

function SuspendableActiveValidators() {
  const [activeEra, idealValidatorCount] = useLazyLoadQuery(
    (builder) =>
      builder
        .readStorage("Staking", "ActiveEra", [])
        .readStorage("Staking", "ValidatorCount", []),
    { chainId: useStakingChainId() },
  );

  const stakers = useLazyLoadQuery(
    (builder) =>
      builder.readStorageEntries("Staking", "ErasStakersOverview", [
        activeEra?.index ?? 0,
      ]),
    { chainId: useStakingChainId() },
  );

  return `${stakers.length.toLocaleString()} / ${idealValidatorCount.toLocaleString()}`;
}

function SuspendableTotalValidators() {
  const [validatorCount, maxValidatorCount] = useLazyLoadQuery(
    (builder) =>
      builder
        .readStorage("Staking", "CounterForValidators", [])
        .readStorage("Staking", "MaxValidatorsCount", []),
    { chainId: useStakingChainId() },
  );

  return `${validatorCount.toLocaleString()} / ${maxValidatorCount?.toLocaleString()}`;
}

function SuspendableTotalStaked() {
  const activeEra = useLazyLoadQuery(
    (builder) => builder.readStorage("Staking", "ActiveEra", []),
    { chainId: useStakingChainId() },
  );

  const totalStaked = useLazyLoadQuery(
    (builder) =>
      activeEra !== undefined &&
      builder.readStorage("Staking", "ErasTotalStake", [activeEra.index]),
    { chainId: useStakingChainId() },
  );

  return useNativeTokenAmountFromPlanck(
    typeof totalStaked !== "bigint" ? 0n : totalStaked,
    { chainId: useStakingChainId() },
  ).toLocaleString();
}

function ValidatorList() {
  return (
    <Suspense
      fallback={
        <Center>
          <CircularProgressIndicator label="Loading validators" />
        </Center>
      }
    >
      <SuspendableValidatorList />
    </Suspense>
  );
}

function SuspendableValidatorList() {
  const activeEra = useLazyLoadQuery(
    (builder) => builder.readStorage("Staking", "ActiveEra", []),
    { chainId: useStakingChainId() },
  );

  const validators = useLazyLoadQuery(
    (builder) =>
      builder.readStorageEntries("Staking", "ErasStakersOverview", [
        activeEra?.index ?? 0,
      ]),
    { chainId: useStakingChainId() },
  );

  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header>Validator</Table.Header>
          <Table.Header>Validator self staked</Table.Header>
          <Table.Header>Total staked</Table.Header>
          <Table.Header>Nominators</Table.Header>
          <Table.Header>Commission</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {validators.map(([[_, address]]) => (
          <ValidatorRow key={address} address={address} />
        ))}
      </Table.Body>
    </Table.Root>
  );
}

type ValidatorProps = {
  address: string;
};

function ValidatorRow(props: ValidatorProps) {
  const [ref, inView] = useInView();

  return (
    <Table.Row ref={ref}>
      <QueryOptionsProvider active={inView}>
        <Suspense
          fallback={
            <>
              <Table.Cell>
                <AccountListItem address={props.address} />
              </Table.Cell>
              <Table.Cell colSpan={4}>
                <Center>
                  <CircularProgressIndicator />
                </Center>
              </Table.Cell>
            </>
          }
        >
          <SuspendableValidatorRow {...props} />
        </Suspense>
      </QueryOptionsProvider>
    </Table.Row>
  );
}

function SuspendableValidatorRow({ address }: ValidatorProps) {
  const [activeEra, preferences] = useLazyLoadQuery(
    (builder) =>
      builder
        .readStorage("Staking", "ActiveEra", [])
        .readStorage("Staking", "Validators", [address]),
    { chainId: useStakingChainId() },
  );

  const overview = useLazyLoadQuery(
    (builder) =>
      builder.readStorage("Staking", "ErasStakersOverview", [
        activeEra?.index ?? 0,
        address,
      ]),
    { chainId: useStakingChainId() },
  );

  const commission = useNativeTokenAmountFromPlanck(
    preferences.commission ?? 0,
  ).mapPlanck((planck) => planck * 10n);

  return (
    <>
      <Table.Cell>
        <AccountListItem address={address} />
      </Table.Cell>
      <Table.Cell>
        {useNativeTokenAmountFromPlanck(overview?.own ?? 0).toLocaleString()}
      </Table.Cell>
      <Table.Cell>
        {useNativeTokenAmountFromPlanck(overview?.total ?? 0).toLocaleString()}
      </Table.Cell>
      <Table.Cell>
        {(overview?.nominator_count ?? 0).toLocaleString()}
      </Table.Cell>
      <Table.Cell>
        {commission.valueOf().toLocaleString(undefined, { style: "percent" })}
      </Table.Cell>
    </>
  );
}
