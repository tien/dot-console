import { CodecParam } from "./codec";
import {
  INCOMPLETE,
  INVALID,
  type ParamInput,
  type ParamProps,
} from "./common";
import type { ArrayDecoded, ArrayShape } from "@polkadot-api/view-builder";
import { useEffect, useMemo, useState } from "react";
import { css } from "styled-system/css";

export type ArrayParamProps<T> = ParamProps<T[]> & {
  array: ArrayShape;
  defaultValue: ArrayDecoded | undefined;
};

export function ArrayParam<T>({
  array: arrayShape,
  defaultValue,
  onChangeValue,
}: ArrayParamProps<T>) {
  const defaultArray = Array.from<ParamInput<T>>({
    length: arrayShape.len,
  }).fill(INCOMPLETE);

  const [array, setArray] = useState(defaultArray);

  useEffect(
    () => {
      setArray(defaultArray);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arrayShape.len],
  );

  const derivedArray = useMemo(
    () =>
      array.some((value) => value === INVALID)
        ? INVALID
        : array.some((value) => value === INCOMPLETE)
          ? INCOMPLETE
          : (array as T[]),
    [array],
  );

  useEffect(
    () => {
      onChangeValue(derivedArray);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [derivedArray],
  );

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      })}
    >
      {Array.from<T>({ length: arrayShape.len }).map((_, index) => (
        <CodecParam
          key={index}
          shape={arrayShape.shape}
          defaultValue={defaultValue?.value.at(index)}
          onChangeValue={(value) =>
            setArray((array) => array.with(index, value as T))
          }
        />
      ))}
    </div>
  );
}
