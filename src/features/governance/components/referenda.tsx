import { useReferendumOffChainDiscussion } from "../hooks/use-referendum-off-chain-discussion";
import { Tally } from "./tally";
import type { PreimagesBounded } from ".papi/descriptors/dist";
import { idle } from "@reactive-dot/core";
import {
  QueryOptionsProvider,
  useLazyLoadQuery,
  useTypedApi,
} from "@reactive-dot/react";
import CloseIcon from "@w3f/polkadot-icons/solid/Close";
import {
  differenceInDays,
  intlFormatDistance,
  subMilliseconds,
} from "date-fns";
import { atom } from "jotai";
import { useAtomValue } from "jotai-suspense";
import type { Binary, ChainDefinition, TypedApi } from "polkadot-api";
import { Suspense, use, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "react-intersection-observer";
import { css } from "styled-system/css";
import { Center } from "styled-system/jsx";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { CodecView } from "~/components/codec-view";
import { Badge } from "~/components/ui/badge";
import { Code } from "~/components/ui/code";
import { Dialog } from "~/components/ui/dialog";
import { IconButton } from "~/components/ui/icon-button";
import { Link } from "~/components/ui/link";
import { Table } from "~/components/ui/table";
import { AccountListItem } from "~/features/accounts/components/account-list-item";
import { useGovernanceChainId } from "~/hooks/chain";
import { range } from "~/utils";
import { atomFamily } from "~/utils/atom-family";
import { objectId } from "~/utils/object-id";

export function ReferendaTable() {
  const referendumCount = useLazyLoadQuery(
    (builder) => builder.storage("Referenda", "ReferendumCount", []),
    {
      chainId: useGovernanceChainId(),
    },
  );

  return (
    <Table.Root>
      <Table.Head>
        <Table.Row className={css({ "&>th": { whiteSpace: "nowrap" } })}>
          <Table.Header>Number</Table.Header>
          <Table.Header>Track</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header>Since</Table.Header>
          <Table.Header>Discussion</Table.Header>
          <Table.Header>Proposer</Table.Header>
          <Table.Header>Proposed</Table.Header>
          <Table.Header minWidth="6rem">Tally</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body
        className={css({
          "&> tr": {
            "&> td:nth-child(1)": { fontWeight: "bold" },
            "&> td:nth-child(3)": { whiteSpace: "nowrap" },
            "&> td:nth-last-child(3)": { maxWidth: "16rem" },
          },
        })}
      >
        {range(0, referendumCount)
          .toReversed()
          .map((number) => (
            <LazyReferendaRow key={number} number={number} />
          ))}
      </Table.Body>
    </Table.Root>
  );
}

type ReferendumProps = {
  number: number;
};

function LazyReferendaRow({ number }: ReferendumProps) {
  const [inViewOnce, setInViewOnce] = useState(false);
  const [ref, inView] = useInView({
    delay: 100,
    onChange: (inView) => {
      if (inView) {
        setInViewOnce(true);
      }
    },
  });

  return (
    <Table.Row ref={ref}>
      <ErrorBoundary
        fallback={
          <>
            <Table.Cell>{number.toLocaleString()}</Table.Cell>
            <Table.Cell colSpan={7}>Failed to load referendum</Table.Cell>
          </>
        }
      >
        <Suspense
          fallback={
            <>
              <Table.Cell>{number.toLocaleString()}</Table.Cell>
              <Table.Cell colSpan={7}>
                <Center>
                  <CircularProgressIndicator />
                </Center>
              </Table.Cell>
            </>
          }
        >
          {!inViewOnce ? (
            <>
              <Table.Cell>{number.toLocaleString()}</Table.Cell>
              <Table.Cell colSpan={7} />
            </>
          ) : (
            <QueryOptionsProvider active={inView}>
              <ReferendumRow number={number} />
            </QueryOptionsProvider>
          )}
        </Suspense>
      </ErrorBoundary>
    </Table.Row>
  );
}

function ReferendumRow({ number }: ReferendumProps) {
  const offChainDataPromise = useReferendumOffChainDiscussion(number);

  const [tracks, info] = useLazyLoadQuery(
    (builder) =>
      builder
        .constant("Referenda", "Tracks")
        .storage("Referenda", "ReferendumInfoFor", [number]),
    { chainId: useGovernanceChainId() },
  );

  if (info === undefined) {
    throw new Error("Referendum info is not available");
  }

  switch (info.type) {
    case "Ongoing": {
      const _trackName = tracks
        .map((track) =>
          Array.isArray(track) ? { id: track[0], info: track[1] } : track,
        )
        .find((track) => track.id === info.value.track)?.info.name;

      const trackName =
        _trackName === undefined
          ? info.value.track.toLocaleString()
          : typeof _trackName === "string"
            ? _trackName
            : _trackName.asText();

      return (
        <>
          <Table.Cell>{number.toLocaleString()}</Table.Cell>
          <Table.Cell>
            <Code size="sm">{trackName}</Code>
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
          <Table.Cell>
            <SubmissionDate blockNumber={info.value.submitted} />
          </Table.Cell>
          <Table.Cell>
            <ReferendumDiscussionLink
              offChainDataPromise={offChainDataPromise}
            />
          </Table.Cell>
          <Table.Cell>
            <AccountListItem address={info.value.submission_deposit.who} />
          </Table.Cell>
          <Table.Cell>
            <ReferendaCall proposal={info.value.proposal} />
          </Table.Cell>
          <Table.Cell>
            <Tally
              ayes={info.value.tally.ayes}
              nays={info.value.tally.nays}
              support={info.value.tally.support}
            />
          </Table.Cell>
        </>
      );
    }
    case "Approved":
    case "Cancelled":
    case "Killed":
    case "Rejected":
    case "TimedOut": {
      const offChainData = use(offChainDataPromise);

      const [at, proposer] =
        typeof info.value === "number"
          ? ([info.value, undefined] as const)
          : info.value;

      return (
        <>
          <Table.Cell>{number.toLocaleString()}</Table.Cell>
          <Table.Cell>
            <Code size="sm">
              {offChainData.trackInfo.name ??
                offChainData.trackInfo.id.toLocaleString()}
            </Code>
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
          <Table.Cell>
            <SubmissionDate blockNumber={at} />
          </Table.Cell>
          <Table.Cell>
            <ReferendumDiscussionLink
              offChainDataPromise={offChainDataPromise}
            />
          </Table.Cell>
          <Table.Cell>
            <AccountListItem
              address={
                proposer === undefined ? offChainData.proposer : proposer.who
              }
            />
          </Table.Cell>
          <Table.Cell>
            {offChainData.onchainData.proposal?.call === undefined ? (
              <NoCalldata />
            ) : (
              <CallData
                section={offChainData.onchainData.proposal.call.section}
                method={offChainData.onchainData.proposal.call.method}
                call={offChainData.onchainData.proposal.call}
              />
            )}
          </Table.Cell>
          <Table.Cell minWidth="6rem">
            <Tally
              ayes={BigInt(offChainData.onchainData.tally.ayes)}
              nays={BigInt(offChainData.onchainData.tally.nays)}
              support={BigInt(offChainData.onchainData.tally.support)}
            />
          </Table.Cell>
        </>
      );
    }
  }
}

type SubmissionDateProps = {
  blockNumber: number;
};

function SubmissionDate({ blockNumber }: SubmissionDateProps) {
  const [expectedBlockTime, currentBlock] = useLazyLoadQuery(
    (builder) =>
      builder
        .constant("Babe", "ExpectedBlockTime")
        .storage("System", "Number", []),
    { chainId: useGovernanceChainId() },
  );

  const msAgo = (currentBlock - blockNumber) * Number(expectedBlockTime);
  const submissionDate = subMilliseconds(new Date(), msAgo);

  if (differenceInDays(new Date(), submissionDate) >= 1) {
    return submissionDate.toLocaleDateString();
  }

  return intlFormatDistance(submissionDate, new Date());
}

type ReferndumDiscussionLinkProps = {
  offChainDataPromise: ReturnType<typeof useReferendumOffChainDiscussion>;
};

export function ReferendumDiscussionLink({
  offChainDataPromise,
}: ReferndumDiscussionLinkProps) {
  const { url, title } = use(offChainDataPromise);
  return (
    <Link href={url.toString()} target="_blank">
      {title || (
        <span className={css({ color: "warning.text" })}>Missing title</span>
      )}
    </Link>
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
        : builder.storage("Preimage", "PreimageFor", [
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
    return <NoCalldata />;
  }

  const callData = use(callPromise);

  return (
    <CallData
      section={callData.type}
      method={callData.value.type}
      call={callData}
    />
  );
}

type CallDataProps = {
  section: string;
  method: string;
  call: unknown;
};

function CallData({ section, method, call }: CallDataProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Code size="sm" cursor="pointer">
          {section}.{method}
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
          <Dialog.Title marginBottom="1rem">Decoded call</Dialog.Title>
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

function NoCalldata() {
  return (
    <span className={css({ color: "warning.text" })}>Missing call data</span>
  );
}

const callDataAtom = atomFamily(
  (preimage: Binary, api: TypedApi<ChainDefinition>) =>
    atom(() => api.txFromCallData(preimage).then((tx) => tx.decodedCall)),
  (preimage, api) => [preimage.asHex(), objectId(api)].join(),
);
