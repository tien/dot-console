import { Field } from "../ui/field";
import { INCOMPLETE, INVALID, type ParamProps } from "./common";
import { nativeTokenInfoFromChainSpecData } from "@reactive-dot/core/internal.js";
import {
  useChainSpecData,
  useNativeTokenAmountFromNumber,
  useNativeTokenAmountFromPlanck,
} from "@reactive-dot/react";
import { Suspense, useEffect, useMemo, useState } from "react";

export type NativeAmountProps = ParamProps<bigint> & {
  shape: { codec: "compactNumber" | "compactBn" | "u128" };
  defaultValue: { value: number | bigint } | undefined;
};

export function NativeAmountParam(props: NativeAmountProps) {
  return (
    <Suspense>
      <INTERNAL_NativeAmountParam {...props} />
    </Suspense>
  );
}

function INTERNAL_NativeAmountParam({
  defaultValue,
  onChangeValue,
}: NativeAmountProps) {
  const chainSpecData = useChainSpecData();
  const nativeTokenInfo = useMemo(
    () => nativeTokenInfoFromChainSpecData(chainSpecData),
    [chainSpecData],
  );
  const nativeTokenAmount = useNativeTokenAmountFromNumber();
  const nativeTokenAmountFromPlanck = useNativeTokenAmountFromPlanck();

  const [value, setValue] = useState(() =>
    defaultValue?.value === undefined
      ? ""
      : nativeTokenAmountFromPlanck(defaultValue.value.toString()).toString(),
  );

  const parsedValue = useMemo(() => {
    if (value.trim() === "") {
      return INCOMPLETE;
    }

    try {
      return nativeTokenAmount(value).planck;
    } catch {
      return INVALID;
    }
  }, [nativeTokenAmount, value]);

  useEffect(
    () => {
      onChangeValue(parsedValue);
    },
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parsedValue],
  );

  return (
    <Field.Root
      required={parsedValue === INCOMPLETE}
      invalid={parsedValue === INVALID}
    >
      <Field.Input
        inputMode="numeric"
        placeholder={nativeTokenInfo.code}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </Field.Root>
  );
}
