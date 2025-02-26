import {
  Link,
  Outlet,
  useLocation,
  type LinkProps,
} from "@tanstack/react-router";
import type { PropsWithChildren, ReactNode } from "react";
import { css } from "styled-system/css";
import { Tabs } from "~/components/ui/tabs";

export const RouteTabs = Object.assign(
  ({ children }: PropsWithChildren) => {
    const location = useLocation();

    return (
      <div>
        <Tabs.Root
          value={location.pathname}
          className={css({ margin: "1rem 0 2rem 0" })}
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
};

function RouteTabsItem({ to, label }: RouteTabsItemProps) {
  return (
    <Tabs.Trigger value={to} asChild>
      <Link to={to}>{label}</Link>
    </Tabs.Trigger>
  );
}
