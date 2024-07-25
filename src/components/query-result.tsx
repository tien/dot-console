import type { Query } from "../types";
import { stringifyCodec, unbinary } from "../utils";
import { Card, Code, FormLabel, IconButton } from "./ui";
import { useLazyLoadQuery } from "@reactive-dot/react";
import Close from "@w3f/polkadot-icons/solid/Close";
import { useMemo } from "react";
import JsonView from "react18-json-view";
import { css } from "styled-system/css";

type StorageQueryResultProps = {
  query: Query;
  onDelete: () => void;
};

export function QueryResult({ query, onDelete }: StorageQueryResultProps) {
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

  const result = useLazyLoadQuery((builder) => {
    switch (query.type) {
      case "constant":
        return builder.getConstant(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          query.pallet as any,
          query.constant,
        );
      case "storage":
        return builder.readStorage(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          query.pallet as any,
          query.storage,
          queryArgs,
        );
      case "storage-entries":
        return builder.readStorageEntries(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          query.pallet as any,
          query.storage,
          queryArgs,
        );
      case "api":
        return builder.callApi(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          query.api as any,
          query.method,
          queryArgs,
        );
    }
  });

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
          <IconButton variant="ghost" onClick={() => onDelete()}>
            <Close fill="currentcolor" />
          </IconButton>
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
        <Code className={css({ display: "block", padding: "0.5rem" })}>
          <JsonView src={unbinary(result)} theme="atom" dark />
        </Code>
      </Card.Body>
    </Card.Root>
  );
}
