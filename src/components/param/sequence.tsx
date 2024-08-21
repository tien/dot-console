import { Button } from "../ui";
import { BinaryParam } from "./binary";
import { CodecParam } from "./codec";
import {
  INCOMPLETE,
  INVALID,
  type ParamInput,
  type ParamProps,
} from "./common";
import type { SequenceVar } from "@polkadot-api/metadata-builders";
import Icon from "@w3f/polkadot-icons/Icon";
import { useEffect, useMemo, useState } from "react";
import { css } from "styled-system/css";

export type SequenceParamProps<T> = ParamProps<T[]> & {
  sequence: SequenceVar;
};

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

function _SequenceParam<T>({ sequence, onChangeValue }: SequenceParamProps<T>) {
  const [length, setLength] = useState(1);
  const [values, setValues] = useState(
    Array.from<ParamInput<T>>({ length }).fill(INCOMPLETE),
  );

  const derivedValue = useMemo(
    () =>
      values.includes(INCOMPLETE)
        ? INCOMPLETE
        : values.includes(INVALID)
          ? INVALID
          : (values as T[]),
    [values],
  );

  const increaseLength = () => {
    setLength((length) => length + 1);
    setValues((value) => [...value, INCOMPLETE]);
  };

  const decreaseLength = () => {
    if (length === 0) {
      return;
    }

    setLength((length) => length - 1);
    setValues((value) => value.slice(0, -1));
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
        <Button size="xs" onClick={increaseLength}>
          Add item <Icon name="Add" variant="solid" fill="currentcolor" />
        </Button>
        <Button size="xs" onClick={decreaseLength} disabled={length === 0}>
          Remove item <Icon name="Remove" variant="solid" fill="currentcolor" />
        </Button>
      </div>
      {values.map((_, index) => (
        <CodecParam
          key={index}
          variable={sequence.value}
          onChangeValue={(value) =>
            setValues((array) => array.with(index, value as ParamInput<T>))
          }
        />
      ))}
    </div>
  );
}
