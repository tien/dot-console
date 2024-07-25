import { useLookup } from "../hooks/lookup";
import { useMetadata } from "../hooks/metadata";
import { RuntimeApi, RuntimeApiMethod, RuntimeApiQuery } from "../types";
import { CodecParam, INCOMPLETE, INVALID } from "./param";
import { Button, Code, Select } from "./ui";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { useState } from "react";
import { css } from "styled-system/css";

export type RuntimeApiFormProps = {
  onAddQuery: (query: RuntimeApiQuery) => void;
};

export function RuntimeApiForm(props: RuntimeApiFormProps) {
  const metadata = useMetadata();
  const apis = metadata.value.apis;

  const [selectedApiName, setSelectedApiName] = useState(apis.at(0)!.name);
  const selectedApi = apis.find((api) => api.name === selectedApiName);

  const apiItems = apis
    .map((api) => ({ label: api.name, value: api.name }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  return (
    <div
      className={css({
        display: "grid",
        gridTemplateAreas: `
          "api    method"
          "docs   docs"
          "args   args"
          "submit submit"
        `,
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: "1rem",
      })}
    >
      <Select.Root
        items={apiItems}
        value={[selectedApiName]}
        onValueChange={(event) => setSelectedApiName(event.value.at(0)!)}
        positioning={{ fitViewport: true, sameWidth: true }}
        className={css({ gridArea: "api" })}
      >
        <Select.Label>Apis</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select an API" />
            <Select.Indicator>
              <ChevronDown fill="currentcolor" />
            </Select.Indicator>
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content
            className={css({
              maxHeight: "max(50dvh, 8rem)",
              overflow: "auto",
            })}
          >
            {apiItems.map((api) => (
              <Select.Item key={api.value} item={api}>
                <Select.ItemText>{api.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check fill="currentcolor" />
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

  const methodItems = methods
    .map((method) => ({ label: method.name, value: method.name }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <Select.Root
        items={methodItems}
        value={[selectedMethodName]}
        onValueChange={(event) => setSelectedMethodName(event.value.at(0)!)}
        positioning={{ fitViewport: true, sameWidth: true }}
        className={css({ gridArea: "method" })}
      >
        <Select.Label>Methods</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a method" />
            <Select.Indicator>
              <ChevronDown fill="currentcolor" />
            </Select.Indicator>
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content
            className={css({
              maxHeight: "max(50dvh, 8rem)",
              overflow: "auto",
            })}
          >
            {methodItems.map((method) => (
              <Select.Item key={method.value} item={method}>
                <Select.ItemText>{method.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check fill="currentcolor" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      {selectedMethod !== undefined && (
        <Code
          className={css({
            gridArea: "docs",
            display: "block",
            whiteSpace: "wrap",
            padding: "1rem",
          })}
        >
          {selectedMethod.docs.join("\n")}
        </Code>
      )}
      {selectedMethod && (
        <ApiMethodArguments {...props} api={api} method={selectedMethod} />
      )}
    </>
  );
}

function ApiMethodSelect(props: ApiMethodSelectProps) {
  return <_ApiMethodSelect key={props.api.name} {...props} />;
}

type ApiMethodArgumentsProps = {
  api: RuntimeApi;
  method: RuntimeApiMethod;
  onAddQuery: (query: RuntimeApiQuery) => void;
};

function ApiMethodArguments(props: ApiMethodArgumentsProps) {
  return <_ApiMethodArguments key={props.method.name} {...props} />;
}

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
