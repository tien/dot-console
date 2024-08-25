import { AccountSelect } from "../../components/account-select";
import { PalletSelect } from "../../components/pallet-select";
import { CodecParam, INCOMPLETE, INVALID } from "../../components/param";
import { Code } from "../../components/ui";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import type { Pallet } from "../../types";
import type { Shape } from "@polkadot-api/view-builder";
import { idle, pending } from "@reactive-dot/core";
import { SignerProvider, useMutation, useSigner } from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import SignATransactionIcon from "@w3f/polkadot-icons/solid/SignATransaction";
import { Binary } from "polkadot-api";
import { useEffect, useMemo, useState } from "react";
import { css } from "styled-system/css";
import { useDynamicBuilder } from "~/hooks/metadata-builder";
import { useViewBuilder } from "~/hooks/view-builder";

export const Route = createFileRoute("/_layout/extrinsics")({
  component: ExtrinsicPage,
});

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
          <SignerProvider signer={account?.polkadotSigner}>
            <PalletSelect filter={(pallet) => pallet.calls !== undefined}>
              {({ pallet, palletSelect }) => (
                <>
                  {palletSelect}
                  <CallSelect key={pallet.index} pallet={pallet} />
                </>
              )}
            </PalletSelect>
          </SignerProvider>
        </div>
      )}
    </AccountSelect>
  );
}

type CallSelectProps = {
  pallet: Pallet;
};

function CallSelect({ pallet }: CallSelectProps) {
  if (pallet.calls === undefined) {
    throw new Error("Pallet doesn't have any calls");
  }

  const viewBuilder = useViewBuilder();
  const callsEntry = viewBuilder.buildDefinition(pallet.calls);

  if (callsEntry.shape.codec !== "Enum") {
    throw new Error("Invalid calls type", { cause: callsEntry.shape.codec });
  }

  const calls = Object.entries(callsEntry.shape.shape).map(([name, param]) => ({
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

type CallParamProps = {
  pallet: Pallet;
  call: string;
  param: Shape;
};

function CallParam({ pallet, call, param }: CallParamProps) {
  const [args, setArgs] = useState<unknown>(INCOMPLETE);

  const signer = useSigner();

  const [extrinsicState, submit] = useMutation((tx) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tx as any)[pallet.name]![call]!(args),
  );

  const ispending = useMemo(() => {
    switch (extrinsicState) {
      case pending:
        return true;
      case idle:
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

  const dynamicBuilder = useDynamicBuilder();
  const viewBuilder = useViewBuilder();

  const callData = useMemo(() => {
    if (args === INCOMPLETE || args === INVALID) {
      return undefined;
    }

    try {
      const callMetadata = dynamicBuilder.buildCall(pallet.name, call);

      return Binary.fromBytes(
        mergeUint8(
          new Uint8Array(callMetadata.location),
          callMetadata.codec.enc(args),
        ),
      );
    } catch {
      return undefined;
    }
  }, [args, call, dynamicBuilder, pallet.name]);

  useEffect(() => {
    if (callData !== undefined) {
      console.log(viewBuilder.callDecoder(callData.asBytes()));
    }
  }, [callData, viewBuilder]);

  return (
    <div className={css({ gridArea: "param-and-submit" })}>
      <CodecParam shape={param} onChangeValue={setArgs} />
      <hr className={css({ margin: "2rem 0 1rem 0" })} />
      <div
        className={css({
          display: "flex",
          justifyContent: "end",
          marginTop: "1rem",
        })}
      >
        <Button
          loading={ispending}
          disabled={
            signer === undefined || args === INCOMPLETE || args === INVALID
          }
          onClick={() => submit()}
        >
          Sign and submit
          <SignATransactionIcon fill="currentcolor" />
        </Button>
      </div>
      {callData !== undefined && (
        <article>
          <header>Encoded call data</header>
          <Code>{callData.asHex()}</Code>
        </article>
      )}
    </div>
  );
}

function mergeUint8(...inputs: Array<Uint8Array>): Uint8Array {
  const totalLen = inputs.reduce((acc, a) => acc + a.byteLength, 0);
  const result = new Uint8Array(totalLen);

  for (let idx = 0, at = 0; idx < inputs.length; idx++) {
    const current = inputs[idx];
    result.set(current!, at);
    at += current!.byteLength;
  }

  return result;
}
