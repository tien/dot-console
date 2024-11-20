import * as StyledSwitch from "./styled/switch";
import { forwardRef } from "react";

export interface SwitchProps extends StyledSwitch.RootProps {}

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  (props, ref) => {
    const { children, ...rootProps } = props;

    return (
      <StyledSwitch.Root ref={ref} {...rootProps}>
        <StyledSwitch.Control>
          <StyledSwitch.Thumb />
        </StyledSwitch.Control>
        {children && <StyledSwitch.Label>{children}</StyledSwitch.Label>}
        <StyledSwitch.HiddenInput />
      </StyledSwitch.Root>
    );
  },
);

Switch.displayName = "Switch";
