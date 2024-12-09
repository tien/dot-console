import { Spinner } from "./ui/spinner";
import { Text } from "./ui/text";
import type { ReactNode } from "react";
import { css, cx } from "styled-system/css";
import type { SpinnerVariant } from "styled-system/recipes";

export type CircularProgressIndicatorProps = {
  size?: SpinnerVariant["size"];
  label?: ReactNode;
  className?: string;
};

export function CircularProgressIndicator({
  size,
  label,
  className,
}: CircularProgressIndicatorProps) {
  if (label === undefined) {
    return <Spinner size={size} className={className} />;
  }

  return (
    <div
      className={cx(
        className,
        css({
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          width: "fit-content",
          textAlign: "center",
        }),
      )}
    >
      <Spinner size={size} />
      <Text color="fg.muted" size={size}>
        {label}
      </Text>
    </div>
  );
}
