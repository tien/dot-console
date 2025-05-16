import { CodecParam } from "./codec";
import { CollapsibleParam } from "./collapsible";
import { INCOMPLETE, INVALID, type ParamProps } from "./common";
import type { StructDecoded, StructShape } from "@polkadot-api/view-builder";
import { useStateRef } from "~/hooks/use-state-ref";

export type StructParamProps<T extends Record<string, unknown>> =
  ParamProps<T> & {
    struct: StructShape;
    defaultValue: StructDecoded | undefined;
  };

export function StructParam<T extends Record<string, unknown>>(
  props: StructParamProps<T>,
) {
  return (
    <INTERNAL_StructParam
      key={Object.keys(props.struct.shape).join()}
      {...props}
    />
  );
}

function INTERNAL_StructParam<T extends Record<string, unknown>>({
  struct: structShape,
  defaultValue,
  onChangeValue,
}: StructParamProps<T>) {
  const setStruct = useStateRef(
    Object.fromEntries(
      Object.keys(structShape.shape).map((key) => [key, INCOMPLETE] as const),
    ) as unknown as T,
    (struct) => {
      const values = Object.values(struct);

      if (values.some((value) => value === INVALID)) {
        return onChangeValue(INVALID);
      }

      if (values.some((value) => value === INCOMPLETE)) {
        return onChangeValue(INCOMPLETE);
      }

      onChangeValue(struct);
    },
  );

  return (
    <>
      {Object.entries(structShape.shape).map(([key, value]) => (
        <CollapsibleParam key={key} label={key}>
          <CodecParam
            currentPath={key}
            shape={value}
            defaultValue={defaultValue?.value?.[key]}
            onChangeValue={(value) =>
              setStruct((struct) => ({ ...struct, [key]: value }))
            }
          />
        </CollapsibleParam>
      ))}
    </>
  );
}
