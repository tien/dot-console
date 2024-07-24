import { ConstantQueryForm } from "../../components/constant-form";
import { QueryResult } from "../../components/query-result";
import { RuntimeApiForm } from "../../components/runtime-api-form";
import { StorageQueryForm } from "../../components/storage-form";
import { Heading, Progress, Tabs } from "../../components/ui";
import { Query } from "../../types";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { css } from "styled-system/css";

export const Route = createFileRoute("/_layout/query")({
  component: QueryPage,
});

function QueryPage() {
  const [queries, setQueries] = useState<Query[]>([]);

  const tabOptions = [
    { id: "storage", label: "Storage" },
    { id: "constants", label: "Constants" },
    { id: "apis", label: "Runtime APIs" },
  ];

  return (
    <>
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
            <Tabs.Content
              value="storage"
              className={css({ display: "contents" })}
            >
              <StorageQueryForm
                onAddQuery={(query) =>
                  setQueries((queries) => [...queries, query])
                }
              />
            </Tabs.Content>
            <Tabs.Content
              value="constants"
              className={css({ display: "contents" })}
            >
              <ConstantQueryForm
                onAddQuery={(query) =>
                  setQueries((queries) => [...queries, query])
                }
              />
            </Tabs.Content>
            <Tabs.Content value="apis" className={css({ display: "contents" })}>
              <RuntimeApiForm
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
                <QueryResult
                  query={query}
                  onDelete={() =>
                    setQueries((queries) =>
                      queries
                        .with(index, undefined as unknown as Query)
                        .filter((query) => query !== undefined),
                    )
                  }
                />
              </Suspense>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
