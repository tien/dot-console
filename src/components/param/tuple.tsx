import { CodecParam } from "./codec";
import { INCOMPLETE, INVALID, type ParamProps } from "./common";
import type { TupleShape } from "@polkadot-api/view-builder";
import { useEffect, useMemo, useState } from "react";

export type TupleParamProps<T extends Array<unknown>> = ParamProps<T> & {
  tuple: TupleShape;
};

export function TupleParam<T extends Array<unknown>>({
  tuple: tupleVar,
  onChangeValue,
}: TupleParamProps<T>) {
  const [tuple, setTuple] = useState<T>(
    Array.from({ length: tupleVar.shape.length }).fill(INCOMPLETE) as T,
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
      {tupleVar.shape.map((entry, index) => (
        <CodecParam
          key={index}
          shape={entry}
          onChangeValue={(value) =>
            setTuple((tuple) => tuple.with(index, value) as T)
          }
        />
      ))}
    </>
  );
}
