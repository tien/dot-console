import { useLookup } from "../hooks/lookup";
import type { Pallet, Storage, StorageQuery } from "../types";
import { PalletSelect } from "./pallet-select";
import { CodecParam, INCOMPLETE, INVALID, ParamInput, VOID } from "./param";
import { Button, FormLabel, Select } from "./ui";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { ReactNode, useEffect, useState } from "react";
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

type StorageQueryFormProps = {
  pallet: Pallet;
  palletSelect: ReactNode;
  onAddQuery: (query: StorageQuery) => void;
};

function _StorageQueryForm({
  pallet,
  palletSelect,
  onAddQuery,
}: StorageQueryFormProps) {
  const [key, setKey] = useState<ParamInput<unknown>>(INCOMPLETE);

  const storages = pallet.storage!.items;

  const [selectedStorage, setSelectedStorage] = useState(storages.at(0)!.name);

  const storage = storages.find((storage) => storage.name === selectedStorage);

  const storageItems = storages
    .map((storage) => ({
      label: storage.name,
      value: storage.name,
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  return (
    <div
      className={css({
        display: "grid",
        gridTemplateAreas: `
        "pallet storage"
        "key    key"
        "submit submit"
      `,
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: "1rem",
      })}
    >
      {palletSelect}
      <Select.Root
        items={storageItems}
        value={[selectedStorage]}
        onValueChange={(event) => setSelectedStorage(event.value.at(0)!)}
        positioning={{ fitViewport: true, sameWidth: true }}
        className={css({ gridArea: "storage" })}
      >
        <Select.Label>Storage</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a storage" />
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
            {storageItems.map((storage) => (
              <Select.Item key={storage.value} item={storage}>
                <Select.ItemText>{storage.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check fill="currentcolor" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      {storage && (
        <section
          className={css({
            gridArea: "key",
            "&:has(> div:empty)": {
              display: "none",
            },
          })}
        >
          <FormLabel>Storage key</FormLabel>
          <div className={css({ display: "contents" })}>
            <StorageKey storage={storage} onChangeKey={setKey} />
          </div>
        </section>
      )}
      <Button
        disabled={key === INVALID || key === INCOMPLETE}
        onClick={() =>
          onAddQuery({
            type: "storage",
            pallet: pallet.name,
            storage: selectedStorage,
            key,
          })
        }
        className={css({ gridArea: "submit" })}
      >
        Query
      </Button>
    </div>
  );
}

export function StorageQueryForm(
  props: Omit<StorageQueryFormProps, "pallet" | "palletSelect">,
) {
  return (
    <PalletSelect
      filter={(pallet) =>
        pallet.storage !== undefined && pallet.storage.items.length > 0
      }
    >
      {({ pallet, palletSelect }) => (
        <_StorageQueryForm
          key={pallet.index}
          pallet={pallet}
          palletSelect={palletSelect}
          {...props}
        />
      )}
    </PalletSelect>
  );
}
