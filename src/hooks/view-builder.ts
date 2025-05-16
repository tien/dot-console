import { useLookup } from "./lookup";
import { getViewBuilder } from "@polkadot-api/view-builder";
import { useCallback, useMemo } from "react";

export function useViewBuilder() {
  const lookup = useLookup();
  return useMemo(() => getViewBuilder(lookup), [lookup]);
}

export function useDefinitionBuilder() {
  const builder = useViewBuilder();
  return useCallback(
    (index: number) => builder.buildDefinition(index),
    [builder],
  );
}
