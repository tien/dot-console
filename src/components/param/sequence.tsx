import { Button } from "../ui";
import { BinaryParam } from "./binary";
import { CodecParam } from "./codec";
import { INCOMPLETE, INVALID, ParamInput, ParamProps } from "./common";
import type { SequenceVar } from "@polkadot-api/metadata-builders";
import { useEffect, useMemo, useState } from "react";
import { css } from "styled-system/css";

export type SequenceParamProps<T> = ParamProps<T[]> & {
  sequence: SequenceVar;
};

function _SequenceParam<T>({ sequence, onChangeValue }: SequenceParamProps<T>) {
  const [length, setLength] = useState(1);
  const [value, setValue] = useState(
    Array.from<ParamInput<T>>({ length }).fill(INCOMPLETE),
  );

  const derivedValue = useMemo(
    () =>
      value.includes(INCOMPLETE)
        ? INCOMPLETE
        : value.includes(INVALID)
          ? INVALID
          : (value as T[]),
    [value],
  );

  const increaseLength = () => {
    setLength((length) => length + 1);
    setValue((value) => [...value, INCOMPLETE]);
  };

  const decreaseLength = () => {
    if (length === 0) {
      return;
    }

    setLength((length) => length - 1);
    setValue((value) => value.slice(0, -1));
  };

  useEffect(
    () => {
      onChangeValue(derivedValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [derivedValue],
  );

  return (
    <div>
      <div
        className={css({
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        })}
      >
        <Button onClick={increaseLength}>Add</Button>
        <Button onClick={decreaseLength}>Remove</Button>
      </div>
      {value.map((_, index) => (
        <CodecParam
          key={index}
          variable={sequence.value}
          onChangeValue={(value) =>
            setValue((array) => array.with(index, value as ParamInput<T>))
          }
        />
      ))}
    </div>
  );
}

export function SequenceParam<T>({
  sequence,
  onChangeValue,
}: SequenceParamProps<T>) {
  if (sequence.value.type === "primitive" && sequence.value.value === "u8") {
    // @ts-expect-error TODO: improve typing
    return <BinaryParam onChangeValue={onChangeValue} />;
  }

  return <_SequenceParam sequence={sequence} onChangeValue={onChangeValue} />;
}
