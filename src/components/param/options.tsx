import { Switch } from "../ui";
import { CodecParam } from "./codec";
import { INCOMPLETE, ParamInput, ParamProps } from "./common";
import type { OptionVar } from "@polkadot-api/metadata-builders";
import { useEffect, useMemo, useState } from "react";

export type OptionParamProps<T> = ParamProps<undefined | T> & {
  option: OptionVar;
};

export function OptionParam<T>({ option, onChangeValue }: OptionParamProps<T>) {
  const [includeOptional, setIncludeOptional] = useState(true);
  const [value, setValue] = useState<ParamInput<T>>(INCOMPLETE);

  const derivedValue = useMemo(
    () => (includeOptional ? value : undefined),
    [includeOptional, value],
  );

  useEffect(
    () => {
      onChangeValue(derivedValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [derivedValue],
  );

  return (
    <div>
      <Switch
        checked={includeOptional}
        onCheckedChange={(event) => setIncludeOptional(Boolean(event.checked))}
      >
        Include optional
      </Switch>
      {includeOptional && (
        <CodecParam variable={option.value} onChangeValue={setValue} />
      )}
    </div>
  );
}
