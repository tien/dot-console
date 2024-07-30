import { FormLabel } from "../ui";
import { CodecParam } from "./codec";
import { INCOMPLETE, INVALID, type ParamProps } from "./common";
import type { StructVar } from "@polkadot-api/metadata-builders";
import { useEffect, useMemo, useState } from "react";

export type StructParamProps<T extends Record<string, unknown>> =
  ParamProps<T> & {
    struct: StructVar;
  };

export function StructParam<T extends Record<string, unknown>>({
  struct: structVar,
  onChangeValue,
}: StructParamProps<T>) {
  const [struct, setStruct] = useState<T>(
    () =>
      Object.fromEntries(
        Object.keys(structVar.value).map((key) => [key, INCOMPLETE] as const),
      ) as unknown as T,
  );

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

  useEffect(
    () => {
      onChangeValue(derivedStruct);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [derivedStruct],
  );

  return (
    <>
      {Object.entries(structVar.value).map(([key, value]) => (
        <section key={key}>
          <FormLabel>{key}</FormLabel>
          <CodecParam
            variable={value}
            onChangeValue={(value) =>
              setStruct((struct) => ({ ...struct, [key]: value }))
            }
          />
        </section>
      ))}
    </>
  );
}
