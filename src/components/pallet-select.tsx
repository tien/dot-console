import { useMetadata } from "../hooks/metadata";
import type { Pallet } from "../types";
import { Select } from "./ui";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { atom, useAtom } from "jotai";
import { useState, type ReactNode } from "react";
import { css } from "styled-system/css";

export type PalletSelectProps = {
  filter: (pallet: Pallet) => boolean;
  children: (props: { pallet: Pallet; palletSelect: ReactNode }) => ReactNode;
};

const previouslySelectedPalletAtom = atom<number | undefined>();

export function PalletSelect({ filter, children }: PalletSelectProps) {
  const metadata = useMetadata();
  const pallets = metadata.value.pallets.filter(filter);

  const [previouslySelectedPallet, setPreviouslySelectedPallet] = useAtom(
    previouslySelectedPalletAtom,
  );

  const defaultPallet =
    pallets.find((pallet) => pallet.index === previouslySelectedPallet) ??
    pallets.at(0);

  if (defaultPallet === undefined) {
    throw new Error("Metadata doesn't contain any pallet");
  }

  const [selectedPallet, _setSelectedPallet] = useState(defaultPallet.index);

  const setSelectedPallet = (index: number) => {
    _setSelectedPallet(index);
    setPreviouslySelectedPallet(index);
  };

  const palletItems = pallets
    .map((pallet) => ({ label: pallet.name, value: pallet.index }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  return children({
    pallet: pallets.find((pallet) => pallet.index === selectedPallet)!,
    palletSelect: (
      <Select.Root
        items={palletItems}
        // @ts-expect-error ark-ui type error
        value={[selectedPallet]}
        onValueChange={(event) =>
          setSelectedPallet(event.value.at(0) as unknown as number)
        }
        positioning={{ fitViewport: true, sameWidth: true }}
        className={css({ gridArea: "pallet" })}
      >
        <Select.Label>Pallet</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a pallet" />
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
            {palletItems.map((pallet) => (
              <Select.Item key={pallet.value} item={pallet}>
                <Select.ItemText>{pallet.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check fill="currentcolor" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    ),
  });
}
