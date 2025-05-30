import type { ChainId } from "@reactive-dot/core";
import { ChainProvider, useChainIds } from "@reactive-dot/react";
import {
  createFileRoute,
  Outlet,
  retainSearchParams,
  Link as RouterLink,
  useLocation,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import CloseIcon from "@w3f/polkadot-icons/solid/Close";
import { ConnectionButton } from "dot-connect/react.js";
import { useRef, useState } from "react";
import { css } from "styled-system/css";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Drawer } from "~/components/ui/drawer";
import { Heading } from "~/components/ui/heading";
import { IconButton } from "~/components/ui/icon-button";
import { Link } from "~/components/ui/link";
import { RadioButtonGroup } from "~/components/ui/radio-button-group";
import { Text } from "~/components/ui/text";
import { getRelayChainId, useCollectivesChainId } from "~/hooks/chain";

const searchSchema = z.object({
  chain: z.string().optional(),
});

export const Route = createFileRoute("/_layout")({
  component: Layout,
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [retainSearchParams(["chain"])],
  },
});

function useRouteChainId() {
  const { chain: searchChainId } = Route.useSearch();
  return (
    (searchChainId?.replaceAll("-", "_") as ChainId | undefined) ?? "polkadot"
  );
}

function Layout() {
  const chainId = useRouteChainId();

  return (
    <ChainProvider key={chainId} chainId={chainId}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
        })}
      >
        <TopBar />
        <main className={css({ display: "contents" })}>
          <ChainProvider key={chainId} chainId={chainId}>
            <Outlet />
          </ChainProvider>
        </main>
      </div>
    </ChainProvider>
  );
}

function TopBar() {
  const [hidden, setHidden] = useState(false);
  const prevScrollY = useRef<number>(undefined);

  return (
    <header
      ref={(element) => {
        const listener = () => {
          if (element !== null && prevScrollY.current !== undefined) {
            if (globalThis.scrollY > prevScrollY.current) {
              setHidden(true);
            } else {
              setHidden(false);
            }
          }

          prevScrollY.current = globalThis.scrollY;
        };

        globalThis.addEventListener("scroll", listener);

        return () => globalThis.removeEventListener("scroll", listener);
      }}
      data-collapsed={hidden}
      className={css({
        position: "sticky",
        top: 0,
        display: "grid",
        gridTemplateAreas: `
          "branding       wallet-connection"
          "nav            nav"
        `,
        gridTemplateColumns: "max-content 1fr",
        alignItems: "center",
        gap: "1rem",
        backgroundColor: "bg.canvas",
        padding: "1rem 2rem",
        borderBottom: "1px solid",
        zIndex: "sticky",
        transitionDuration: "0.25s",
        "&[data-collapsed='true']": {
          opacity: 0,
          translate: "0 -100%",
        },
        "@media(min-width: 68rem)": {
          gridTemplateAreas: `"branding nav wallet-connection"`,
          gridTemplateColumns: "max-content 1fr max-content",
        },
      })}
    >
      <section className={css({ gridArea: "branding" })}>
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
          gridArea: "nav",
          display: "flex",
          gap: "1rem",
          overflow: "auto",
          "@media(min-width: 68rem)": {
            justifySelf: "end",
            flexDirection: "row-reverse",
          },
        })}
      >
        <ChainSelect />
        <nav
          className={css({
            display: "flex",
            gap: "1.5rem",
            "@media(min-width: 68rem)": {
              justifyContent: "end",
            },
          })}
        >
          <Link asChild>
            <RouterLink
              to="/explorer"
              activeProps={{
                className: css({ color: "colorPalette.default" }),
              }}
            >
              Explorer
            </RouterLink>
          </Link>
          <Link asChild>
            <RouterLink
              to="/queries"
              activeProps={{
                className: css({ color: "colorPalette.default" }),
              }}
            >
              Queries
            </RouterLink>
          </Link>
          <Link asChild>
            <RouterLink
              to="/extrinsics"
              activeProps={{
                className: css({ color: "colorPalette.default" }),
              }}
            >
              Extrinsics
            </RouterLink>
          </Link>
          <Link asChild>
            <RouterLink
              to="/assets"
              activeProps={{
                className: css({ color: "colorPalette.default" }),
              }}
            >
              Assets
            </RouterLink>
          </Link>
          <Link asChild>
            <RouterLink
              to="/staking"
              activeProps={{
                className: css({ color: "colorPalette.default" }),
              }}
            >
              Staking
            </RouterLink>
          </Link>
          <Link asChild>
            <RouterLink
              to="/referenda"
              activeProps={{
                className: css({ color: "colorPalette.default" }),
              }}
            >
              Referenda
            </RouterLink>
          </Link>
          <CollectivesNavItem />
          <Link asChild>
            <RouterLink
              to="/accounts"
              activeProps={{
                className: css({ color: "colorPalette.default" }),
              }}
            >
              Accounts
            </RouterLink>
          </Link>
          <Link asChild>
            <RouterLink
              to="/utilities"
              activeProps={{
                className: css({ color: "colorPalette.default" }),
              }}
            >
              Utilities
            </RouterLink>
          </Link>
        </nav>
      </div>
      <div
        className={css({
          gridArea: "wallet-connection",
          justifySelf: "end",
          display: "flex",
          alignItems: "center",
        })}
      >
        <div
          className={css({
            marginRight: "1rem",
            borderRightWidth: 1,
            paddingRight: "1rem",
          })}
        >
          <ConnectionButton className={css({})} />
        </div>
        <a
          href="https://github.com/tien/dot-console"
          target="_blanck"
          className={css({ display: "contents" })}
        >
          <svg
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 98 96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
              fill="currentcolor"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}

function ChainSelect() {
  const chainId = useRouteChainId();

  const location = useLocation();
  const chainIds = useChainIds();

  const groupedChainIds = Object.groupBy(chainIds, getRelayChainId);

  return (
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
            <Drawer.CloseTrigger asChild position="absolute" top="3" right="4">
              <IconButton variant="ghost">
                <CloseIcon fill="currentcolor" />
              </IconButton>
            </Drawer.CloseTrigger>
          </Drawer.Header>
          <Drawer.Body>
            <Drawer.Context>
              {({ setOpen }) => (
                <RadioButtonGroup.Root
                  variant="outline"
                  value={chainId}
                  display="flex"
                  flexDirection="column"
                  gap="1rem"
                >
                  {Object.entries(groupedChainIds).map(
                    ([relayChainId, chainIds]) => (
                      <section key={relayChainId}>
                        <header
                          className={css({
                            textStyle: "sm",
                            marginBottom: "0.35em",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          })}
                        >
                          {relayChainId.replaceAll("_", " ")}
                        </header>
                        <div
                          className={css({
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "0.3em 0.4em",
                            width: "stretch",
                          })}
                        >
                          {chainIds.map((chainId) => (
                            <RouterLink
                              key={chainId}
                              to={location.pathname}
                              search={{ chain: chainId.replaceAll("_", "-") }}
                              onClick={() => setOpen(false)}
                              className={css({ display: "contents" })}
                            >
                              <RadioButtonGroup.Item value={chainId}>
                                <RadioButtonGroup.ItemControl />
                                <RadioButtonGroup.ItemText textTransform="capitalize">
                                  {chainId
                                    .replace(relayChainId, "")
                                    .replaceAll("_", " ")
                                    .trim() || "Relay"}
                                </RadioButtonGroup.ItemText>
                                <RadioButtonGroup.ItemHiddenInput />
                              </RadioButtonGroup.Item>
                            </RouterLink>
                          ))}
                        </div>
                      </section>
                    ),
                  )}
                </RadioButtonGroup.Root>
              )}
            </Drawer.Context>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}

function CollectivesNavItem() {
  return useCollectivesChainId(false) === undefined ? null : (
    <Link asChild>
      <RouterLink
        to="/collectives"
        activeProps={{
          className: css({ color: "colorPalette.default" }),
        }}
      >
        Collectives
      </RouterLink>
    </Link>
  );
}
