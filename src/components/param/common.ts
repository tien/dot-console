export const VOID = Symbol();

export const INCOMPLETE = Symbol();

export const INVALID = Symbol();

export type ParamInput<T> = T | typeof INCOMPLETE | typeof INVALID;

export type ParamProps<T> = {
  onChangeValue: (value: ParamInput<T>) => void;
};
