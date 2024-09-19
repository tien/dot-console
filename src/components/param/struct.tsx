import { FormLabel } from "../ui";
import { CodecParam } from "./codec";
import { INCOMPLETE, INVALID, type ParamProps } from "./common";
import type { StructDecoded, StructShape } from "@polkadot-api/view-builder";
import { useEffect, useMemo, useState } from "react";

export type StructParamProps<T extends Record<string, unknown>> =
  ParamProps<T> & {
    struct: StructShape;
    defaultValue: StructDecoded | undefined;
  };

export function StructParam<T extends Record<string, unknown>>({
  struct: structShape,
  defaultValue,
  onChangeValue,
}: StructParamProps<T>) {
  const defaultStruct = Object.fromEntries(
    Object.keys(structShape.shape).map((key) => [key, INCOMPLETE] as const),
  ) as unknown as T;

  const [struct, setStruct] = useState<T>(defaultStruct);

  const derivedStruct = useMemo(() => {
    const values = Object.values(struct);

    if (values.some((value) => value === INVALID)) {
      return INVALID;
    }

    if (values.some((value) => value === INCOMPLETE)) {
      return INCOMPLETE;
    }

    return struct;
  }, [struct]);

  const structId = Object.keys(structShape.shape).join();

  useEffect(
    () => {
      onChangeValue(derivedStruct);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [structId, derivedStruct],
  );

  return (
    <>
      {Object.entries(structShape.shape).map(([key, value]) => (
        <section key={key}>
          <FormLabel>{key}</FormLabel>
          <CodecParam
            shape={value}
            defaultValue={defaultValue?.value[key]}
            onChangeValue={(value) =>
              setStruct((struct) => ({ ...struct, [key]: value }))
            }
          />
        </section>
      ))}
    </>
  );
}
