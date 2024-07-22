import type { Constant, ConstantQuery, Pallet } from "../types";
import { Button, Select } from "./ui";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { useState } from "react";
import { css } from "styled-system/css";

export type ConstantSelectProps = {
  pallet: Pallet;
  onAddQuery: (query: ConstantQuery) => void;
};

export function _ConstantSelect({ pallet, onAddQuery }: ConstantSelectProps) {
  const defaultConstantName = pallet.constants.at(0)?.name;

  if (defaultConstantName === undefined) {
    throw new Error("Pallet doesn't contains any constant");
  }

  const [selectedConstant, setSelectedConstant] = useState(defaultConstantName);

  return (
    <>
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
            <ChevronDown />
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
                    <Check />
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
    </>
  );
}

export function ConstantSelect(props: ConstantSelectProps) {
  return <_ConstantSelect key={props.pallet.index} {...props} />;
}
