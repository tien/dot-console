import { useLookup } from "../hooks/lookup";
import type {
  Pallet,
  Storage,
  StorageEntriesQuery,
  StorageQuery,
} from "../types";
import { PalletSelect } from "./pallet-select";
import { CodecParam, INCOMPLETE, INVALID, ParamInput, VOID } from "./param";
import { Button, Code, FormLabel, Select, Text } from "./ui";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { ReactNode, useMemo, useState } from "react";
import { css } from "styled-system/css";

type StorageFormProps = {
  pallet: Pallet;
  palletSelect: ReactNode;
  onAddQuery: (query: StorageQuery | StorageEntriesQuery) => void;
};

export function StorageForm(
  props: Omit<StorageFormProps, "pallet" | "palletSelect">,
) {
  return (
    <PalletSelect
      filter={(pallet) =>
        pallet.storage !== undefined && pallet.storage.items.length > 0
      }
    >
      {({ pallet, palletSelect }) => (
        <StorageSelect
          key={pallet.index}
          pallet={pallet}
          palletSelect={palletSelect}
          {...props}
        />
      )}
    </PalletSelect>
  );
}

function StorageSelect({ pallet, palletSelect, onAddQuery }: StorageFormProps) {
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
        "docs   docs"
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
        <>
          <Code
            className={css({
              gridArea: "docs",
              display: "block",
              whiteSpace: "pre-wrap",
              padding: "1rem",
            })}
          >
            {storage.docs.join("\n")}
          </Code>
          <StorageKey
            pallet={pallet}
            storage={storage}
            onAddQuery={onAddQuery}
          />
        </>
      )}
    </div>
  );
}

type StorageKeyProps = {
  pallet: Pallet;
  storage: Storage;
  onAddQuery: (query: StorageQuery | StorageEntriesQuery) => void;
};

function StorageKey(props: StorageKeyProps) {
  return (
    <_StorageKey key={props.pallet.index + props.storage.name} {...props} />
  );
}

function _StorageKey({ pallet, storage, onAddQuery }: StorageKeyProps) {
  const lookup = useLookup();

  const keyLookup =
    storage.type.tag === "plain" ? undefined : lookup(storage.type.value.key);

  const [key, setKey] = useState<ParamInput<unknown>>(INCOMPLETE);

  const maxKeyLength = useMemo(() => {
    switch (keyLookup?.type) {
      case undefined:
        return undefined;
      case "tuple":
        return keyLookup.value.every(
          (value) => value.type === "primitive" && value.value === "u8",
        )
          ? 1
          : keyLookup.value.length;
      case "array":
        return keyLookup.value.type === "primitive" &&
          keyLookup.value.value === "u8"
          ? 1
          : keyLookup.len;
      default:
        return 1;
    }
  }, [keyLookup]);

  const [keyLength, setKeyLength] = useState(maxKeyLength ?? 0);

  const derivedKey = useMemo(() => {
    if (keyLookup === undefined) {
      return [];
    }

    if (key === VOID) {
      return [];
    }

    if (Array.isArray(key)) {
      return key;
    }

    return [key];
  }, [key, keyLookup]);

  const lengthLimitedKey = derivedKey.slice(0, keyLength);

  const isEntriesQuery = lengthLimitedKey.length < derivedKey.length;

  const lengthLimitedKeyLookup = useMemo(() => {
    switch (keyLookup?.type) {
      case "tuple":
        return { ...keyLookup, value: keyLookup.value.slice(0, keyLength) };
      case "array":
        return { ...keyLookup, len: keyLength };
      default:
        return keyLookup;
    }
  }, [keyLength, keyLookup]);

  return (
    <>
      {lengthLimitedKeyLookup && (
        <section
          className={css({
            gridArea: "key",
            "&:has(> div:empty)": {
              display: "none",
            },
          })}
        >
          <div>
            <FormLabel>Storage key</FormLabel>
            {maxKeyLength !== undefined && (
              <Text as="div" size="sm">
                {isEntriesQuery ? "All entries" : "One entry"} matching{" "}
                <select
                  value={keyLength}
                  onChange={(event) =>
                    setKeyLength(parseInt(event.target.value))
                  }
                >
                  {Array.from({ length: maxKeyLength + 1 }).map((_, index) => (
                    <option key={index} value={index}>
                      {index === maxKeyLength ? "all" : index}
                    </option>
                  ))}
                </select>{" "}
                key argument
                {keyLength > 1 || keyLength === maxKeyLength ? "s" : ""}
              </Text>
            )}
          </div>
          {keyLength > 0 && (
            <div className={css({ display: "contents" })}>
              <div
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                })}
              >
                <CodecParam
                  variable={lengthLimitedKeyLookup}
                  onChangeValue={setKey}
                />
              </div>
            </div>
          )}
        </section>
      )}
      <Button
        disabled={
          keyLookup !== undefined && (key === INVALID || key === INCOMPLETE)
        }
        onClick={() =>
          onAddQuery({
            id: globalThis.crypto.randomUUID(),
            type: isEntriesQuery ? "storage-entries" : "storage",
            pallet: pallet.name,
            storage: storage.name,
            key: lengthLimitedKey,
          })
        }
        className={css({ gridArea: "submit" })}
      >
        Query
      </Button>
    </>
  );
}
