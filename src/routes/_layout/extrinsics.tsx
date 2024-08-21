import { AccountSelect } from "../../components/account-select";
import { PalletSelect } from "../../components/pallet-select";
import { CodecParam, INCOMPLETE, INVALID } from "../../components/param";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { useLookup } from "../../hooks/lookup";
import type { Pallet } from "../../types";
import type { LookupEntry, Var } from "@polkadot-api/metadata-builders";
import { IDLE, PENDING } from "@reactive-dot/core";
import {
  ReDotSignerProvider,
  useMutation,
  useSigner,
} from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import SignATransactionIcon from "@w3f/polkadot-icons/solid/SignATransaction";
import { useMemo, useState } from "react";
import { css } from "styled-system/css";

export const Route = createFileRoute("/_layout/extrinsics")({
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

  const signer = useSigner();

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
    <div className={css({ gridArea: "param-and-submit" })}>
      <CodecParam variable={variable} onChangeValue={setArgs} />
      <hr className={css({ margin: "2rem 0 1rem 0" })} />
      <div
        className={css({
          display: "flex",
          justifyContent: "end",
          marginTop: "1rem",
        })}
      >
        <Button
          loading={isPending}
          disabled={
            signer === undefined || args === INCOMPLETE || args === INVALID
          }
          onClick={() => submit()}
        >
          Sign and submit
          <SignATransactionIcon fill="currentcolor" />
        </Button>
      </div>
    </div>
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

  const callItems = calls.map((call) => ({
    label: call.name,
    value: call.name,
  }));

  return (
    <>
      <Select.Root
        items={callItems}
        value={[selectedCallName]}
        onValueChange={(event) => setSelectedCallName(event.value.at(0)!)}
        positioning={{ fitViewport: true, sameWidth: true }}
        className={css({ gridArea: "call" })}
      >
        <Select.Label>Calls</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a call" />
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
            {callItems
              .toSorted((a, b) => a.label.localeCompare(b.label))
              .map((call) => (
                <Select.Item key={call.label} item={call}>
                  <Select.ItemText>{call.label}</Select.ItemText>
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
        <div
          className={css({
            display: "grid",
            gridTemplateAreas: `
              "account            account"
              "pallet             call"
              "param-and-submit   param-and-submit"
            `,
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "0.5rem",
            padding: "2rem 4rem",
          })}
        >
          <div className={css({ gridArea: "account" })}>{accountSelect}</div>
          <ReDotSignerProvider signer={account?.polkadotSigner}>
            <PalletSelect filter={(pallet) => pallet.calls !== undefined}>
              {({ pallet, palletSelect }) => (
                <>
                  {palletSelect}
                  <CallSelect key={pallet.index} pallet={pallet} />
                </>
              )}
            </PalletSelect>
          </ReDotSignerProvider>
        </div>
      )}
    </AccountSelect>
  );
}
