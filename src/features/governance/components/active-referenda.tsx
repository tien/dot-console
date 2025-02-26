import { ReferendumDiscussionLink } from "./referendum-discussion-link";
import type { PreimagesBounded } from ".papi/descriptors/dist";
import { idle } from "@reactive-dot/core";
import {
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
  useTypedApi,
} from "@reactive-dot/react";
import CloseIcon from "@w3f/polkadot-icons/solid/Close";
import { atom } from "jotai";
import { useAtomValue } from "jotai-suspense";
import type { Binary, ChainDefinition, TypedApi } from "polkadot-api";
import { Suspense, use } from "react";
import { css } from "styled-system/css";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { CodecView } from "~/components/codec-view";
import { Badge } from "~/components/ui/badge";
import { Code } from "~/components/ui/code";
import { Dialog } from "~/components/ui/dialog";
import { Heading } from "~/components/ui/heading";
import { HoverCard } from "~/components/ui/hover-card";
import { IconButton } from "~/components/ui/icon-button";
import * as Progress from "~/components/ui/styled/progress";
import { Table } from "~/components/ui/table";
import { AccountListItem } from "~/features/accounts/components/account-list-item";
import { useGovernanceChainId } from "~/hooks/chain";
import { range } from "~/utils";
import { atomFamily } from "~/utils/atom-family";
import { objectId } from "~/utils/object-id";

export function ActiveReferenda() {
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

  const activeRefRange = range(
    referendumCount - activeReferendumCount,
    referendumCount,
  );

  const activeReferenda = useLazyLoadQuery(
    (builder) =>
      builder.readStorages(
        "Referenda",
        "ReferendumInfoFor",
        activeRefRange.map((number) => [number] as const),
      ),
    { chainId: useGovernanceChainId() },
  );

  const activeRefByTrack = Object.groupBy(
    activeReferenda
      .map((ref, index) => ({ ref, number: activeRefRange.at(index)! }))
      .filter((ref) => ref.ref?.type === "Ongoing")
      .map((ref) => ({
        ...(ref.ref?.type === "Ongoing" ? ref.ref.value : ({} as never)),
        number: ref.number,
      })),
    (ref) => ref.track,
  );

  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header>Number</Table.Header>
          <Table.Header whiteSpace="nowrap">Submitted at</Table.Header>
          <Table.Header>Proposer</Table.Header>
          <Table.Header>Proposed</Table.Header>
          <Table.Header>Discussion</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header>Tally</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {Object.entries(activeRefByTrack).map(([trackNumber, refs]) => (
          <Suspense key={trackNumber}>
            <ReferendaTrack
              number={Number(trackNumber)}
              refNumbers={refs?.map((ref) => ref.number) ?? []}
            />
          </Suspense>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

type ReferendaTrackProps = ReferendumProps & {
  refNumbers: number[];
};

function ReferendaTrack({ number, refNumbers }: ReferendaTrackProps) {
  return (
    <>
      <Table.Row>
        <Table.Header
          colSpan={7}
          className={css({ backgroundColor: "bg.default" })}
        >
          <Heading as="h3" size="xl">
            Track {number.toLocaleString()}
          </Heading>
        </Table.Header>
      </Table.Row>
      {refNumbers
        .toSorted((a, b) => b - a)
        .map((number) => (
          <ReferendumRow key={number} number={number} />
        ))}
    </>
  );
}

type ReferendumProps = {
  number: number;
};

function ReferendumRow({ number }: ReferendumProps) {
  const info = useLazyLoadQuery(
    (builder) =>
      builder.readStorage("Referenda", "ReferendumInfoFor", [number]),
    { chainId: useGovernanceChainId() },
  );

  if (info === undefined) {
    return null;
  }

  switch (info.type) {
    case "Approved":
    case "Cancelled":
    case "Killed":
    case "Rejected":
    case "TimedOut":
      return null;
    case "Ongoing":
      return (
        <Table.Row>
          <Table.Cell>{number.toLocaleString()}</Table.Cell>
          <Table.Cell>{info.value.submitted.toLocaleString()}</Table.Cell>
          <Table.Cell>
            <AccountListItem address={info.value.submission_deposit.who} />
          </Table.Cell>
          <Table.Cell>
            <Suspense fallback={<CircularProgressIndicator />}>
              <ReferendaCall proposal={info.value.proposal} />
            </Suspense>
          </Table.Cell>
          <Table.Cell>
            <ReferendumDiscussionLink number={number} />
          </Table.Cell>
          <Table.Cell>
            <Badge
              variant="solid"
              colorPalette={
                info.value.deciding === undefined
                  ? "violet"
                  : info.value.deciding.confirming !== undefined
                    ? "success"
                    : "info"
              }
            >
              {info.value.deciding === undefined
                ? "Preparing"
                : info.value.deciding.confirming !== undefined
                  ? "Confirming"
                  : "Deciding"}
            </Badge>
          </Table.Cell>
          <Table.Cell minWidth="6rem">
            <Tally
              ayes={info.value.tally.ayes}
              nays={info.value.tally.nays}
              support={info.value.tally.support}
            />
          </Table.Cell>
        </Table.Row>
      );
  }
}

type TallyProps = { ayes: bigint; nays: bigint; support: bigint };

function Tally({ ayes: _ayes, nays: _nays, support: _support }: TallyProps) {
  const ayes = useNativeTokenAmountFromPlanck(_ayes);
  const nays = useNativeTokenAmountFromPlanck(_nays);
  const ayesPercent =
    ayes.planck === 0n && nays.planck === 0n
      ? 0.5
      : ayes.planck === 0n
        ? 0
        : ayes.valueOf() / (ayes.valueOf() + nays.valueOf());

  const support = useNativeTokenAmountFromPlanck(_support);

  return (
    <HoverCard.Root openDelay={100}>
      <HoverCard.Trigger asChild>
        <div
          className={css({
            display: "grid",
            gridTemplateAreas: "'this'",
            "&>*": { gridArea: "this" },
          })}
        >
          <Progress.Root value={ayesPercent * 100} min={0} max={100}>
            <Progress.Track backgroundColor="error.default">
              <Progress.Range colorPalette="success" />
            </Progress.Track>
          </Progress.Root>
          <div
            className={css({
              width: "stretch",
              pointerEvents: "none",
            })}
          >
            <div
              className={css({
                margin: "auto",
                width: "1.5px",
                height: "100%",
                backgroundColor: "fg.default",
              })}
            />
          </div>
        </div>
      </HoverCard.Trigger>

      <HoverCard.Positioner>
        <HoverCard.Content>
          <HoverCard.Arrow>
            <HoverCard.ArrowTip />
          </HoverCard.Arrow>
          <dl
            className={css({
              "& dt": { fontWeight: "bold" },
              "& dd + dt": { marginTop: "0.5em" },
            })}
          >
            <dt>Ayes</dt>
            <dd>
              {ayes.toLocaleString(undefined, { notation: "compact" })} ≈{" "}
              {ayesPercent.toLocaleString(undefined, { style: "percent" })}
            </dd>
            <dt>Nays</dt>
            <dd>
              {nays.toLocaleString(undefined, { notation: "compact" })} ≈{" "}
              {(1 - ayesPercent).toLocaleString(undefined, {
                style: "percent",
              })}
            </dd>
            <dt>Support</dt>
            <dd>
              {support.toLocaleString(undefined, { notation: "compact" })}
            </dd>
          </dl>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  );
}

type ReferendaCallProps = {
  proposal: PreimagesBounded;
};

function ReferendaCall({ proposal }: ReferendaCallProps) {
  if (proposal.type === "Legacy") {
    throw new Error("Legacy proposals can't be resolved");
  }

  const storagePreimage = useLazyLoadQuery(
    (builder) =>
      proposal.type !== "Lookup"
        ? undefined
        : builder.readStorage("Preimage", "PreimageFor", [
            [proposal.value.hash, proposal.value.len],
          ]),
    { chainId: useGovernanceChainId() },
  );

  const api = useTypedApi({ chainId: useGovernanceChainId() });

  const preimage =
    proposal.type === "Inline"
      ? proposal.value
      : storagePreimage === idle
        ? undefined
        : storagePreimage;

  const callPromise = useAtomValue(
    preimage === undefined ? atom(undefined) : callDataAtom(preimage, api),
  );

  if (callPromise === undefined) {
    return "N/A";
  }

  return <SuspendableReferendumCall callPromise={callPromise} />;
}

const callDataAtom = atomFamily(
  (preimage: Binary, api: TypedApi<ChainDefinition>) =>
    atom(() => api.txFromCallData(preimage).then((tx) => tx.decodedCall)),
  (preimage, api) => [preimage.asHex(), objectId(api)].join(),
);

type SuspendableReferendumCallProps = {
  callPromise: Promise<{
    type: string;
    value: {
      type: string;
      value: unknown;
    };
  }>;
};

function SuspendableReferendumCall({
  callPromise,
}: SuspendableReferendumCallProps) {
  const call = use(callPromise);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Code size="sm" cursor="pointer">
          {call.type}.{call.value.type}
        </Code>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          padding="2rem"
          width="min(100dvw, 50rem)"
          maxHeight="100dvh"
          overflow="auto"
        >
          <Dialog.Title marginBottom="1rem">
            <Heading>Decoded call</Heading>
          </Dialog.Title>
          <CodecView value={call} className={css({ overflow: "auto" })} />
          <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
            <IconButton variant="ghost" size="sm">
              <CloseIcon fill="currentcolor" />
            </IconButton>
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
