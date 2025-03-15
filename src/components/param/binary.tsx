import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { FileUpload } from "../ui/file-upload";
import { IconButton } from "../ui/icon-button";
import { Switch } from "../ui/switch";
import {
  INCOMPLETE,
  INVALID,
  type ParamInput,
  type ParamProps,
} from "./common";
import { useFileUpload } from "@ark-ui/react";
import { Binary } from "@polkadot-api/substrate-bindings";
import type { BytesArrayShape } from "@polkadot-api/view-builder";
import Delete from "@w3f/polkadot-icons/solid/DeleteCancel";
import type { HexString } from "polkadot-api";
import { useEffect, useMemo, useState, useTransition } from "react";
import { css } from "styled-system/css";
import { toaster } from "~/toaster";
import { bytesToString } from "~/utils";

export type BinaryParamProps = ParamProps<Binary> & {
  bytesArray?: BytesArrayShape;
  defaultValue?: { value: HexString } | undefined;
};

export function BinaryParam(props: BinaryParamProps) {
  const [useFileUpload, setUseFileUpload] = useState(false);

  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      })}
    >
      <Switch
        checked={useFileUpload}
        onCheckedChange={(event) => setUseFileUpload(event.checked)}
      >
        File upload
      </Switch>
      {useFileUpload ? (
        <FileUploadBinaryParam {...props} />
      ) : (
        <TextBinaryParam {...props} />
      )}
    </section>
  );
}

function TextBinaryParam({
  bytesArray,
  onChangeValue,
  defaultValue,
}: BinaryParamProps) {
  const [value, setValue] = useState(() =>
    defaultValue !== undefined
      ? bytesToString(Binary.fromHex(defaultValue.value))
      : "",
  );

  const [validBinary, binary] = useMemo(
    () =>
      validateBinary(
        value.match(/^0x[0-9a-f]+$/i)
          ? Binary.fromHex(value)
          : Binary.fromText(value),
        bytesArray,
      ),
    [bytesArray, value],
  );

  useEffect(
    () => {
      onChangeValue(validBinary);
    },
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validBinary],
  );

  return (
    <Field.Root
      required={bytesArray !== undefined && bytesArray.len > 0}
      invalid={validBinary === INVALID}
    >
      <Field.Textarea
        placeholder="Binary (string or hex)"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Field.ErrorText>
        Field requires {bytesArray?.len} bytes, got {binary.asBytes().length}{" "}
        instead
      </Field.ErrorText>
    </Field.Root>
  );
}

function FileUploadBinaryParam({
  bytesArray,
  onChangeValue,
}: BinaryParamProps) {
  const [binary, setBinary] = useState<ParamInput<Binary>>(INCOMPLETE);
  const [isPending, startTransition] = useTransition();

  const fileUpload = useFileUpload({
    disabled: isPending,
    required: bytesArray !== undefined && bytesArray.len > 0,
    invalid: binary === INVALID,
    maxFiles: 1,
    maxFileSize: bytesArray?.len,
    onFileReject: async ({ files }) => {
      const file = files.at(0)!.file;
      const binary = new Uint8Array(await file.arrayBuffer());

      toaster.error({
        title: "Invalid file",
        description: `Field requires exactly ${bytesArray?.len} bytes, uploaded file is ${binary.length} bytes instead`,
      });
    },
    onFileAccept: ({ files }) => {
      const file = files.at(0);

      if (file === undefined) {
        return setBinary(INCOMPLETE);
      }

      startTransition(async () => {
        const [validBinary] = validateBinary(
          Binary.fromBytes(new Uint8Array(await file.arrayBuffer())),
          bytesArray,
        );

        setBinary(validBinary);
      });
    },
  });

  useEffect(
    () => {
      onChangeValue(binary);
    },
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [binary],
  );

  return (
    <FileUpload.RootProvider value={fileUpload}>
      <FileUpload.Dropzone>
        <FileUpload.Label>Drop your files here</FileUpload.Label>
        <FileUpload.Trigger asChild>
          <Button size="sm">Open Dialog</Button>
        </FileUpload.Trigger>
      </FileUpload.Dropzone>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file, id) => (
              <FileUpload.Item key={id} file={file}>
                <FileUpload.ItemPreview type="image/*">
                  <FileUpload.ItemPreviewImage />
                </FileUpload.ItemPreview>
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <FileUpload.ItemDeleteTrigger asChild>
                  <IconButton variant="link" size="sm">
                    <Delete fill="currentcolor" />
                  </IconButton>
                </FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.RootProvider>
  );
}

function validateBinary(
  binary: Binary,
  bytesArray: BytesArrayShape | undefined,
) {
  if (bytesArray === undefined) {
    return [binary, binary] as const;
  }

  const bytes = binary.asBytes();

  if (bytes.length !== bytesArray.len) {
    return [bytes.length === 0 ? INCOMPLETE : INVALID, binary] as const;
  }

  return [binary, binary] as const;
}
