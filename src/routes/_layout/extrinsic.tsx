import { AccountSelect } from "../../components/account-select";
import { PalletSelect } from "../../components/pallet-select";
import { CodecParam, INCOMPLETE, INVALID } from "../../components/param";
import { Button, Select } from "../../components/ui";
import { useLookup } from "../../hooks/lookup";
import { Pallet } from "../../types";
import type { LookupEntry, Var } from "@polkadot-api/metadata-builders";
import { IDLE, PENDING } from "@reactive-dot/core";
import { ReDotSignerProvider, useMutation } from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { useMemo, useState } from "react";
import { css } from "styled-system/css";

export const Route = createFileRoute("/_layout/extrinsic")({
  component: ExtrinsicPage,
});

type CallParamProps = {
  pallet: Pallet;
  call: string;
  param:
    | Var
    | {
        type: "lookupEntry";
        value: LookupEntry;
      };
};

function CallParam({ pallet, call, param }: CallParamProps) {
  const lookup = useLookup();
  const variable =
    param.type === "lookupEntry" ? lookup(param.value.id) : param;

  const [args, setArgs] = useState<unknown>(INCOMPLETE);

  const [extrinsicState, submit] = useMutation((tx) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tx as any)[pallet.name]![call]!(args),
  );

  const isPending = useMemo(() => {
    switch (extrinsicState) {
      case PENDING:
        return true;
      case IDLE:
        return false;
      default:
        if (extrinsicState instanceof Error) {
          return false;
        }

        switch (extrinsicState.type) {
          case "finalized":
            return false;
          default:
            return true;
        }
    }
  }, [extrinsicState]);

  return (
    <>
      <CodecParam variable={variable} onChangeValue={setArgs} />
      <div
        className={css({
          display: "flex",
          justifyContent: "end",
          marginTop: "1rem",
        })}
      >
        <Button
          disabled={args === INCOMPLETE || args === INVALID}
          onClick={() => submit()}
        >
          {isPending ? "Submitting transaction" : "Submit transaction"}
        </Button>
      </div>
    </>
  );
}

type CallSelectProps = {
  pallet: Pallet;
};

function CallSelect({ pallet }: CallSelectProps) {
  if (pallet.calls === undefined) {
    throw new Error("Pallet doesn't have any calls");
  }

  const lookup = useLookup();
  const callsEntry = lookup(pallet.calls);

  if (callsEntry.type !== "enum") {
    throw new Error("Invalid calls type", { cause: callsEntry.type });
  }

  const calls = Object.entries(callsEntry.value).map(([name, param]) => ({
    name,
    param,
  }));

  const [selectedCallName, setSelectedCallName] = useState(calls.at(0)!.name);
  const selectedCall = calls.find((call) => call.name === selectedCallName);

  type Call = (typeof calls)[number];

  return (
    <>
      <Select.Root
        items={calls}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToString={(call: Call) => call.name}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToValue={(call: Call) => call.name}
        value={[selectedCallName]}
        onValueChange={(event) => {
          const call = event.items.at(0) as Call;

          setSelectedCallName(call.name);
        }}
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
            className={css({ maxHeight: "75dvh", overflow: "auto" })}
          >
            {calls
              .toSorted((a, b) => a.name.localeCompare(b.name))
              .map((call) => (
                <Select.Item key={call.name} item={call}>
                  <Select.ItemText>{call.name}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check fill="currentcolor" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      {selectedCall && (
        <CallParam
          pallet={pallet}
          call={selectedCall.name}
          param={selectedCall.param}
        />
      )}
    </>
  );
}

function ExtrinsicPage() {
  return (
    <AccountSelect>
      {({ account, accountSelect }) => (
        <div className={css({ padding: "2rem 4rem" })}>
          {accountSelect}
          {account && (
            <ReDotSignerProvider signer={account.polkadotSigner}>
              <PalletSelect filter={(pallet) => pallet.calls !== undefined}>
                {({ pallet, palletSelect }) => (
                  <>
                    {palletSelect}
                    <CallSelect key={pallet.index} pallet={pallet} />
                  </>
                )}
              </PalletSelect>
            </ReDotSignerProvider>
          )}
        </div>
      )}
    </AccountSelect>
  );
}
