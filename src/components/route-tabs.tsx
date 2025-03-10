import { Badge } from "./ui/badge";
import {
  Link,
  Outlet,
  useLocation,
  type LinkProps,
} from "@tanstack/react-router";
import type { PropsWithChildren, ReactNode } from "react";
import { css } from "styled-system/css";
import type {
  ConditionalValue,
  CssVars,
  CssProperties,
  AnyString,
} from "styled-system/types";
import type { UtilityValues } from "styled-system/types/prop-type";
import { Tabs } from "~/components/ui/tabs";

type RouteTabsProps = PropsWithChildren<{
  marginBottom?: ConditionalValue<
    UtilityValues["margin"] | CssVars | CssProperties["margin"] | AnyString
  >;
}>;

export const RouteTabs = Object.assign(
  ({ children, marginBottom }: RouteTabsProps) => {
    const location = useLocation();

    return (
      <div>
        <Tabs.Root
          value={location.pathname}
          className={css({ margin: "1rem 0 2rem 0", marginBottom })}
        >
          <Tabs.List>
            {children}
            <Tabs.Indicator />
          </Tabs.List>
        </Tabs.Root>
        <Outlet />
      </div>
    );
  },
  { Item: RouteTabsItem },
);

type RouteTabsItemProps = {
  to: NonNullable<LinkProps["to"]>;
  label: ReactNode;
  badge?: ReactNode;
};

function RouteTabsItem({ to, label, badge }: RouteTabsItemProps) {
  return (
    <Tabs.Trigger value={to} asChild>
      <Link to={to}>
        {label}
        {badge && (
          <span className={css({ "&:has(> div:empty)": { display: "none" } })}>
            {" "}
            <Badge>{badge}</Badge>
          </span>
        )}
      </Link>
    </Tabs.Trigger>
  );
}
