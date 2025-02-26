import { atom } from "jotai";
import { useAtomValue } from "jotai-suspense";
import { useGovernanceChainId } from "~/hooks/chain";
import { atomFamily } from "~/utils/atom-family";

export function useReferendumOffChainDiscussion(referendaNumber: number) {
  const chainId = useGovernanceChainId();

  return useAtomValue(offchainDiscussionDataAtom(chainId, referendaNumber));
}

const offchainDiscussionDataAtom = atomFamily(
  (chainId: ReturnType<typeof useGovernanceChainId>, referendaNumber: number) =>
    atom(async () => {
      const baseUrl = (() => {
        switch (chainId) {
          case "polkadot":
            return new URL(`https://polkadot.subsquare.io`);
          case "kusama":
            return new URL("https://kusama.subsquare.io");
          case "paseo":
            return new URL("https://paseo.subsquare.io");
          case "westend":
            return new URL("https://westend.subsquare.io");
        }
      })();

      return fetch(new URL(`/api/gov2/referendums/${referendaNumber}`, baseUrl))
        .then(
          (response) =>
            response.json() as Promise<{ title: string; content: string }>,
        )
        .then((data) => ({
          ...data,
          url: new URL(`/referenda/${referendaNumber}`, baseUrl),
        }));
    }),
);
