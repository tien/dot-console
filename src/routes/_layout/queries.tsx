import { ConstantQueryForm } from "../../components/constant-form";
import { QueryResult } from "../../components/query-result";
import { RuntimeApiForm } from "../../components/runtime-api-form";
import { StorageForm } from "../../components/storage-form";
import type { Query } from "../../types";
import { createFileRoute } from "@tanstack/react-router";
import { atom, useAtom } from "jotai";
import { Suspense, useRef } from "react";
import { css } from "styled-system/css";
import { Heading } from "~/components/ui/heading";
import { Progress } from "~/components/ui/progress";
import { Spinner } from "~/components/ui/spinner";
import { Tabs } from "~/components/ui/tabs";

export const Route = createFileRoute("/_layout/queries")({
  component: QueryPage,
});

const queriesAtom = atom([] as Query[]);

function QueryPage() {
  const queriesContainerRef = useRef<HTMLElement>(null);
  const [queries, _setQueries] = useAtom(queriesAtom);

  const addQuery = (query: Query) => {
    _setQueries((queries) => [...queries, query]);
    queriesContainerRef.current?.scroll({ top: 0, behavior: "smooth" });
  };

  const deleteQuery = (query: Query) => {
    _setQueries((queries) =>
      queries
        .with(
          queries.findIndex((stateQuery) => stateQuery.id === query.id),
          undefined as unknown as Query,
        )
        .filter((query) => query !== undefined),
    );
  };

  const tabOptions = [
    { id: "storage", label: "Storage" },
    { id: "constants", label: "Constants" },
    { id: "apis", label: "Runtime APIs" },
  ];

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        "@media(min-width: 68rem)": {
          flex: "1 1 0",
          flexDirection: "row",
          overflow: "hidden",
        },
      })}
    >
      <aside
        className={css({
          borderBottom: "1px solid",
          padding: "2rem",
          "@media(min-width: 68rem)": {
            flexBasis: "32rem",
            borderBottom: "none",
            borderRight: "1px solid",
            overflow: "auto",
          },
        })}
      >
        <Suspense
          fallback={
            <div
              className={css({
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              })}
            >
              <Spinner size="xl" />
            </div>
          }
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
                <StorageForm onAddQuery={addQuery} />
              </Tabs.Content>
              <Tabs.Content
                value="constants"
                className={css({ display: "contents" })}
              >
                <ConstantQueryForm onAddQuery={addQuery} />
              </Tabs.Content>
              <Tabs.Content
                value="apis"
                className={css({ display: "contents" })}
              >
                <RuntimeApiForm onAddQuery={addQuery} />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </Suspense>
      </aside>
      <section
        ref={queriesContainerRef}
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
            {queries.toReversed().map((query) => (
              <Suspense
                key={query.id}
                fallback={<Progress type="linear" value={null} />}
              >
                <QueryResult
                  query={query}
                  onDelete={() => deleteQuery(query)}
                />
              </Suspense>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
