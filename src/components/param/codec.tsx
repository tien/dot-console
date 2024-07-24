import { AccountIdParam, AccountIdParamProps } from "./accountId";
import { ArrayParam, ArrayParamProps } from "./array";
import { ParamProps } from "./common";
import { CompactParam, CompactParamProps } from "./compact";
import { EnumParam, EnumParamProps } from "./enum";
import { OptionParam, OptionParamProps } from "./options";
import { PrimitiveParam, PrimitiveParamProps } from "./primitive";
import { SequenceParam, SequenceParamProps } from "./sequence";
import { StructParam, StructParamProps } from "./struct";
import { TupleParam, TupleParamProps } from "./tuple";
import { VoidParam, VoidParamProps } from "./void";
import type { Var } from "@polkadot-api/metadata-builders";
import { createContext, useContext, useMemo } from "react";
import { css } from "styled-system/css";
import type { CssProperties } from "styled-system/types";

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
        borderLeft: depth <= 0 ? undefined : "1px dotted currentcolor",
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
