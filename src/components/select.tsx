import { Select as BaseSelect } from "./ui/select";
import { createListCollection } from "@ark-ui/react";
import Check from "@w3f/polkadot-icons/solid/Check";
import DropDown from "@w3f/polkadot-icons/solid/DropDown";
import DropDownUp from "@w3f/polkadot-icons/solid/DropDownUp";
import type { ReactNode } from "react";
import { css } from "styled-system/css";
import type { SelectVariant } from "styled-system/recipes";
import type { SystemProperties } from "styled-system/types";

type Option<T> = { label: string; value: T };

export type SelectProps<
  TValue extends string | number,
  TOption extends Option<TValue>,
> = {
  value: TValue | undefined;
  renderValue?: (option: TOption) => ReactNode;
  onChangeValue: (value: TValue) => void;
  options: TOption[];
  renderOption?: (option: TOption) => ReactNode;
  label?: string;
  placeholder?: string;
  variant?: SelectVariant["variant"];
  size?: SelectVariant["size"];
  width?: SystemProperties["width"];
};

export function Select<
  TValue extends string | number,
  TOption extends Option<TValue>,
>({
  value,
  renderValue,
  onChangeValue,
  options,
  renderOption,
  label,
  placeholder,
  variant,
  size,
  width,
}: SelectProps<TValue, TOption>) {
  const collection = createListCollection({
    items: options,
    itemToValue: (option) => String(option.value),
    itemToString: (option) => option.label,
  });

  const selectedOption = collection.find(String(value));

  return (
    <BaseSelect.Root
      collection={collection}
      value={value === undefined ? [] : [String(value)]}
      onValueChange={(event) => {
        const value = event.value.at(0);
        const selectedValue = collection.items.find(
          (item) => String(item.value) === value,
        );

        if (selectedValue !== undefined) {
          onChangeValue(selectedValue.value);
        }
      }}
      positioning={{
        fitViewport: true,
        sameWidth: width === undefined ? true : false,
      }}
      variant={variant}
      size={size}
      width={width}
    >
      {label !== undefined && <BaseSelect.Label>{label}</BaseSelect.Label>}
      <BaseSelect.Control>
        <BaseSelect.Trigger
          style={renderValue !== undefined ? { height: "unset" } : undefined}
        >
          {selectedOption && renderValue !== undefined ? (
            renderValue(selectedOption)
          ) : (
            <BaseSelect.ValueText
              placeholder={placeholder ?? ""}
              className={css({
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              })}
            />
          )}
          <BaseSelect.Indicator>
            <BaseSelect.Context>
              {({ open }) =>
                open ? (
                  <DropDownUp fill="currentcolor" />
                ) : (
                  <DropDown fill="currentcolor" />
                )
              }
            </BaseSelect.Context>
          </BaseSelect.Indicator>
        </BaseSelect.Trigger>
      </BaseSelect.Control>
      <BaseSelect.Positioner>
        <BaseSelect.Content
          className={css({
            maxHeight: "max(50dvh, 8rem)",
            overflow: "auto",
            gap: "0.5rem",
          })}
        >
          {collection.items.map((item) => (
            <BaseSelect.Item key={item.value} item={item}>
              {renderOption?.(item) ?? (
                <>
                  <BaseSelect.ItemText
                    className={css({
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    })}
                  >
                    {item.label}
                  </BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator>
                    <Check fill="currentcolor" />
                  </BaseSelect.ItemIndicator>
                </>
              )}
            </BaseSelect.Item>
          ))}
        </BaseSelect.Content>
      </BaseSelect.Positioner>
    </BaseSelect.Root>
  );
}
