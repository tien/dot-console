import { useMetadata } from "../hooks/metadata";
import type { Pallet } from "../types";
import { Select } from "./ui";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { ReactNode, useState } from "react";
import { css } from "styled-system/css";

export type PalletSelectProps = {
  filter: (pallet: Pallet) => boolean;
  children: (props: { pallet: Pallet; palletSelect: ReactNode }) => ReactNode;
};

export function PalletSelect({ filter, children }: PalletSelectProps) {
  const metadata = useMetadata();

  const pallets = metadata.value.pallets.filter(filter);

  const defaultPallet = pallets.at(0);

  if (defaultPallet === undefined) {
    throw new Error("Metadata doesn't contain any pallet");
  }

  const [selectedPallet, setSelectedPallet] = useState(defaultPallet.index);

  return children({
    pallet: pallets.find((pallet) => pallet.index === selectedPallet)!,
    palletSelect: (
      <Select.Root
        items={pallets}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToString={(pallet: Pallet) => pallet.name}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToValue={(pallet: Pallet) => pallet.index}
        // @ts-expect-error ark-ui type error
        value={[selectedPallet]}
        onValueChange={(event) => {
          const pallet = event.items.at(0) as Pallet;

          setSelectedPallet(pallet.index);
        }}
        className={css({ gridArea: "pallet" })}
      >
        <Select.Label>Pallet</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a pallet" />
            <ChevronDown />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content
            className={css({ maxHeight: "75dvh", overflow: "auto" })}
          >
            {pallets
              .toSorted((a, b) => a.name.localeCompare(b.name))
              .map((pallet) => (
                <Select.Item key={pallet.index} item={pallet}>
                  <Select.ItemText>{pallet.name}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    ),
  });
}
