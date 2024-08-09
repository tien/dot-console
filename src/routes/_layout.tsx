import {
  Button,
  Drawer,
  Heading,
  IconButton,
  Link,
  Text,
} from "../components/ui";
import { Spinner } from "../components/ui/spinner";
import type { ChainId } from "@reactive-dot/core";
import { ReDotChainProvider, useBlock } from "@reactive-dot/react";
import {
  createFileRoute,
  Outlet,
  Link as RouterLink,
} from "@tanstack/react-router";
import CloseIcon from "@w3f/polkadot-icons/solid/Close";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { css } from "styled-system/css";

type Search = {
  chain?: string | undefined;
};

export const Route = createFileRoute("/_layout")({
  component: Layout,
  validateSearch: (input): Search => ({
    chain: input["chain"] as ChainId | undefined,
  }),
});

function Layout() {
  // TODO: replace with dedicated hook once that is available
  const chainIds = [
    "polkadot",
    "polkadot_asset_hub",
    "polkadot_collectives",
    "polkadot_people",
    "kusama",
    "kusama_asset_hub",
    "kusama_people",
    "paseo",
    "westend",
    "westend_asset_hub",
    "westend_collectives",
    "westend_people",
  ] as const satisfies ChainId[];

  const { chain: _searchChainId } = Route.useSearch();
  const searchChainId = _searchChainId?.replaceAll("-", "_") as
    | ChainId
    | undefined;

  const [chainId, setChainId] = useState<ChainId>(searchChainId ?? "polkadot");

  useEffect(() => {
    if (searchChainId !== undefined) {
      setChainId(searchChainId);
    }
  }, [searchChainId]);

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
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
        <section>
          <RouterLink to="/">
            <Heading as="h1" size="2xl">
              📟 ĐÓTConsole
            </Heading>
          </RouterLink>
          <Text as="p" size="xs" className={css({ fontFamily: "monospace" })}>
            <Link href="https://reactivedot.dev/" target="_blank">
              ReactiveDOT
            </Link>{" "}
            ×{" "}
            <Link href="https://papi.how/" target="_blank">
              PAPI
            </Link>
          </Text>
        </section>
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
                to="/statistics"
                activeProps={{ className: css({ color: "accent.default" }) }}
              >
                Statistics
              </RouterLink>
            </Link>
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
            <Link asChild>
              <RouterLink
                to="/accounts"
                activeProps={{ className: css({ color: "accent.default" }) }}
              >
                Accounts
              </RouterLink>
            </Link>
          </nav>
          <Drawer.Root>
            <div
              className={css({
                borderRightWidth: 1,
                borderLeftWidth: 1,
                padding: "0 0.5rem",
              })}
            >
              <Drawer.Trigger asChild>
                <Button
                  variant="ghost"
                  className={css({ textTransform: "capitalize" })}
                >
                  {chainId.replaceAll("_", " ")}
                </Button>
              </Drawer.Trigger>
            </div>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Chain</Drawer.Title>
                  <Drawer.Description>Select a chain</Drawer.Description>
                  <Drawer.CloseTrigger
                    asChild
                    position="absolute"
                    top="3"
                    right="4"
                  >
                    <IconButton variant="ghost">
                      <CloseIcon fill="currentcolor" />
                    </IconButton>
                  </Drawer.CloseTrigger>
                </Drawer.Header>
                <Drawer.Body className={css({ display: "flex", gap: "1rem" })}>
                  <Drawer.Context>
                    {({ setOpen }) =>
                      chainIds.map((chainId) => (
                        <RouterLink
                          key={chainId}
                          search={{ chain: chainId.replaceAll("_", "-") }}
                          className={css({ display: "contents" })}
                        >
                          <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className={css({ textTransform: "capitalize" })}
                          >
                            {chainId.replaceAll("_", " ")}
                          </Button>
                        </RouterLink>
                      ))
                    }
                  </Drawer.Context>
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Drawer.Root>
          <dc-connection-button />
        </div>
      </header>
      <main className={css({ display: "contents" })}>
        <ReDotChainProvider key={chainId} chainId={chainId}>
          <Suspense fallback={<SuspenseFallback />}>
            <Outlet />
          </Suspense>
        </ReDotChainProvider>
      </main>
    </div>
  );
}

function SuspenseFallback() {
  return (
    <div
      className={css({
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
        textAlign: "center",
      })}
    >
      <Spinner size="xl" />
      <ProgressText />
    </div>
  );
}

function ProgressText() {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={<Text>Syncing light client</Text>}>
        <DataLoadingText />
      </Suspense>
    </ErrorBoundary>
  );
}

function DataLoadingText() {
  // Best way to do health check for now
  // https://github.com/polkadot-api/polkadot-api/issues/222
  useBlock();

  return <Text>Loading data</Text>;
}
