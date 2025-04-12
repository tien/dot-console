import type { Query } from "../types";
import { stringifyCodec } from "../utils";
import { CodecView } from "./codec-view";
import { Card } from "./ui/card";
import { Code } from "./ui/code";
import { FormLabel } from "./ui/form-label";
import { IconButton } from "./ui/icon-button";
import { Progress } from "./ui/progress";
import { useLazyLoadQuery, useQueryErrorResetter } from "@reactive-dot/react";
import Close from "@w3f/polkadot-icons/solid/Close";
import Refresh from "@w3f/polkadot-icons/solid/RefreshRedo";
import {
  type PropsWithChildren,
  Suspense,
  useMemo,
  useState,
  useTransition,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { css } from "styled-system/css";

type StorageQueryResultProps = {
  query: Query;
  onDelete: () => void;
};

export function QueryResult(props: StorageQueryResultProps) {
  return (
    <QueryErrorBoundary onDelete={props.onDelete}>
      <Suspense fallback={<Progress type="linear" value={null} />}>
        <SuspendableQueryResult {...props} />
      </Suspense>
    </QueryErrorBoundary>
  );
}

function SuspendableQueryResult({ query, onDelete }: StorageQueryResultProps) {
  const queryArgs = useMemo(() => {
    switch (query.type) {
      case "constant":
        return [];
      case "storage":
      case "storage-entries":
        return query.key;
      case "api":
        return query.args;
    }
  }, [query]);

  const [fetchCount, setFetchCount] = useState(0);

  const result = useLazyLoadQuery(
    (builder) => {
      switch (query.type) {
        case "constant":
          return builder.constant(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.pallet as any,
            query.constant,
          );
        case "storage":
          return builder.storage(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.pallet as any,
            query.storage,
            queryArgs,
          );
        case "storage-entries":
          return builder.storageEntries(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.pallet as any,
            query.storage,
            queryArgs,
          );
        case "api":
          return builder.runtimeApi(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query.api as any,
            query.method,
            queryArgs,
          );
      }
    },
    { chainId: query.chainId, fetchKey: fetchCount },
  );

  const refreshable = query.type === "api";

  const [isPending, startTransition] = useTransition();

  const refresh = () =>
    startTransition(() => setFetchCount((count) => count + 1));

  const unwrappedQueryArgs =
    queryArgs.length === 1 ? queryArgs.at(0) : queryArgs;

  const queryPath = useMemo(() => {
    switch (query.type) {
      case "constant":
        return [query.pallet, query.constant] as const;
      case "storage":
      case "storage-entries":
        return [query.pallet, query.storage] as const;
      case "api":
        return [query.api, query.method] as const;
    }
  }, [query]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
          })}
        >
          {useMemo(() => {
            switch (query.type) {
              case "constant":
                return "Constant";
              case "storage":
                return "Storage";
              case "storage-entries":
                return "Storage entries";
              case "api":
                return "Runtime API";
            }
          }, [query.type])}
          <div className={css({ display: "flex", gap: "0.5rem" })}>
            {refreshable && (
              <IconButton
                variant="ghost"
                disabled={isPending}
                onClick={refresh}
              >
                <Refresh fill="currentcolor" />
              </IconButton>
            )}
            <IconButton variant="ghost" onClick={() => onDelete()}>
              <Close fill="currentcolor" />
            </IconButton>
          </div>
        </Card.Title>
        <Card.Description>
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            })}
          >
            <FormLabel className={css({ display: "block" })}>
              Chain ID: <Code>{query.chainId}</Code>
            </FormLabel>
            <FormLabel className={css({ display: "block" })}>
              Path: <Code>{queryPath.join("/")}</Code>
            </FormLabel>
            {queryArgs.length > 0 && (
              <FormLabel className={css({ display: "block" })}>
                Key: <Code>{stringifyCodec(unwrappedQueryArgs)}</Code>
              </FormLabel>
            )}
          </div>
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <FormLabel className={css({ marginBottom: "0.5rem" })}>
          Result
        </FormLabel>
        <CodecView value={result} />
      </Card.Body>
    </Card.Root>
  );
}

type QueryErrorBoundaryProps = PropsWithChildren<{
  onDelete: () => void;
}>;

function QueryErrorBoundary({ onDelete, children }: QueryErrorBoundaryProps) {
  const resetQueryError = useQueryErrorResetter();

  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <Card.Root>
          <Card.Header>
            <Card.Title
              className={css({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "rem",
              })}
            >
              <div>Error fetching query</div>
              <IconButton variant="ghost" onClick={() => resetErrorBoundary()}>
                <Close fill="currentcolor" />
              </IconButton>
            </Card.Title>
          </Card.Header>
        </Card.Root>
      )}
      onReset={() => {
        onDelete();
        resetQueryError();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
