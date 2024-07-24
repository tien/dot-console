import { CodecParam } from "./codec";
import { ParamProps } from "./common";
import type { EnumVar } from "@polkadot-api/metadata-builders";
import { useEffect, useState } from "react";

export type EnumParamProps = ParamProps<
  { type: string } | { type: string; value: unknown }
> & {
  enum: EnumVar;
};

export function EnumParam({ onChangeValue, ...props }: EnumParamProps) {
  const enumVar = props.enum;

  const keys = Object.keys(enumVar.value);
  const [key, setKey] = useState(keys.at(0)!);
  const [value, setValue] = useState();

  const enumValue = enumVar.value[key];
  const variable =
    enumValue === undefined
      ? undefined
      : enumValue.type === "lookupEntry"
        ? enumValue.value
        : enumValue;

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
      {variable && (
        // @ts-expect-error TODO: improve Enum type
        <CodecParam variable={variable} onChangeValue={setValue} />
      )}
    </div>
  );
}
