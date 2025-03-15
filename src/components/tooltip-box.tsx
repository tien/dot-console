import { Tooltip as BaseTooltip } from "./ui/tooltip";
import type { PropsWithChildren, ReactNode } from "react";
import { css } from "styled-system/css";

export type TooltipProps = PropsWithChildren<{
  tooltip: ReactNode;
}>;

export function TooltipBox({ tooltip, children }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger>{children}</BaseTooltip.Trigger>
      <BaseTooltip.Positioner>
        <BaseTooltip.Arrow>
          <BaseTooltip.ArrowTip />
        </BaseTooltip.Arrow>
        <BaseTooltip.Content
          className={css({
            background: "gray.a12",
            borderRadius: "l2",
            boxShadow: "sm",
            color: "bg.default",
            fontWeight: "semibold",
            px: "3",
            py: "2",
            textStyle: "xs",
            maxWidth: "2xs",
            zIndex: "tooltip",
            _open: {
              animation: "fadeIn 0.25s ease-out",
            },
            _closed: {
              animation: "fadeOut 0.2s ease-out",
            },
          })}
        >
          {tooltip}
        </BaseTooltip.Content>
      </BaseTooltip.Positioner>
    </BaseTooltip.Root>
  );
}
