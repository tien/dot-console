import { CodecParam } from "./codec";
import { INCOMPLETE, INVALID, type ParamProps } from "./common";
import type { TupleDecoded, TupleShape } from "@polkadot-api/view-builder";
import { useEffect, useMemo, useState } from "react";

export type TupleParamProps<T extends Array<unknown>> = ParamProps<T> & {
  tuple: TupleShape;
  defaultValue: TupleDecoded | undefined;
};

export function TupleParam<T extends Array<unknown>>({
  tuple: tupleShape,
  defaultValue,
  onChangeValue,
}: TupleParamProps<T>) {
  const defaultTuple = Array.from({
    length: tupleShape.shape.length,
  }).fill(INCOMPLETE) as T;

  const [tuple, setTuple] = useState(defaultTuple);

  useEffect(
    () => {
      setTuple(defaultTuple);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tupleShape.shape.length],
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
      {tupleShape.shape.map((entry, index) => (
        <CodecParam
          key={index}
          shape={entry}
          defaultValue={defaultValue?.value.at(index)}
          onChangeValue={(value) =>
            setTuple((tuple) => tuple.with(index, value) as T)
          }
        />
      ))}
    </>
  );
}
