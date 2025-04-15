import { CodecParam } from "./codec";
import { CollapsibleParam } from "./collapsible";
import { INCOMPLETE, INVALID, type ParamProps } from "./common";
import type { TupleDecoded, TupleShape } from "@polkadot-api/view-builder";
import { useStateRef } from "~/hooks/use-state-ref";

export type TupleParamProps<T extends Array<unknown>> = ParamProps<T> & {
  tuple: TupleShape;
  defaultValue: TupleDecoded | undefined;
};

export function TupleParam<T extends Array<unknown>>(
  props: TupleParamProps<T>,
) {
  return <INTERNAL_TupleParam key={props.tuple.shape.length} {...props} />;
}

function INTERNAL_TupleParam<T extends Array<unknown>>({
  tuple: tupleShape,
  defaultValue,
  onChangeValue,
}: TupleParamProps<T>) {
  const setTuple = useStateRef(
    Array.from({
      length: tupleShape.shape.length,
    }).fill(INCOMPLETE) as T,
    (tuple) =>
      onChangeValue(
        tuple.some((value) => value === INVALID)
          ? INVALID
          : tuple.some((value) => value === INCOMPLETE)
            ? INCOMPLETE
            : tuple,
      ),
  );

  return (
    <>
      {tupleShape.shape.map((entry, index) => (
        // eslint-disable-next-line @eslint-react/no-array-index-key
        <CollapsibleParam key={index} label={`Item ${index}`}>
          <CodecParam
            shape={entry}
            defaultValue={defaultValue?.value.at(index)}
            onChangeValue={(value) =>
              setTuple((tuple) => tuple.with(index, value) as T)
            }
          />
        </CollapsibleParam>
      ))}
    </>
  );
}
