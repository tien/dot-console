import { BinaryParam } from "./binary";
import { CodecParam } from "./codec";
import { INCOMPLETE, INVALID, ParamProps } from "./common";
import type { TupleVar } from "@polkadot-api/metadata-builders";
import { useEffect, useMemo, useState } from "react";

export type TupleParamProps<T extends Array<unknown>> = ParamProps<T> & {
  tuple: TupleVar;
};

export function TupleParam<T extends Array<unknown>>(
  props: TupleParamProps<T>,
) {
  if (
    props.tuple.value.every(
      (lookupEntry) =>
        lookupEntry.type === "primitive" && lookupEntry.value === "u8",
    )
  ) {
    // @ts-expect-error TODO: Improve typing
    return <BinaryParam onChangeValue={props.onChangeValue as unknown} />;
  }

  return <_TupleParam {...props} />;
}

export function _TupleParam<T extends Array<unknown>>({
  tuple: tupleVar,
  onChangeValue,
}: TupleParamProps<T>) {
  const [tuple, setTuple] = useState<T>(
    Array.from({ length: tupleVar.value.length }).fill(INCOMPLETE) as T,
  );

  const derivedTuple = useMemo(
    () =>
      tuple.some((value) => value === INVALID)
        ? INVALID
        : tuple.some((value) => value === INCOMPLETE)
          ? INCOMPLETE
          : tuple,
    [tuple],
  );

  useEffect(
    () => {
      onChangeValue(derivedTuple);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [derivedTuple],
  );

  return (
    <>
      {tupleVar.value.map((entry, index) => (
        <CodecParam
          key={index}
          variable={entry}
          onChangeValue={(value) =>
            setTuple((tuple) => tuple.with(index, value) as T)
          }
        />
      ))}
    </>
  );
}
