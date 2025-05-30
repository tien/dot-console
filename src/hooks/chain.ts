import type { ChainId } from "@reactive-dot/core";
import { useChainId } from "@reactive-dot/react";

export function useBabeChainId() {
  const chainId = useChainId();

  return chainId === "kusama" ||
    chainId === "polkadot" ||
    chainId === "paseo" ||
    chainId === "westend"
    ? chainId
    : undefined;
}

export function useAuraChainId() {
  const chainId = useChainId();

  return chainId !== "kusama" &&
    chainId !== "polkadot" &&
    chainId !== "paseo" &&
    chainId !== "westend"
    ? chainId
    : undefined;
}

export function getRelayChainId(chainId: ChainId) {
  switch (chainId) {
    case "polkadot":
    case "polkadot_asset_hub":
    case "polkadot_collectives":
    case "polkadot_coretime":
    case "polkadot_people":
    case "acala":
    case "hydration":
      return "polkadot" satisfies ChainId;
    case "kusama":
    case "kusama_asset_hub":
    case "kusama_people":
      return "kusama" satisfies ChainId;
    case "westend":
    case "westend_asset_hub":
    case "westend_collectives":
    case "westend_people":
      return "westend" satisfies ChainId;
    case "paseo":
    case "paseo_asset_hub":
    case "paseo_people":
      return "paseo" satisfies ChainId;
  }
}

export function useRelayChainId() {
  return getRelayChainId(useChainId());
}

export function usePeopleChainId() {
  switch (useChainId()) {
    case "polkadot":
    case "polkadot_asset_hub":
    case "polkadot_collectives":
    case "polkadot_coretime":
    case "polkadot_people":
    case "acala":
    case "hydration":
      return "polkadot_people" satisfies ChainId;
    case "kusama":
    case "kusama_asset_hub":
    case "kusama_people":
      return "kusama_people" satisfies ChainId;
    case "westend":
    case "westend_asset_hub":
    case "westend_collectives":
    case "westend_people":
      return "westend_people" satisfies ChainId;
    case "paseo":
    case "paseo_asset_hub":
    case "paseo_people":
      return "paseo_people" satisfies ChainId;
  }
}

export function useGovernanceChainId() {
  switch (useChainId()) {
    case "polkadot":
    case "polkadot_asset_hub":
    case "polkadot_collectives":
    case "polkadot_coretime":
    case "polkadot_people":
    case "acala":
    case "hydration":
      return "polkadot" satisfies ChainId;
    case "kusama":
    case "kusama_asset_hub":
    case "kusama_people":
      return "kusama" satisfies ChainId;
    case "paseo":
    case "paseo_asset_hub":
    case "paseo_people":
      return "paseo" satisfies ChainId;
    case "westend":
    case "westend_asset_hub":
    case "westend_collectives":
    case "westend_people":
      return "westend" satisfies ChainId;
  }
}

export function useStakingChainId() {
  switch (useChainId()) {
    case "polkadot":
    case "polkadot_asset_hub":
    case "polkadot_collectives":
    case "polkadot_coretime":
    case "polkadot_people":
    case "acala":
    case "hydration":
      return "polkadot" satisfies ChainId;
    case "kusama":
    case "kusama_asset_hub":
    case "kusama_people":
      return "kusama" satisfies ChainId;
    case "paseo":
    case "paseo_asset_hub":
    case "paseo_people":
      return "paseo" satisfies ChainId;
    case "westend":
    case "westend_asset_hub":
    case "westend_collectives":
    case "westend_people":
      return "westend" satisfies ChainId;
  }
}

export function useAssetHubChainId() {
  switch (useChainId()) {
    case "polkadot":
    case "polkadot_asset_hub":
    case "polkadot_collectives":
    case "polkadot_coretime":
    case "polkadot_people":
    case "acala":
    case "hydration":
      return "polkadot_asset_hub" satisfies ChainId;
    case "kusama":
    case "kusama_asset_hub":
    case "kusama_people":
      return "kusama_asset_hub" satisfies ChainId;
    case "paseo":
    case "paseo_asset_hub":
    case "paseo_people":
      return "paseo_asset_hub" satisfies ChainId;
    case "westend":
    case "westend_asset_hub":
    case "westend_collectives":
    case "westend_people":
      return "westend_asset_hub" satisfies ChainId;
  }
}

export function useCollectivesChainId<TForce = true>(
  force: TForce = true as TForce,
) {
  switch (useChainId()) {
    case "polkadot":
    case "polkadot_asset_hub":
    case "polkadot_collectives":
    case "polkadot_coretime":
    case "polkadot_people":
    case "acala":
    case "hydration":
      return "polkadot_collectives" satisfies ChainId;
    case "westend":
    case "westend_asset_hub":
    case "westend_collectives":
    case "westend_people":
      return "westend_collectives" satisfies ChainId;
    default:
      if (force) {
        throw new Error("Unsupported chain");
      }

      return undefined;
  }
}
