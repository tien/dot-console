import { Button } from "../ui/button";
import { Collapsible } from "../ui/collapsible";
import ChevronDownIcon from "@w3f/polkadot-icons/solid/ChevronDown";
import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { css, cx } from "styled-system/css";

type CollapsibleParamProps = PropsWithChildren<{
  label: ReactNode;
  leadingLabel?: ReactNode;
  trailingLabel?: ReactNode;
  style?: CSSProperties;
  className?: string;
}>;

export function CollapsibleParam({
  label,
  leadingLabel,
  trailingLabel,
  style,
  className,
  children,
}: CollapsibleParamProps) {
  return (
    <Collapsible.Root
      defaultOpen
      style={style}
      className={cx(
        className,
        css({
          borderRadius: "md",
          overflow: "hidden",
          "&:has(>:first-child:hover)": {
            backgroundColor: "bg.subtle",
          },
        }),
      )}
    >
      <Collapsible.Trigger asChild>
        <Button variant="link" justifyContent="start" width="stretch">
          {leadingLabel}
          <Collapsible.Context>
            {({ open }) => (
              <ChevronDownIcon
                fill="currentcolor"
                style={{ rotate: !open ? "-90deg" : undefined }}
                className={css({ width: "0.75em", height: "0.75em" })}
              />
            )}
          </Collapsible.Context>
          {label}
          {trailingLabel !== undefined && (
            <div className={css({ marginStart: "auto" })}>{trailingLabel}</div>
          )}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
}
