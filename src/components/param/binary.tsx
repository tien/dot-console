import { Button, FileUpload, IconButton, Input, Switch } from "../ui";
import { INCOMPLETE, ParamInput, ParamProps } from "./common";
import { Binary } from "@polkadot-api/substrate-bindings";
import Delete from "@w3f/polkadot-icons/solid/DeleteCancel";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";

export type BinaryParamProps = ParamProps<Binary>;

export function BinaryParam({ onChangeValue }: BinaryParamProps) {
  const [useFileUpload, setUseFileUpload] = useState(false);

  return (
    // TODO: some weird bug where inner input will trigger switch, need to inverse order for some reason
    <section
      className={css({
        display: "flex",
        flexDirection: "column-reverse",
        gap: "0.5rem",
      })}
    >
      {useFileUpload ? (
        <FileUploadBinaryParam onChangeValue={onChangeValue} />
      ) : (
        <TextBinaryParam onChangeValue={onChangeValue} />
      )}
      <Switch
        checked={useFileUpload}
        onCheckedChange={(event) => setUseFileUpload(event.checked)}
      >
        File upload
      </Switch>
    </section>
  );
}

function TextBinaryParam({ onChangeValue }: BinaryParamProps) {
  const [value, setValue] = useState("");

  useEffect(
    () => {
      if (value.match(/^0x[0-9a-f]+$/i)) {
        onChangeValue(Binary.fromHex(value));
      } else {
        onChangeValue(Binary.fromText(value));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );

  return (
    <Input
      placeholder="Binary (string or hex)"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

function FileUploadBinaryParam({ onChangeValue }: BinaryParamProps) {
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

  useEffect(
    () => {
      if (arrayBuffer !== undefined) {
        onChangeValue(Binary.fromBytes(new Uint8Array(arrayBuffer)));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arrayBuffer],
  );

  return (
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
  );
}
