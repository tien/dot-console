import { AccountIdParam, type AccountIdParamProps } from "./accountId";
import { ArrayParam, type ArrayParamProps } from "./array";
import { type ParamProps } from "./common";
import { CompactParam, type CompactParamProps } from "./compact";
import { EnumParam, type EnumParamProps } from "./enum";
import { OptionParam, type OptionParamProps } from "./options";
import { PrimitiveParam, type PrimitiveParamProps } from "./primitive";
import { SequenceParam, type SequenceParamProps } from "./sequence";
import { StructParam, type StructParamProps } from "./struct";
import { TupleParam, type TupleParamProps } from "./tuple";
import { VoidParam, type VoidParamProps } from "./void";
import { type Var } from "@polkadot-api/metadata-builders";
import { createContext, useContext, useMemo } from "react";
import { css } from "styled-system/css";
import { type CssProperties } from "styled-system/types";

const StorageParamDepthContext = createContext(0);

export type CodecParamProps<T = unknown> = ParamProps<T> & {
  variable: Var;
};

export function CodecParam<T = unknown>({
  variable,
  ...props
}: CodecParamProps<T>) {
  const depth = useContext(StorageParamDepthContext);

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
      <StorageParamDepthContext.Provider value={depth + 1}>
        {useMemo(() => {
          switch (variable.type) {
            case "void":
              return <VoidParam {...(props as VoidParamProps)} />;
            case "primitive":
              return (
                <PrimitiveParam
                  {...(props as PrimitiveParamProps)}
                  primitive={variable}
                />
              );
            case "compact":
              return (
                <CompactParam
                  {...(props as CompactParamProps)}
                  compact={variable}
                />
              );
            case "option":
              return (
                <OptionParam
                  {...(props as OptionParamProps<unknown>)}
                  option={variable}
                />
              );
            case "enum":
              return (
                <EnumParam {...(props as EnumParamProps)} enum={variable} />
              );
            case "AccountId20":
            case "AccountId32":
              return (
                <AccountIdParam
                  {...(props as AccountIdParamProps)}
                  accountId={variable}
                />
              );
            case "sequence":
              return (
                <SequenceParam
                  {...(props as SequenceParamProps<unknown>)}
                  sequence={variable}
                />
              );
            case "array":
              return (
                <ArrayParam
                  {...(props as ArrayParamProps<unknown>)}
                  array={variable}
                />
              );
            case "tuple":
              return (
                <TupleParam
                  {...(props as TupleParamProps<unknown[]>)}
                  tuple={variable}
                />
              );
            case "struct":
              return (
                <StructParam
                  {...(props as StructParamProps<Record<string, unknown>>)}
                  struct={variable}
                />
              );
            case "bitSequence":
            case "result":
              throw new Error("Unsupported key type", { cause: variable.type });
          }
        }, [props, variable])}
      </StorageParamDepthContext.Provider>
    </div>
  );
}
