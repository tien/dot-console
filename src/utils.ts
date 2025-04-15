import type { IdentityData } from ".papi/descriptors/dist";
import { Binary } from "@polkadot-api/substrate-bindings";

export function stringifyCodec(variable: unknown) {
  return JSON.stringify(
    variable,
    (_, value) => {
      if (typeof value === "bigint") {
        return value.toLocaleString();
      }

      if (value instanceof Binary) {
        return bytesToString(value);
      }

      return value;
    },
    2,
  );
}

export function unbinary(data: unknown): unknown {
  if (data instanceof Binary) {
    return bytesToString(data);
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

const textDecoder = new TextDecoder("utf-8", { fatal: true });

export function bytesToString(value: Binary) {
  if (value.asText() === "") {
    return "";
  }

  try {
    const bytes = value.asBytes();
    if (bytes.slice(0, 5).every((b) => b < 32)) throw null;
    return textDecoder.decode(bytes);
  } catch {
    return value.asHex();
  }
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

export function mergeUint8(...inputs: Array<Uint8Array>): Uint8Array {
  const totalLen = inputs.reduce((acc, a) => acc + a.byteLength, 0);
  const result = new Uint8Array(totalLen);

  for (let idx = 0, at = 0; idx < inputs.length; idx++) {
    const current = inputs[idx];
    result.set(current!, at);
    at += current!.byteLength;
  }

  return result;
}

export function getIdentityDisplayValue(
  identityData: IdentityData | undefined,
) {
  const value = identityData?.value;

  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  return value.asText();
}

export function ellipsize(value: string, length: number) {
  return value.slice(0, length) + "..." + value.slice(-length);
}

export function range(start: number, end: number) {
  return Array.from({ length: end - start }, (_, k) => k + start);
}
