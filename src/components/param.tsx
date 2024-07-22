import { FormLabel, Input, Select, Switch } from "./ui";
import type {
  AccountId20,
  AccountId32,
  ArrayVar,
  CompactVar,
  EnumVar,
  OptionVar,
  PrimitiveVar,
  StructVar,
  TupleVar,
  Var,
} from "@polkadot-api/metadata-builders";
import { getSs58AddressInfo } from "@polkadot-api/substrate-bindings";
import { useAccounts } from "@reactive-dot/react";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import type { InjectedPolkadotAccount } from "polkadot-api/pjs-signer";
import {
  type ChangeEvent,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { css } from "styled-system/css";
import type { CssProperties } from "styled-system/types";

export const VOID = Symbol();

export const INCOMPLETE = Symbol();

export const INVALID = Symbol();

export type ParamInput<T> = T | typeof INCOMPLETE | typeof INVALID;

export type ParamProps<T> = {
  onChangeValue: (value: ParamInput<T>) => void;
};

export type VoidParamProps = ParamProps<typeof VOID>;

export function VoidParam({ onChangeValue }: VoidParamProps) {
  useEffect(() => {
    onChangeValue(VOID);
  }, [onChangeValue]);

  return null;
}

export type PrimitiveParamProps = ParamProps<
  string | boolean | number | bigint
> & {
  primitive: PrimitiveVar;
};

export function PrimitiveParam({
  primitive,
  onChangeValue,
}: PrimitiveParamProps) {
  const [value, setValue] = useState("");

  const commonProps = {
    placeholder: primitive.value,
    value,
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
  };

  const commonNumberProps = {
    ...commonProps,
    type: "number",
    inputMode: "numeric",
  } as const;

  useEffect(() => {
    switch (primitive.value) {
      case "bool":
        onChangeValue(Boolean(value));
        break;
      case "char":
      case "str":
        onChangeValue(value);
        break;
      case "u8":
      case "i8":
      case "u16":
      case "i16":
      case "u32":
      case "i32":
        onChangeValue(Number(value));
        break;
      case "u64":
      case "i64":
      case "u128":
      case "i128":
      case "u256":
      case "i256":
        onChangeValue(BigInt(value));
    }
  }, [onChangeValue, primitive.value, value]);

  switch (primitive.value) {
    case "bool":
      return (
        <Switch
          checked={Boolean(value)}
          onCheckedChange={(event) => setValue(String(event.checked))}
        />
      );
    case "char":
      return <Input {...commonProps} type="text" maxLength={1} />;
    case "str":
      return <Input {...commonProps} type="text" />;
    case "i8":
      return <Input {...commonNumberProps} min={-128} max={127} />;
    case "u8":
      return <Input {...commonNumberProps} min={0} max={255} />;
    case "i16":
      return <Input {...commonNumberProps} min={-32768} max={32767} />;
    case "u16":
      return <Input {...commonNumberProps} min={0} max={65535} />;
    case "i32":
      return (
        <Input {...commonNumberProps} min={-2147483648} max={2147483647} />
      );
    case "u32":
      return <Input {...commonNumberProps} min={0} max={4294967295} />;
    case "i64":
      return (
        <Input
          {...commonNumberProps}
          min="-9223372036854775808"
          max="9223372036854775807"
        />
      );
    case "u64":
      return (
        <Input {...commonNumberProps} min={0} max="18446744073709551615" />
      );
    case "i128":
      return (
        <Input
          {...commonNumberProps}
          min="-170141183460469231731687303715884105728"
          max="170141183460469231731687303715884105727"
        />
      );
    case "u128":
      return (
        <Input
          {...commonNumberProps}
          min={0}
          max="340282366920938463463374607431768211455"
        />
      );
    case "i256":
      return (
        <Input
          {...commonNumberProps}
          min="-57896044618658097711785492504343953926634992332820282019728792003956564819968"
          max="57896044618658097711785492504343953926634992332820282019728792003956564819967"
        />
      );
    case "u256":
      return (
        <Input
          {...commonNumberProps}
          min={0}
          max="115792089237316195423570985008687907853269984665640564039457584007913129639935"
        />
      );
  }
}

export type CompactParamProps = ParamProps<number | bigint> & {
  compact: CompactVar;
};

export function CompactParam({ compact, onChangeValue }: CompactParamProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    onChangeValue(compact.isBig ? BigInt(value) : Number(value));
  }, [compact.isBig, onChangeValue, value]);

  return (
    <Input
      type="number"
      inputMode="numeric"
      placeholder="Compact"
      min={
        compact.isBig
          ? "-57896044618658097711785492504343953926634992332820282019728792003956564819968"
          : -2147483648
      }
      max={
        compact.isBig ? "170141183460469231731687303715884105727" : 4294967295
      }
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

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

  useEffect(() => {
    onChangeValue(derivedValue);
  }, [onChangeValue, derivedValue]);

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

export type EnumParamProps = ParamProps<
  { type: string } | { type: string; value: unknown }
> & {
  enum: EnumVar;
};

export function EnumParam({ onChangeValue, ...props }: EnumParamProps) {
  const enumVar = props.enum;

  const keys = Object.keys(enumVar.value);
  const [key, setKey] = useState(keys.at(0)!);
  const [value, setValue] = useState();

  const enumValue = enumVar.value[key];
  const variable =
    enumValue === undefined
      ? undefined
      : enumValue.type === "lookupEntry"
        ? enumValue.value
        : enumValue;

  useEffect(() => {
    onChangeValue({ type: key, value });
  }, [key, onChangeValue, value]);

  return (
    <div>
      <select value={key} onChange={(event) => setKey(event.target.value)}>
        {keys.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      {variable && (
        // @ts-expect-error TODO: improve Enum type
        <CodecParam variable={variable} onChangeValue={setValue} />
      )}
    </div>
  );
}

type ConnectedAccountParamProps = ParamProps<string>;

function ConnectedAccountParam({ onChangeValue }: ConnectedAccountParamProps) {
  const accounts = useAccounts();
  const [value, setValue] = useState(accounts.at(0)?.address);

  const derivedValue = useMemo(
    () => (value === undefined ? INCOMPLETE : value),
    [value],
  );

  useEffect(() => {
    onChangeValue(derivedValue);
  }, [onChangeValue, derivedValue]);

  return (
    <Select.Root
      items={accounts}
      // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
      itemToString={(account: InjectedPolkadotAccount) =>
        account.name ?? account.address
      }
      // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
      itemToValue={(account: InjectedPolkadotAccount) => account.address}
      value={[value].filter((value) => value !== undefined)}
      onValueChange={(event) => setValue(event.value.at(0))}
    >
      <Select.Label>Account</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select a storage" />
          <ChevronDown />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content
          className={css({ maxHeight: "75dvh", overflow: "auto" })}
        >
          {accounts.map((account) => (
            <Select.Item key={account.address} item={account}>
              <Select.ItemText>
                {account.name ?? account.address}
              </Select.ItemText>
              <Select.ItemIndicator>
                <Check />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}

type CustomAccountParamProps = ParamProps<string> & {
  accountId: AccountId20 | AccountId32;
};

function CustomAccountParam({
  accountId,
  onChangeValue,
}: CustomAccountParamProps) {
  const [value, setValue] = useState("");

  const derivedValue = useMemo(
    () =>
      value.trim() === ""
        ? INCOMPLETE
        : getSs58AddressInfo(value).isValid
          ? value
          : INVALID,
    [value],
  );

  useEffect(() => {
    onChangeValue(derivedValue);
  }, [derivedValue, onChangeValue]);

  return (
    <Input
      type="text"
      placeholder={accountId.type}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

export type AccountIdParamProps = ParamProps<string> & {
  accountId: AccountId20 | AccountId32;
};

export function AccountIdParam({
  accountId,
  onChangeValue,
}: AccountIdParamProps) {
  const accounts = useAccounts();
  const [useCustom, setUseCustom] = useState(accounts.length === 0);

  return (
    // TODO: some weird bug where inner input will trigger switch, need to inverse order for some reason
    <section
      className={css({
        display: "flex",
        flexDirection: "column-reverse",
        gap: "0.5rem",
      })}
    >
      {useCustom ? (
        <CustomAccountParam
          accountId={accountId}
          onChangeValue={onChangeValue}
        />
      ) : (
        <ConnectedAccountParam onChangeValue={onChangeValue} />
      )}
      <Switch
        checked={useCustom}
        onChange={(event) => console.log(event)}
        onCheckedChange={(event) => setUseCustom(event.checked)}
      >
        Use custom account
      </Switch>
    </section>
  );
}

type ArrayParamProps<T> = ParamProps<T[]> & {
  array: ArrayVar;
};

export function ArrayParam<T>({
  array: arrayVar,
  onChangeValue,
}: ArrayParamProps<T>) {
  const [array, setArray] = useState(
    Array.from<ParamInput<T>>({ length: arrayVar.len }).fill(INCOMPLETE),
  );

  const derivedArray = useMemo(
    () =>
      array.some((value) => value === INVALID)
        ? INVALID
        : array.some((value) => value === INCOMPLETE)
          ? INCOMPLETE
          : (array as T[]),
    [array],
  );

  useEffect(() => {
    onChangeValue(derivedArray);
  }, [derivedArray, onChangeValue]);

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      })}
    >
      {Array.from<T>({ length: arrayVar.len }).map((_, index) => (
        <CodecParam
          key={index}
          variable={arrayVar.value}
          onChangeValue={(value) =>
            setArray((array) => array.with(index, value as T))
          }
        />
      ))}
    </div>
  );
}

export type TupleParamProps<T extends Array<unknown>> = ParamProps<T> & {
  tuple: TupleVar;
};

export function TupleParam<T extends Array<unknown>>({
  tuple: tupleVar,
  onChangeValue,
}: TupleParamProps<T>) {
  const [tuple, setTuple] = useState<T>(
    Array.from({ length: tupleVar.value.length }).fill(INCOMPLETE) as T,
  );

  const derivedTuple = useMemo(
    () =>
      tuple.some((value) => value === INVALID)
        ? INVALID
        : tuple.some((value) => value === INCOMPLETE)
          ? INCOMPLETE
          : tuple,
    [tuple],
  );

  useEffect(() => {
    onChangeValue(derivedTuple);
  }, [derivedTuple, onChangeValue]);

  return (
    <>
      {tupleVar.value.map((entry, index) => (
        <CodecParam
          key={index}
          variable={entry}
          onChangeValue={(value) =>
            setTuple((tuple) => tuple.with(index, value) as T)
          }
        />
      ))}
    </>
  );
}

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
      Object.entries(
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

  useEffect(() => {
    onChangeValue(derivedStruct);
  }, [derivedStruct, onChangeValue]);

  return (
    <>
      {Object.entries(structVar.value).map(([key, value]) => (
        <FormLabel key={key}>
          {key}
          <CodecParam
            variable={value}
            onChangeValue={(value) =>
              setStruct((struct) => ({ ...struct, [key]: value }))
            }
          />
        </FormLabel>
      ))}
    </>
  );
}

const StorageParamDepthContext = createContext(0);

export type StorageParamProps<T = unknown> = ParamProps<T> & {
  variable: Var;
};

export function CodecParam<T = unknown>({
  variable,
  ...props
}: StorageParamProps<T>) {
  const depth = useContext(StorageParamDepthContext);

  return (
    <div
      className={css({
        marginStart: "calc(0.5rem * var(--storage-depth))",
      })}
      style={{
        ["--storage-depth" as keyof CssProperties]: depth,
        borderLeft: depth <= 0 ? undefined : "1px dotted currentcolor",
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
            case "sequence":
            case "bitSequence":
            case "result":
              throw new Error("Unsupported key type", { cause: variable.type });
          }
        }, [props, variable])}
      </StorageParamDepthContext.Provider>
    </div>
  );
}
