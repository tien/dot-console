import { ConstantSelect } from "./components/constant";
import { QueryResult } from "./components/query-result";
import { StorageSelect } from "./components/storage";
import { Heading, Progress, Select, Tabs } from "./components/ui";
import config from "./config";
import type { Pallet, Query } from "./types";
import { metadata as metadataCodec } from "@polkadot-api/substrate-bindings";
import {
  ReDotChainProvider,
  ReDotProvider,
  useLazyLoadQuery,
} from "@reactive-dot/react";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { registerDotConnect } from "dot-connect";
import { Suspense, useState } from "react";
import { css } from "styled-system/css";

registerDotConnect({ wallets: config.wallets });

function DApp() {
  const rawMetadata = useLazyLoadQuery((builder) =>
    builder.callApi("Metadata", "metadata", []),
  );

  const { metadata } = metadataCodec.dec(rawMetadata.asBytes());

  if (metadata.tag !== "v14" && metadata.tag !== "v15") {
    throw new Error();
  }

  const [palletIndex, setPalletIndex] = useState(
    metadata.value.pallets.at(0)!.index,
  );

  const pallet = metadata.value.pallets.find(
    (pallet) => pallet.index === palletIndex,
  );

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
              <div
                className={css({
                  display: "grid",
                  gridTemplateAreas: `
                    "pallet storage"
                    "key    key"
                    "submit submit"
                  `,
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: "1rem",
                })}
              >
                <Select.Root
                  items={metadata.value.pallets}
                  // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
                  itemToString={(pallet: Pallet) => pallet.name}
                  // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
                  itemToValue={(pallet: Pallet) => pallet.index}
                  // @ts-expect-error ark-ui type error
                  value={[palletIndex]}
                  onValueChange={(event) => {
                    const pallet = event.items.at(0) as Pallet;

                    setPalletIndex(pallet.index);
                  }}
                  className={css({ gridArea: "pallet" })}
                >
                  <Select.Label>Pallet</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select a pallet" />
                      <ChevronDown />
                    </Select.Trigger>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content
                      className={css({ maxHeight: "75dvh", overflow: "auto" })}
                    >
                      {metadata.value.pallets
                        .toSorted((a, b) => a.name.localeCompare(b.name))
                        .map((pallet) => (
                          <Select.Item key={pallet.index} item={pallet}>
                            <Select.ItemText>{pallet.name}</Select.ItemText>
                            <Select.ItemIndicator>
                              <Check />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
                {pallet && (
                  <>
                    <Tabs.Content value="storage" asChild>
                      <StorageSelect
                        pallet={pallet}
                        onAddQuery={(query) =>
                          setQueries((queries) => [...queries, query])
                        }
                      />
                    </Tabs.Content>
                    <Tabs.Content value="constants" asChild>
                      <ConstantSelect
                        pallet={pallet}
                        onAddQuery={(query) =>
                          setQueries((queries) => [...queries, query])
                        }
                      />
                    </Tabs.Content>
                  </>
                )}
              </div>
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
