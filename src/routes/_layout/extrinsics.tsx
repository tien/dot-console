import { AccountSelect } from "../../components/account-select";
import { PalletSelect } from "../../components/pallet-select";
import { CodecParam, INCOMPLETE, INVALID } from "../../components/param";
import { useDynamicBuilder } from "../../hooks/metadata-builder";
import { useViewBuilder } from "../../hooks/view-builder";
import type { Pallet } from "../../types";
import { mergeUint8 } from "../../utils";
import { toaster } from "../__root";
import type { Decoded, Shape } from "@polkadot-api/view-builder";
import { idle, pending } from "@reactive-dot/core";
import { SignerProvider, useMutation, useSigner } from "@reactive-dot/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import SignATransactionIcon from "@w3f/polkadot-icons/solid/SignATransaction";
import { Binary } from "polkadot-api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { css } from "styled-system/css";
import { z } from "zod";
import { Select } from "~/components/select";
import { Button } from "~/components/ui/button";
import { Editable } from "~/components/ui/editable";

const searchSchema = z.object({
  callData: z.string().optional(),
});

export const Route = createFileRoute("/_layout/extrinsics")({
  component: ExtrinsicPage,
  validateSearch: zodValidator(searchSchema),
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
              {({
                pallet,
                unstable_changePallet: changePallet,
                palletSelect,
              }) => (
                <>
                  {palletSelect}
                  <CallSelect pallet={pallet} onChangePallet={changePallet} />
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
  onChangePallet: (palletIndex: number) => void;
};

function CallSelect({ pallet, onChangePallet }: CallSelectProps) {
  if (pallet.calls === undefined) {
    throw new Error("Pallet doesn't have any calls");
  }

  const viewBuilder = useViewBuilder();
  const callsEntry = useMemo(
    () => viewBuilder.buildDefinition(pallet.calls!),
    [pallet.calls, viewBuilder],
  );

  if (callsEntry.shape.codec !== "Enum") {
    throw new Error("Invalid calls type", { cause: callsEntry.shape.codec });
  }

  const calls = Object.entries(callsEntry.shape.shape).map(([name, param]) => ({
    name,
    param,
  }));

  const defaultCallName = calls.at(0)!.name;

  const [_selectedCallName, setSelectedCallName] = useState(defaultCallName);

  const selectedCall =
    calls.find((call) => call.name === _selectedCallName) ?? calls.at(0)!;

  const callItems = calls
    .map((call) => ({
      label: call.name,
      value: call.name,
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <Select
        label="Call"
        options={callItems}
        value={selectedCall.name}
        onChangeValue={setSelectedCallName}
      />
      <CallParam
        pallet={pallet}
        call={selectedCall.name}
        param={selectedCall.param}
        onChangePallet={onChangePallet}
        onChangeCall={setSelectedCallName}
      />
    </>
  );
}

type CallParamProps = {
  pallet: Pallet;
  call: string;
  param: Shape;
  onChangePallet: (palletIndex: number) => void;
  onChangeCall: (callName: string) => void;
};

function CallParam({
  pallet,
  call,
  param,
  onChangePallet,
  onChangeCall,
}: CallParamProps) {
  const [args, setArgs] = useState<unknown>(INCOMPLETE);

  const signer = useSigner();

  const [extrinsicState, submit] = useMutation((tx) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tx as any)[pallet.name]![call]!(args),
  );

  const isPending = useMemo(() => {
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

  const navigate = useNavigate({ from: Route.fullPath });

  const setCallDataInput = useCallback(
    (callDataInput: string, forceRerender?: boolean) => {
      if (callDataInput.trim() === "") {
        return;
      }

      try {
        const decodedCall = viewBuilder.callDecoder(callDataInput);

        _setCallDataInput(callDataInput);
        setDraftCallDataInput(callDataInput);
        onChangePallet(decodedCall.pallet.value.idx);
        onChangeCall(decodedCall.call.value.name);
        setDefaultArgs(decodedCall.args.value);
        navigate({ search: { callData: callDataInput } });

        if (forceRerender) {
          setArgsRenderCount((count) => count + 1);
        }
      } catch {
        setDraftCallDataInput(callDataInput);
        toaster.error({ id: callDataInput, title: "Invalid call data" });
      }
    },
    [navigate, onChangeCall, onChangePallet, viewBuilder],
  );

  const clearCallDataInput = useCallback(() => {
    _setCallDataInput("");
    setDraftCallDataInput("");
    navigate({ search: { callData: undefined } });
  }, [navigate]);

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

  const { callData: searchCallData } = Route.useSearch();

  const callDataHex = callData?.asHex();

  const [defaultArgs, setDefaultArgs] = useState<Decoded>();
  const [argsRenderCount, setArgsRenderCount] = useState(0);

  const [draftCallDataInput, setDraftCallDataInput] = useState(
    callDataHex ?? "",
  );

  const [callDataInput, _setCallDataInput] = useState(draftCallDataInput);

  useEffect(
    () => {
      if (searchCallData) {
        setCallDataInput(searchCallData, true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(
    () => {
      if (callDataHex === undefined) {
        clearCallDataInput();
      } else {
        setCallDataInput(callDataHex);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callDataHex],
  );

  return (
    <div className={css({ gridArea: "param-and-submit" })}>
      <CodecParam
        key={argsRenderCount}
        shape={param}
        defaultValue={defaultArgs}
        onChangeValue={setArgs}
      />
      <div
        className={css({
          position: "sticky",
          bottom: 0,
          paddingBottom: "1rem",
          backgroundColor: "bg.canvas",
        })}
      >
        <hr className={css({ margin: "2rem 0 1rem 0" })} />
        <Editable.Root
          placeholder="0x0"
          autoResize
          value={draftCallDataInput}
          onValueChange={(event) => setDraftCallDataInput(event.value)}
          onValueRevert={() => setDraftCallDataInput(callDataInput)}
          onValueCommit={(event) => setCallDataInput(event.value, true)}
        >
          <Editable.Label>Encoded call data</Editable.Label>
          <Editable.Area>
            <Editable.Input />
            <Editable.Preview />
          </Editable.Area>
          <Editable.Context>
            {(editable) => (
              <Editable.Control>
                {editable.editing ? (
                  <>
                    <Editable.SubmitTrigger asChild>
                      <Button variant="link">Save</Button>
                    </Editable.SubmitTrigger>
                    <Editable.CancelTrigger asChild>
                      <Button variant="link">Cancel</Button>
                    </Editable.CancelTrigger>
                  </>
                ) : (
                  <Editable.EditTrigger asChild>
                    <Button variant="link">Edit</Button>
                  </Editable.EditTrigger>
                )}
              </Editable.Control>
            )}
          </Editable.Context>
        </Editable.Root>
        <div
          className={css({
            display: "flex",
            justifyContent: "end",
            marginTop: "0.5rem",
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
    </div>
  );
}
