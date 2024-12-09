import { Tooltip as BaseTooltip } from "./ui/tooltip";
import type { PropsWithChildren, ReactNode } from "react";
import { css } from "styled-system/css";

export type TooltipProps = PropsWithChildren<{
  tooltip: ReactNode;
}>;

export function TooltipBox({ tooltip, children }: TooltipProps) {
  return (
    <BaseTooltip.Root openDelay={250} closeDelay={0}>
      <BaseTooltip.Trigger>{children}</BaseTooltip.Trigger>
      <BaseTooltip.Positioner>
        <BaseTooltip.Content
          className={css({
            fontSize: "xs",
            backgroundColor: "colorPalette.default",
            color: "colorPalette.fg",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            zIndex: 1,
          })}
        >
          {tooltip}
        </BaseTooltip.Content>
      </BaseTooltip.Positioner>
    </BaseTooltip.Root>
  );
}
