import { nativeBalancesFields } from "../consts/native-balance-fields";
import { useLookup } from "./lookup";
import { getViewBuilder, type Shape } from "@polkadot-api/view-builder";
import { useCallback, useMemo } from "react";

export function useViewBuilder() {
  const lookup = useLookup();
  return useMemo(() => getViewBuilder(lookup), [lookup]);
}

export function useDefinitionBuilder() {
  const builder = useViewBuilder();
  return useCallback(
    (index: number, basePath?: string[]) => {
      const definition = builder.buildDefinition(index);

      // This is a war crime
      for (const path of nativeBalancesFields) {
        markShape(
          definition.shape,
          path,
          (shape) => nativeTokenShapes.add(shape),
          new WeakSet(),
        );

        if (
          basePath !== undefined &&
          path
            .slice(0, basePath.length)
            .every((parts, index) => parts === basePath[index])
        ) {
          markShape(
            definition.shape,
            path.slice(basePath.length),
            (shape) => nativeTokenShapes.add(shape),
            new WeakSet(),
            false,
          );
        }
      }

      return definition;
    },
    [builder],
  );
}

// The below are also literal crimes against humanity, please ignore.

const nativeTokenShapes = new WeakSet<Shape>();

export function isNativeTokenShape(
  shape: Shape,
): shape is { codec: "compactNumber" | "compactBn" | "u128" } {
  return nativeTokenShapes.has(shape);
}

function markShape(
  shape: Shape,
  targetPath: readonly string[],
  marker: (shape: Shape) => void,
  visited: WeakSet<Shape>,
  recurse = true,
) {
  if (visited.has(shape)) {
    return;
  }

  visited.add(shape);

  if (targetPath.length === 0) {
    return;
  }

  if (shape.codec !== "Struct" && shape.codec !== "Enum") {
    return;
  }

  for (const [subshapeName, subshape] of Object.entries(shape.shape)) {
    if (subshapeName === targetPath[0]) {
      if (targetPath.length === 1) {
        marker(subshape);
        visited.add(subshape);
      } else {
        markShape(subshape, targetPath.slice(1), marker, visited, false);
      }
    } else {
      if (recurse) {
        markShape(subshape, targetPath, marker, visited, recurse);
      }
    }
  }
}
