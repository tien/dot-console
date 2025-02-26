import { useMemo } from "react";
import { useGovernanceChainId } from "~/hooks/chain";

export function useReferendumOffChainDiscussion(referendaNumber: number) {
  const chainId = useGovernanceChainId();

  const baseUrl = useMemo(() => {
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
  }, [chainId]);

  return useMemo(
    () =>
      fetch(new URL(`/api/gov2/referendums/${referendaNumber}`, baseUrl))
        .then(
          (response) =>
            response.json() as Promise<{ title: string; content: string }>,
        )
        .then((data) => ({
          ...data,
          url: new URL(`/referenda/${referendaNumber}`, baseUrl),
        })),
    [baseUrl, referendaNumber],
  );
}
