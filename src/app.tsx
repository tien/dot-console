import { ConstantQueryForm } from "./components/constant-form";
import { QueryResult } from "./components/query-result";
import { StorageQueryForm } from "./components/storage-form";
import { Heading, Progress, Tabs } from "./components/ui";
import config from "./config";
import type { Query } from "./types";
import { ReDotChainProvider, ReDotProvider } from "@reactive-dot/react";
import { registerDotConnect } from "dot-connect";
import { Suspense, useState } from "react";
import { css } from "styled-system/css";

registerDotConnect({ wallets: config.wallets });

function DApp() {
  const [queries, setQueries] = useState<Query[]>([]);

  const tabOptions = [
    {
      id: "storage",
      label: "Storage",
    },
    { id: "constants", label: "Constants" },
  ];

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
      })}
    >
      <header
        className={css({
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem 2rem",
          borderBottom: "1px solid currentcolor",
        })}
      >
        <Heading as="h1" size="2xl">
          📟 ĐÓTConsole
        </Heading>
        <dc-connection-button />
      </header>
      <main
        className={css({
          flex: "1 1 0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          "@media(min-width: 68rem)": {
            flexDirection: "row",
          },
        })}
      >
        <aside
          className={css({
            overflow: "auto",
            borderBottom: "1px solid currentcolor",
            padding: "2rem",
            "@media(min-width: 68rem)": {
              flexBasis: "30rem",
              borderBottom: "none",
              borderRight: "1px solid currentcolor",
            },
          })}
        >
          <Tabs.Root defaultValue="storage" lazyMount unmountOnExit>
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              })}
            >
              <Tabs.List>
                {tabOptions.map((option) => (
                  <Tabs.Trigger
                    key={option.id}
                    value={option.id}
                    disabled={option.id === "svelte"}
                  >
                    {option.label}
                  </Tabs.Trigger>
                ))}
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Content value="storage" asChild>
                <StorageQueryForm
                  onAddQuery={(query) =>
                    setQueries((queries) => [...queries, query])
                  }
                />
              </Tabs.Content>
              <Tabs.Content value="constants" asChild>
                <ConstantQueryForm
                  onAddQuery={(query) =>
                    setQueries((queries) => [...queries, query])
                  }
                />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </aside>
        <section
          className={css({
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          })}
        >
          <header
            className={css({
              padding: "2rem 2rem 0 2rem",
              marginBottom: "1rem",
            })}
          >
            <Heading as="h2" size="xl">
              Result
            </Heading>
          </header>
          <div
            className={css({
              flex: 1,
              padding: "0 2rem 2rem 2rem",
            })}
          >
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              })}
            >
              {queries.toReversed().map((query, index) => (
                <Suspense
                  key={index}
                  fallback={<Progress type="linear" value={null} />}
                >
                  <QueryResult query={query} />
                </Suspense>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ReDotProvider config={config}>
      <ReDotChainProvider chainId="polkadot">
        <Suspense fallback={<Progress type="circular" value={null} />}>
          <DApp />
        </Suspense>
      </ReDotChainProvider>
    </ReDotProvider>
  );
}
