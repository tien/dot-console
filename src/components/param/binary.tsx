import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { FileUpload } from "../ui/file-upload";
import { IconButton } from "../ui/icon-button";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  INCOMPLETE,
  INVALID,
  type ParamInput,
  type ParamProps,
} from "./common";
import { Binary } from "@polkadot-api/substrate-bindings";
import type { BytesArrayShape } from "@polkadot-api/view-builder";
import Delete from "@w3f/polkadot-icons/solid/DeleteCancel";
import type { HexString } from "polkadot-api";
import { useEffect, useMemo, useState } from "react";
import { css } from "styled-system/css";
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
      <Field.Input asChild>
        <Textarea
          placeholder="Binary (string or hex)"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </Field.Input>
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
  const [file, setFile] = useState<ParamInput<File>>(INCOMPLETE);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer>();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (typeof file === "symbol") {
      return;
    }

    setIsPending(true);
    file
      .arrayBuffer()
      .then(setArrayBuffer)
      .finally(() => setIsPending(false));
  }, [file]);

  const [validBinary, binary] = useMemo(() => {
    if (arrayBuffer === undefined) {
      return [INCOMPLETE, undefined] as const;
    }

    return validateBinary(
      Binary.fromBytes(new Uint8Array(arrayBuffer)),
      bytesArray,
    );
  }, [arrayBuffer, bytesArray]);

  useEffect(
    () => {
      onChangeValue(validBinary);
    },
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arrayBuffer],
  );

  return (
    <Field.Root
      required={bytesArray !== undefined && bytesArray.len > 0}
      invalid={validBinary === INVALID}
    >
      <Field.Input asChild>
        <FileUpload.Root
          disabled={isPending}
          onFileAccept={(event) => {
            const file = event.files.at(0);

            if (file !== undefined) {
              setFile(file);
            }
          }}
        >
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
        </FileUpload.Root>
      </Field.Input>
      <Field.ErrorText>
        Field requires exactly ${bytesArray?.len} bytes, uploaded file is $
        {binary?.asBytes().length} bytes instead
      </Field.ErrorText>
    </Field.Root>
  );
}

function validateBinary(binary: Binary, bytesArray?: BytesArrayShape) {
  if (bytesArray === undefined) {
    return [binary, binary] as const;
  }

  const bytes = binary.asBytes();

  if (bytes.length !== bytesArray.len) {
    return [bytes.length === 0 ? INCOMPLETE : INVALID, binary] as const;
  }

  return [binary, binary] as const;
}
