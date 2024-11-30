export const VOID = Symbol("DotConsole.void");

export const INCOMPLETE = Symbol("DotConsole.incomplete");

export const INVALID = Symbol("DotConsole.invalid");

export type ParamInput<T> = T | typeof INCOMPLETE | typeof INVALID;

export type ParamProps<T> = {
  onChangeValue: (value: ParamInput<T>) => void;
};

export const integerPrimitives = {
  i8: {
    min: -128,
    max: 127,
  },
  u8: {
    min: 0,
    max: 255,
  },
  i16: {
    min: -32768,
    max: 32767,
  },
  u16: {
    min: 0,
    max: 65535,
  },
  i32: {
    min: -2147483648,
    max: 2147483647,
  },
  u32: {
    min: 0,
    max: 4294967295,
  },
  i64: {
    min: -9223372036854775808n,
    max: 9223372036854775807n,
  },
  u64: {
    min: 0,
    max: 18446744073709551615n,
  },
  i128: {
    min: -170141183460469231731687303715884105728n,
    max: 170141183460469231731687303715884105727n,
  },
  u128: {
    min: 0,
    max: 340282366920938463463374607431768211455n,
  },
  i256: {
    min: -57896044618658097711785492504343953926634992332820282019728792003956564819968n,
    max: 57896044618658097711785492504343953926634992332820282019728792003956564819967n,
  },
  u256: {
    min: 0,
    max: 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
  },
} as const;
