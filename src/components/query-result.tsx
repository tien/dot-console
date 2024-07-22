import { StorageQuery } from "../types";
import { stringifyCodec } from "../utils";
import { VOID } from "./param";
import { Card, Code, FormLabel } from "./ui";
import { useLazyLoadQuery } from "@reactive-dot/react";
import { css } from "styled-system/css";

type StorageQueryResultProps = {
  query: StorageQuery;
};

export function StorageQueryResult({ query }: StorageQueryResultProps) {
  const queryArgs =
    query.key === VOID
      ? []
      : Array.isArray(query.key)
        ? query.key
        : [query.key];

  const result = useLazyLoadQuery((builder) =>
    builder.readStorage(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query.pallet as any,
      query.storage,
      queryArgs,
    ),
  );

  const unwrappedQueryArgs =
    queryArgs.length === 1 ? queryArgs.at(0) : queryArgs;

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Storage</Card.Title>
        <Card.Description>
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            })}
          >
            <FormLabel className={css({ display: "block" })}>
              Path:{" "}
              <Code>
                {query.pallet}.{query.storage}
              </Code>
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
