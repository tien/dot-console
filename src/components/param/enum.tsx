import { CodecParam } from "./codec";
import type { ParamProps } from "./common";
import type { EnumDecoded, EnumShape } from "@polkadot-api/view-builder";
import { useEffect, useState } from "react";

export type EnumParamProps = ParamProps<
  { type: string } | { type: string; value: unknown }
> & {
  enum: EnumShape;
  defaultValue: EnumDecoded | undefined;
};

export function EnumParam({
  onChangeValue,
  defaultValue,
  ...props
}: EnumParamProps) {
  const enumShape = props.enum;

  const keys = Object.keys(enumShape.shape);
  const defaultKey = defaultValue?.value.type ?? keys.at(0)!;
  const [key, setKey] = useState(defaultKey);

  useEffect(
    () => {
      setKey(defaultKey);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keys.join()],
  );

  const [value, setValue] = useState();

  const valueShape = enumShape.shape[key];

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
      {valueShape && (
        <CodecParam
          shape={valueShape}
          defaultValue={defaultValue?.value.value}
          // @ts-expect-error TODO: improve Enum type
          onChangeValue={setValue}
        />
      )}
    </div>
  );
}
