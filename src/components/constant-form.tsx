import type { Constant, ConstantQuery, Pallet } from "../types";
import { PalletSelect } from "./pallet-select";
import { Button, Select } from "./ui";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { ReactNode, useState } from "react";
import { css } from "styled-system/css";

export type ConstantQueryFormProps = {
  pallet: Pallet;
  palletSelect: ReactNode;
  onAddQuery: (query: ConstantQuery) => void;
};

export function _ConstantQueryForm({
  pallet,
  palletSelect,
  onAddQuery,
}: ConstantQueryFormProps) {
  const defaultConstantName = pallet.constants.at(0)?.name;

  if (defaultConstantName === undefined) {
    throw new Error("Pallet doesn't contains any constant");
  }

  const [selectedConstant, setSelectedConstant] = useState(defaultConstantName);

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
        items={pallet.constants}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToString={(constant: Constant) => constant.name}
        // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
        itemToValue={(constant: Constant) => constant.name}
        value={[selectedConstant]}
        onValueChange={(event) => {
          const constant = event.items.at(0) as Constant;

          setSelectedConstant(constant.name);
        }}
        className={css({ gridArea: "storage" })}
      >
        <Select.Label>Constant</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a constant" />
            <Select.Indicator>
              <ChevronDown fill="currentcolor" />
            </Select.Indicator>
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content
            className={css({ maxHeight: "75dvh", overflow: "auto" })}
          >
            {pallet.constants
              .toSorted((a, b) => a.name.localeCompare(b.name))
              .map((constant) => (
                <Select.Item key={constant.name} item={constant}>
                  <Select.ItemText>{constant.name}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check fill="currentcolor" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      <Button
        onClick={() =>
          onAddQuery({
            type: "constant",
            pallet: pallet.name,
            constant: selectedConstant,
          })
        }
        className={css({ gridArea: "submit" })}
      >
        Query
      </Button>
    </div>
  );
}

export function ConstantQueryForm(
  props: Omit<ConstantQueryFormProps, "pallet" | "palletSelect">,
) {
  return (
    <PalletSelect filter={(pallet) => pallet.constants.length > 0}>
      {({ pallet, palletSelect }) => (
        <_ConstantQueryForm
          key={pallet.index}
          pallet={pallet}
          palletSelect={palletSelect}
          {...props}
        />
      )}
    </PalletSelect>
  );
}
