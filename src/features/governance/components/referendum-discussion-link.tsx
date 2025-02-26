import { useReferendumOffChainDiscussion } from "../hooks/use-referendum-off-chain-discussion";
import { Suspense, use } from "react";
import { css } from "styled-system/css";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { Link } from "~/components/ui/link";

type ReferendumProps = {
  number: number;
};

export function ReferendumDiscussionLink({ number }: ReferendumProps) {
  return (
    <Suspense fallback={<CircularProgressIndicator />}>
      <SuspendableReferndumDiscussionLink
        dataPromise={useReferendumOffChainDiscussion(number)}
      />
    </Suspense>
  );
}

type SuspendableReferndumDiscussionLinkProps = {
  dataPromise: ReturnType<typeof useReferendumOffChainDiscussion>;
};

export function SuspendableReferndumDiscussionLink({
  dataPromise,
}: SuspendableReferndumDiscussionLinkProps) {
  const data = use(dataPromise);
  return (
    <Link href={data.url.toString()} target="_blank">
      {data.title || (
        <span className={css({ color: "warning.text" })}>NO TITLE</span>
      )}
    </Link>
  );
}
