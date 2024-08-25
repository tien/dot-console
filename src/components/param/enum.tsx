import { CodecParam } from "./codec";
import type { ParamProps } from "./common";
import type { EnumShape } from "@polkadot-api/view-builder";
import { useEffect, useState } from "react";

export type EnumParamProps = ParamProps<
  { type: string } | { type: string; value: unknown }
> & {
  enum: EnumShape;
};

export function EnumParam({ onChangeValue, ...props }: EnumParamProps) {
  const enumVar = props.enum;

  const keys = Object.keys(enumVar.shape);
  const [key, setKey] = useState(keys.at(0)!);

  useEffect(
    () => {
      setKey(keys.at(0)!);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(keys)],
  );

  const [value, setValue] = useState();

  const enumShape = enumVar.shape[key];

  useEffect(
    () => {
      onChangeValue({ type: key, value });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, value],
  );

  return (
    <div>
      <select value={key} onChange={(event) => setKey(event.target.value)}>
        {keys.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      {enumShape && (
        // @ts-expect-error TODO: improve Enum type
        <CodecParam shape={enumShape} onChangeValue={setValue} />
      )}
    </div>
  );
}
