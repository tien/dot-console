import { FixedSizeBinary, Binary } from "@polkadot-api/substrate-bindings";

export function stringifyCodec(variable: unknown) {
  return JSON.stringify(
    variable,
    (_, value) => {
      if (typeof value === "bigint") {
        return value.toLocaleString();
      }

      if (value instanceof FixedSizeBinary) {
        return value.asHex();
      }

      if (value instanceof Binary) {
        return value.asText();
      }

      return value;
    },
    2,
  );
}

export function unbinary(data: unknown): unknown {
  if (data instanceof FixedSizeBinary) {
    return data.asHex();
  }

  if (data instanceof Binary) {
    return data.asText();
  }

  if (typeof data !== "object") {
    return data;
  }

  if (data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(unbinary);
  }

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, unbinary(value)] as const),
  );
}

export function memoize<TArguments extends unknown[], TReturn>(
  func: (...args: TArguments) => TReturn,
): (...args: TArguments) => TReturn {
  const voidSymbol = Symbol();
  let value: TReturn | typeof voidSymbol = voidSymbol;

  return (...args: TArguments) => {
    if (value !== voidSymbol) {
      return value;
    }

    value = func(...args);
    return value;
  };
}
