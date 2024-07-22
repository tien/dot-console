import type config from "./config";
import type { polkadot } from "@polkadot-api/descriptors";
import type { InferChains } from "@reactive-dot/core";

declare module "@reactive-dot/core" {
  export interface Chains extends InferChains<typeof config> {}
}
