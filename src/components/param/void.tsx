import { ParamProps, VOID } from "./common";
import { useEffect } from "react";

export type VoidParamProps = ParamProps<typeof VOID>;

export function VoidParam({ onChangeValue }: VoidParamProps) {
  useEffect(() => {
    onChangeValue(VOID);
  }, [onChangeValue]);

  return null;
}
