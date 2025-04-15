import { CodecParam } from "./codec";
import { CollapsibleParam } from "./collapsible";
import {
  INCOMPLETE,
  INVALID,
  type ParamInput,
  type ParamProps,
} from "./common";
import type { ArrayDecoded, ArrayShape } from "@polkadot-api/view-builder";
import { css } from "styled-system/css";
import { useStateRef } from "~/hooks/use-state-ref";

export type ArrayParamProps<T> = ParamProps<T[]> & {
  array: ArrayShape;
  defaultValue: ArrayDecoded | undefined;
};

export function ArrayParam<T>(props: ArrayParamProps<T>) {
  return <INTERNAL_ArrayParam key={props.array.len} {...props} />;
}

function INTERNAL_ArrayParam<T>({
  array: arrayShape,
  defaultValue,
  onChangeValue,
}: ArrayParamProps<T>) {
  const setArray = useStateRef(
    Array.from<ParamInput<T>>({
      length: arrayShape.len,
    }).fill(INCOMPLETE),
    (array) =>
      onChangeValue(
        array.some((value) => value === INVALID)
          ? INVALID
          : array.some((value) => value === INCOMPLETE)
            ? INCOMPLETE
            : (array as T[]),
      ),
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
        // eslint-disable-next-line @eslint-react/no-array-index-key
        <CollapsibleParam key={index} label={`Item ${index}`}>
          <CodecParam
            shape={arrayShape.shape}
            defaultValue={defaultValue?.value.at(index)}
            onChangeValue={(value) =>
              setArray((array) => array.with(index, value as T))
            }
          />
        </CollapsibleParam>
      ))}
    </div>
  );
}
