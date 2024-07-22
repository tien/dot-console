import { useMetadata } from "./metadata";
import { getLookupFn } from "@polkadot-api/metadata-builders";

export function useLookup() {
  return getLookupFn(useMetadata().value);
}
