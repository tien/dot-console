import { useLookup } from "../hooks/lookup";
import { useMetadata } from "../hooks/metadata";
import { RuntimeApi, RuntimeApiMethod, RuntimeApiQuery } from "../types";
import { CodecParam, INCOMPLETE, INVALID } from "./param";
import { Button, Select } from "./ui";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { useState } from "react";
import { css } from "styled-system/css";

type ApiMethodArgumentsProps = {
  api: RuntimeApi;
  method: RuntimeApiMethod;
  onAddQuery: (query: RuntimeApiQuery) => void;
};

function _ApiMethodArguments({
  api,
  method,
  onAddQuery,
}: ApiMethodArgumentsProps) {
  const lookup = useLookup();
  const [args, setArgs] = useState(
    Array.from({ length: method.inputs.length }).fill(INCOMPLETE),
  );

  const parsedArgs = args.includes(INCOMPLETE)
    ? INCOMPLETE
    : args.includes(INVALID)
      ? INVALID
      : args;

  return (
    <>
      {method.inputs.length > 0 && (
        <div
          className={css({
            gridArea: "args",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          })}
        >
          {method.inputs.map((input, index) => (
            <CodecParam
              key={input.name}
              variable={lookup(input.type)}
              onChangeValue={(value) =>
                setArgs((args) => args.with(index, value))
              }
            />
          ))}
        </div>
      )}
      <Button
        disabled={parsedArgs === INVALID || parsedArgs === INCOMPLETE}
        onClick={() =>
          onAddQuery({ type: "api", api: api.name, method: method.name, args })
        }
        className={css({ gridArea: "submit" })}
      >
        Query
      </Button>
    </>
  );
}

function ApiMethodArguments(props: ApiMethodArgumentsProps) {
  return <_ApiMethodArguments key={props.method.name} {...props} />;
}

type ApiMethodSelectProps = {
  api: RuntimeApi;
  onAddQuery: (query: RuntimeApiQuery) => void;
};

function _ApiMethodSelect({ api, ...props }: ApiMethodSelectProps) {
  const methods = api.methods;
  const [selectedMethodName, setSelectedMethodName] = useState(
    methods.at(0)!.name,
  );
  const selectedMethod = methods.find(
    (method) => method.name === selectedMethodName,
  );

  return (
    <>
      <Select.Root
        items={methods}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToString={(method: RuntimeApiMethod) => method.name}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToValue={(method: RuntimeApiMethod) => method.name}
        value={[selectedMethodName]}
        onValueChange={(event) => {
          const method = event.items.at(0) as RuntimeApiMethod;

          setSelectedMethodName(method.name);
        }}
        className={css({ gridArea: "method" })}
      >
        <Select.Label>Methods</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a method" />
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content
            className={css({ maxHeight: "75dvh", overflow: "auto" })}
          >
            {methods
              .toSorted((a, b) => a.name.localeCompare(b.name))
              .map((method) => (
                <Select.Item key={method.name} item={method}>
                  <Select.ItemText>{method.name}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      {selectedMethod && (
        <ApiMethodArguments {...props} api={api} method={selectedMethod} />
      )}
    </>
  );
}

function ApiMethodSelect(props: ApiMethodSelectProps) {
  return <_ApiMethodSelect key={props.api.name} {...props} />;
}

export type RuntimeApiFormProps = {
  onAddQuery: (query: RuntimeApiQuery) => void;
};

export function RuntimeApiForm(props: RuntimeApiFormProps) {
  const metadata = useMetadata();
  const apis = metadata.value.apis;

  const [selectedApiName, setSelectedApiName] = useState(apis.at(0)!.name);
  const selectedApi = apis.find((api) => api.name === selectedApiName);

  return (
    <div
      className={css({
        display: "grid",
        gridTemplateAreas: `
          "api    method"
          "args   args"
          "submit submit"
        `,
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: "1rem",
      })}
    >
      <Select.Root
        items={apis}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToString={(api: RuntimeApi) => api.name}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToValue={(api: RuntimeApi) => api.name}
        value={[selectedApiName]}
        onValueChange={(event) => {
          const api = event.items.at(0) as RuntimeApi;

          setSelectedApiName(api.name);
        }}
        className={css({ gridArea: "api" })}
      >
        <Select.Label>Apis</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select an API" />
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content
            className={css({ maxHeight: "75dvh", overflow: "auto" })}
          >
            {apis
              .toSorted((a, b) => a.name.localeCompare(b.name))
              .map((api) => (
                <Select.Item key={api.name} item={api}>
                  <Select.ItemText>{api.name}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      {selectedApi && <ApiMethodSelect {...props} api={selectedApi} />}
    </div>
  );
}
