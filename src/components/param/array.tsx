import { BinaryParam } from "./binary";
import { CodecParam } from "./codec";
import { INCOMPLETE, INVALID, ParamInput, ParamProps } from "./common";
import type { ArrayVar } from "@polkadot-api/metadata-builders";
import { useEffect, useMemo, useState } from "react";
import { css } from "styled-system/css";

export type ArrayParamProps<T> = ParamProps<T[]> & {
  array: ArrayVar;
};

export function _ArrayParam<T>({
  array: arrayVar,
  onChangeValue,
}: ArrayParamProps<T>) {
  const [array, setArray] = useState(
    Array.from<ParamInput<T>>({ length: arrayVar.len }).fill(INCOMPLETE),
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
      {Array.from<T>({ length: arrayVar.len }).map((_, index) => (
        <CodecParam
          key={index}
          variable={arrayVar.value}
          onChangeValue={(value) =>
            setArray((array) => array.with(index, value as T))
          }
        />
      ))}
    </div>
  );
}

export function ArrayParam<T>(props: ArrayParamProps<T>) {
  if (
    props.array.value.type === "primitive" &&
    props.array.value.value === "u8"
  ) {
    // @ts-expect-error TODO: Improve typing
    return <BinaryParam onChangeValue={props.onChangeValue as unknown} />;
  }

  return <_ArrayParam {...props} />;
}
