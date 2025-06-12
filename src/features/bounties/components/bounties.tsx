import { useLazyLoadQuery } from "@reactive-dot/react";

function B() {
  const a = useLazyLoadQuery(
    (builder) => builder.storageEntries("Bounties", "Bounties"),
    {
      chainId: "polkadot",
    },
  );
}
