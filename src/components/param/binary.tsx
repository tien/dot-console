import { Input } from "../ui";
import { ParamProps } from "./common";
import { Binary } from "@polkadot-api/substrate-bindings";
import { useEffect, useState } from "react";

export type BinaryParamProps = ParamProps<Binary>;

export function BinaryParam({ onChangeValue }: BinaryParamProps) {
  const [value, setValue] = useState("");

  useEffect(
    () => {
      if (value.match(/^0x[0-9a-f]+$/i)) {
        onChangeValue(Binary.fromHex(value));
      } else {
        onChangeValue(Binary.fromText(value));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );

  return (
    <Input
      placeholder="Binary (string or hex)"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
