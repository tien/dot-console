import {
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings";
import { useLazyLoadQuery } from "@reactive-dot/react";

export function useMetadata() {
  const [v14, v15, v16] = useLazyLoadQuery((builder) =>
    builder
      .runtimeApi("Metadata", "metadata_at_version", [14])
      .runtimeApi("Metadata", "metadata_at_version", [15])
      .runtimeApi("Metadata", "metadata_at_version", [16]),
  );

  const latestMetadata = v16 ?? v15 ?? v14;

  if (latestMetadata === undefined) {
    throw new Error("Unsupported metadata version");
  }

  const { metadata } = metadataCodec.dec(latestMetadata.asBytes());

  return unifyMetadata(metadata);
}
