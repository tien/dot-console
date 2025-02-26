import { Heading } from "./ui/heading";
import type { PropsWithChildren, ReactNode } from "react";
import { css, cx } from "styled-system/css";

type InfoHeaderProps = PropsWithChildren<{
  className?: string | undefined;
}>;

export const InfoHeader = Object.assign(
  ({ className, children }: InfoHeaderProps) => (
    <section
      className={cx(
        className,
        css({
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          "&>*": {
            flex: 1,
            padding: "0 1rem",
          },
          "@media(min-width: 68rem)": {
            flexDirection: "row",
            "&>*:not(:first-child)": {
              borderLeft: "1px solid",
            },
          },
        }),
      )}
    >
      {children}
    </section>
  ),
  { Item: InfoHeaderItem },
);

type InfoHeaderItemProps = PropsWithChildren<{
  title: ReactNode;
}>;

function InfoHeaderItem({ title, children }: InfoHeaderItemProps) {
  return (
    <article>
      <header>
        <Heading as="h3">{title}</Heading>
      </header>
      <div>{children}</div>
    </article>
  );
}
