import { Field } from "../ui/field";
import { Switch } from "../ui/switch";
import {
  INCOMPLETE,
  integerPrimitives,
  INVALID,
  type ParamProps,
} from "./common";
import type { PrimitiveDecoded } from "@polkadot-api/view-builder";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type ComplexPrimitive =
  | "AccountId"
  | "Bytes"
  | "BytesArray"
  | "_void"
  | "bitSequence"
  | "compactBn"
  | "compactNumber"
  | "ethAccount";

export type PrimitiveParamProps = ParamProps<
  string | boolean | number | bigint
> & {
  primitive: {
    codec: Exclude<PrimitiveDecoded["codec"], ComplexPrimitive>;
  };
  defaultValue: { value: boolean | number | string } | undefined;
};

export function PrimitiveParam({
  primitive,
  defaultValue,
  onChangeValue,
}: PrimitiveParamProps) {
  const [value, setValue] = useState(
    (defaultValue?.value.toString() ?? primitive.codec === "bool")
      ? String(false)
      : "",
  );

  const commonProps = useMemo(
    () => ({
      placeholder: primitive.codec,
      value,
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        setValue(event.target.value),
    }),
    [primitive.codec, value],
  );

  const commonNumberProps = useCallback(
    (primitive: keyof typeof integerPrimitives) =>
      ({
        ...commonProps,
        inputMode: "numeric",
        min:
          typeof integerPrimitives[primitive].min === "number"
            ? integerPrimitives[primitive].min
            : String(integerPrimitives[primitive].min),
        max:
          typeof integerPrimitives[primitive].max === "number"
            ? integerPrimitives[primitive].max
            : String(integerPrimitives[primitive].max),
      }) as const,
    [commonProps],
  );

  const parsedValue = useMemo(() => {
    if (primitive.codec === "str") {
      return value;
    }

    if (value.trim() === "") {
      return INCOMPLETE;
    }

    switch (primitive.codec) {
      case "bool":
        return Boolean(value);
      case "char":
        return value.length === 1 ? value : INVALID;
      case "u8":
      case "i8":
      case "u16":
      case "i16":
      case "u32":
      case "i32": {
        const number = Number(value);

        if (Number.isNaN(number) || !Number.isFinite(number)) {
          return INVALID;
        }

        const { min, max } = commonNumberProps(primitive.codec);

        if (number < Number(min) || number > Number(max)) {
          return INVALID;
        }

        return number;
      }
      case "u64":
      case "i64":
      case "u128":
      case "i128":
      case "u256":
      case "i256": {
        const bn = BigInt(value);

        const { min, max } = commonNumberProps(primitive.codec);

        if (bn < BigInt(min) || bn > BigInt(max)) {
          return INVALID;
        }

        return bn;
      }
    }
  }, [commonNumberProps, primitive.codec, value]);

  useEffect(
    () => {
      onChangeValue(parsedValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parsedValue],
  );

  const inputElement = useMemo(() => {
    switch (primitive.codec) {
      case "bool":
        return (
          <Field.Input asChild>
            <Switch
              checked={Boolean(value)}
              onCheckedChange={(event) => setValue(String(event.checked))}
            />
          </Field.Input>
        );
      case "char":
        return <Field.Input {...commonProps} maxLength={1} />;
      case "str":
        return <Field.Input {...commonProps} />;
      case "i8":
      case "u8":
      case "i16":
      case "u16":
      case "i32":
      case "u32":
      case "i64":
      case "u64":
      case "i128":
      case "u128":
      case "i256":
      case "u256":
        return <Field.Input {...commonNumberProps(primitive.codec)} />;
    }
  }, [commonNumberProps, commonProps, primitive.codec, value]);

  return (
    <Field.Root
      required={parsedValue === INCOMPLETE}
      invalid={parsedValue === INVALID}
    >
      {inputElement}
    </Field.Root>
  );
}
