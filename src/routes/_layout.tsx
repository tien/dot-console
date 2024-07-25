import { Heading, Link, Progress, Select } from "../components/ui";
import type { ChainId } from "@reactive-dot/core";
import { ReDotChainProvider } from "@reactive-dot/react";
import {
  createFileRoute,
  Outlet,
  Link as RouterLink,
} from "@tanstack/react-router";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { Suspense, useState } from "react";
import { css } from "styled-system/css";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  // TODO: replace with dedicated hook once that is available
  const chainIds = ["polkadot", "kusama", "paseo"] as const satisfies ChainId[];
  const [chainId, setChainId] = useState(chainIds["0"] as ChainId);

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        "@media(min-width: 68rem)": {
          height: "100dvh",
        },
      })}
    >
      <header
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem 2rem",
          borderBottom: "1px solid",
        })}
      >
        <RouterLink to="/">
          <Heading as="h1" size="2xl">
            📟 ĐÓTConsole
          </Heading>
        </RouterLink>
        <div
          className={css({
            display: "flex",
            gap: "1rem",
          })}
        >
          <nav
            className={css({
              display: "flex",
              gap: "1.5rem",
            })}
          >
            <Link asChild>
              <RouterLink
                to="/query"
                activeProps={{ className: css({ color: "accent.default" }) }}
              >
                Query
              </RouterLink>
            </Link>
            <Link asChild>
              <RouterLink
                to="/extrinsic"
                activeProps={{ className: css({ color: "accent.default" }) }}
              >
                Extrinsic
              </RouterLink>
            </Link>
          </nav>
          <Select.Root
            variant="ghost"
            items={chainIds}
            // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
            itemToString={(chainId) => chainId}
            // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
            itemToValue={(chainId) => chainId}
            value={[chainId]}
            onValueChange={(event) => {
              const chainId = event.items.at(0) as ChainId;

              if (chainId !== undefined) {
                setChainId(chainId);
              }
            }}
            positioning={{ fitViewport: true, sameWidth: true }}
            width={140}
            className={css({
              borderRightWidth: 1,
              borderLeftWidth: 1,
              padding: "0 0.5rem",
            })}
          >
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select a chain" />
                <Select.Indicator>
                  <ChevronDown fill="currentcolor" />
                </Select.Indicator>
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner>
              <Select.Content
                className={css({
                  maxHeight: "max(50dvh, 8rem)",
                  overflow: "auto",
                })}
              >
                {chainIds.map((chainId) => (
                  <Select.Item key={chainId} item={chainId}>
                    <Select.ItemText>{chainId}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check fill="currentcolor" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
          <dc-connection-button />
        </div>
      </header>
      <main className={css({ display: "contents" })}>
        <ReDotChainProvider key={chainId} chainId={chainId}>
          <Suspense
            fallback={
              <div
                className={css({
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                })}
              >
                <Progress type="circular" value={null} />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </ReDotChainProvider>
      </main>
    </div>
  );
}
