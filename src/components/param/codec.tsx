import { AccountIdParam, type AccountIdParamProps } from "./accountId";
import { ArrayParam, type ArrayParamProps } from "./array";
import { BinaryParam, type BinaryParamProps } from "./binary";
import { type ParamProps } from "./common";
import { CompactParam, type CompactParamProps } from "./compact";
import { EnumParam, type EnumParamProps } from "./enum";
import { NativeAmountParam, type NativeAmountProps } from "./native-amount";
import { OptionParam, type OptionParamProps } from "./option";
import { PrimitiveParam, type PrimitiveParamProps } from "./primitive";
import { SequenceParam, type SequenceParamProps } from "./sequence";
import { StructParam, type StructParamProps } from "./struct";
import { TupleParam, type TupleParamProps } from "./tuple";
import { VoidParam, type VoidParamProps } from "./void";
import type { Decoded, Shape } from "@polkadot-api/view-builder";
import { createContext, Suspense, use, useMemo } from "react";
import { css } from "styled-system/css";
import { type CssProperties } from "styled-system/types";
import { nativeAmountFields } from "~/consts/native-amount-fields";

const StorageParamDepthContext = createContext(0);

const StorageParamPathContext = createContext<Array<string | undefined>>([]);

export type CodecParamProps<T = unknown> = ParamProps<T> & {
  shape: Shape;
  defaultValue?: Decoded | undefined;
  basePath?: string[];
  currentPath?: string;
};

export function CodecParam<T = unknown>({
  shape,
  basePath,
  currentPath,
  ...props
}: CodecParamProps<T>) {
  const contextPath = use(StorageParamPathContext);

  const path = useMemo(
    () =>
      basePath !== undefined
        ? [...basePath, ...contextPath]
        : [...contextPath, currentPath],
    [basePath, contextPath, currentPath],
  );

  const depth = use(StorageParamDepthContext);

  const nativeTokenShape = useMemo(
    () => isNativeTokenShape(path),
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path.join()],
  );

  return (
    <div
      className={css({
        paddingTop: "0.5rem",
        "&:empty": {
          display: "none",
        },
      })}
      style={{
        ["--storage-depth" as keyof CssProperties]: depth,
        borderLeft: depth <= 0 ? undefined : "1px dotted",
        paddingLeft: depth <= 0 ? undefined : "1rem",
      }}
    >
      <StorageParamPathContext value={path}>
        <StorageParamDepthContext value={depth + 1}>
          {useMemo(() => {
            if (nativeTokenShape) {
              return (
                <NativeAmountParam
                  {...(props as NativeAmountProps)}
                  shape={
                    shape as { codec: "compactNumber" | "compactBn" | "u128" }
                  }
                />
              );
            }

            switch (shape.codec) {
              case "_void":
                return <VoidParam {...(props as VoidParamProps)} />;
              case "Option":
                return (
                  <OptionParam
                    {...(props as OptionParamProps<unknown>)}
                    option={shape}
                  />
                );
              case "Enum":
                return (
                  <EnumParam {...(props as EnumParamProps)} enum={shape} />
                );
              case "AccountId":
              case "ethAccount":
                return (
                  // TODO: investigate why this keep suspending on every render
                  <Suspense>
                    <AccountIdParam
                      {...(props as AccountIdParamProps)}
                      // @ts-expect-error TypeScript bug
                      accountId={shape}
                    />
                  </Suspense>
                );
              case "Sequence":
                return (
                  <SequenceParam
                    {...(props as SequenceParamProps<unknown>)}
                    sequence={shape}
                  />
                );
              case "Array":
                return (
                  <ArrayParam
                    {...(props as ArrayParamProps<unknown>)}
                    array={shape}
                  />
                );
              case "Tuple":
                return (
                  <TupleParam
                    {...(props as TupleParamProps<unknown[]>)}
                    tuple={shape}
                  />
                );
              case "Struct":
                return (
                  <StructParam
                    {...(props as StructParamProps<Record<string, unknown>>)}
                    struct={shape}
                  />
                );
              case "Bytes":
              case "BytesArray":
                return (
                  <BinaryParam
                    {...(props as BinaryParamProps)}
                    {...(shape.codec === "BytesArray"
                      ? { bytesArray: shape }
                      : {})}
                  />
                );
              case "compactBn":
              case "compactNumber":
                return (
                  <CompactParam
                    {...(props as CompactParamProps)}
                    // @ts-expect-error TypeScript bug
                    compact={shape}
                  />
                );
              case "bool":
              case "char":
              case "i128":
              case "i16":
              case "i256":
              case "i32":
              case "i64":
              case "i8":
              case "str":
              case "u128":
              case "u16":
              case "u256":
              case "u32":
              case "u64":
              case "u8":
                return (
                  <PrimitiveParam
                    {...(props as PrimitiveParamProps)}
                    // @ts-expect-error TypeScript bug
                    primitive={shape}
                  />
                );
              case "bitSequence":
              case "Result":
                throw new Error("Unsupported codec type", {
                  cause: shape.codec,
                });
            }
          }, [nativeTokenShape, props, shape])}
        </StorageParamDepthContext>
      </StorageParamPathContext>
    </div>
  );
}

function isNativeTokenShape(path: Array<string | undefined>) {
  return nativeAmountFields.some(
    (field) =>
      path.slice(-field.length).length === field.length &&
      path.slice(-field.length).every((part, index) => part === field[index]),
  );
}
