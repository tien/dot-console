import type { Query } from "../types";
import { stringifyCodec } from "../utils";
import { VOID } from "./param";
import { Card, Code, FormLabel } from "./ui";
import { useLazyLoadQuery } from "@reactive-dot/react";
import { useMemo } from "react";
import { css } from "styled-system/css";

type StorageQueryResultProps = {
  query: Query;
};

export function QueryResult({ query }: StorageQueryResultProps) {
  const queryArgs = useMemo(() => {
    switch (query.type) {
      case "constant":
        return [];
      case "storage":
        if (query.key === VOID) {
          return [];
        }

        return Array.isArray(query.key) ? query.key : [query.key];
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
        return [query.pallet, query.storage] as const;
      case "api":
        return [query.api, query.method] as const;
    }
  }, [query]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>
          {useMemo(() => {
            switch (query.type) {
              case "constant":
                return "Constant";
              case "storage":
                return "Storage";
              case "api":
                return "Runtime API";
            }
          }, [query.type])}
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
        <FormLabel>
          Result
          <Code className={css({ display: "block", padding: "0.5rem" })}>
            {stringifyCodec(result)}
          </Code>
        </FormLabel>
      </Card.Body>
    </Card.Root>
  );
}
