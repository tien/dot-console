import {
  CodecParam,
  INCOMPLETE,
  INVALID,
  ParamInput,
  VOID,
} from "../components/param";
import { Button, FormLabel, Select } from "../components/ui";
import { useLookup } from "../hooks/lookup";
import { Pallet, Storage } from "../types";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";

type StorageKeyProps = {
  storage: Storage;
  onChangeKey: (key: unknown) => void;
};

function StorageKey({ storage, onChangeKey }: StorageKeyProps) {
  const lookup = useLookup();

  const key =
    storage.type.tag === "plain" ? undefined : lookup(storage.type.value.key);

  useEffect(() => {
    if (key === undefined) {
      onChangeKey(VOID);
    }
  }, [key, onChangeKey]);

  if (key === undefined) {
    return null;
  }

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      })}
    >
      <CodecParam variable={key} onChangeValue={onChangeKey} />
    </div>
  );
}

type StorageQuery = {
  pallet: string;
  storage: string;
  key: unknown;
};

type StorageItemProps = {
  pallet: Pallet;
  onAddQuery: (query: StorageQuery) => void;
};

function _StorageItem({ pallet, onAddQuery }: StorageItemProps) {
  const [key, setKey] = useState<ParamInput<unknown>>(INCOMPLETE);

  const storageItems = pallet.storage!.items;

  const [storageName, setStorageName] = useState(storageItems.at(0)!.name);

  const storage = storageItems.find((storage) => storage.name === storageName);

  return (
    <>
      <Select.Root
        items={pallet.storage!.items}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToString={(storage: Storage) => storage.name}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToValue={(storage: Storage) => storage.name}
        value={[storageName]}
        onValueChange={(event) => {
          const storage = event.items.at(0) as Storage;

          setStorageName(storage.name);
        }}
        className={css({ gridArea: "storage" })}
      >
        <Select.Label>Storage</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a storage" />
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content
            className={css({ maxHeight: "75dvh", overflow: "auto" })}
          >
            {pallet
              .storage!.items.toSorted((a, b) => a.name.localeCompare(b.name))
              .map((storage) => (
                <Select.Item key={storage.name} item={storage}>
                  <Select.ItemText>{storage.name}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      {storage && (
        <FormLabel
          className={css({
            gridArea: "key",
            "&:has(> div:empty)": {
              display: "none",
            },
          })}
        >
          Storage key
          <div className={css({ display: "contents" })}>
            <StorageKey storage={storage} onChangeKey={setKey} />
          </div>
        </FormLabel>
      )}
      <Button
        disabled={key === INVALID || key === INCOMPLETE}
        onClick={() =>
          onAddQuery({
            pallet: pallet.name,
            storage: storageName,
            key,
          })
        }
        className={css({ gridArea: "submit" })}
      >
        Query
      </Button>
    </>
  );
}

export function StorageItem(props: StorageItemProps) {
  return <_StorageItem key={props.pallet.index} {...props} />;
}
