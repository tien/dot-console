import { getLookupFn } from "@polkadot-api/metadata-builders";
import { metadata as metadataCodec } from "@polkadot-api/substrate-bindings";
import { useLazyLoadQuery } from "@reactive-dot/react";

export function useLookup() {
  const rawMetadata = useLazyLoadQuery((builder) =>
    builder.callApi("Metadata", "metadata", []),
  );
  const { metadata } = metadataCodec.dec(rawMetadata.asBytes());

  if (metadata.tag !== "v14" && metadata.tag !== "v15") {
    throw new Error();
  }

  return getLookupFn(metadata.value);
}
