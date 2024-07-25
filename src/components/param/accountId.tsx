import { Input, Select, Switch } from "../ui";
import { INCOMPLETE, INVALID, ParamProps } from "./common";
import type { AccountId20, AccountId32 } from "@polkadot-api/metadata-builders";
import { getSs58AddressInfo } from "@polkadot-api/substrate-bindings";
import { useAccounts } from "@reactive-dot/react";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import type { InjectedPolkadotAccount } from "polkadot-api/pjs-signer";
import { useEffect, useMemo, useState } from "react";
import { css } from "styled-system/css";

type ConnectedAccountParamProps = ParamProps<string>;

function ConnectedAccountParam({ onChangeValue }: ConnectedAccountParamProps) {
  const accounts = useAccounts();
  const [value, setValue] = useState(accounts.at(0)?.address);

  const derivedValue = useMemo(
    () => (value === undefined ? INCOMPLETE : value),
    [value],
  );

  useEffect(
    () => {
      onChangeValue(derivedValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [derivedValue],
  );

  return (
    <Select.Root
      items={accounts.map(({ wallet, ...account }) => ({ ...account }))}
      // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
      itemToString={(account: InjectedPolkadotAccount) =>
        account.name ?? account.address
      }
      // @ts-expect-error TODO: https://github.com/cschroeter/park-ui/issues/351
      itemToValue={(account: InjectedPolkadotAccount) => account.address}
      value={[value].filter((value) => value !== undefined)}
      onValueChange={(event) => setValue(event.value.at(0))}
      positioning={{ fitViewport: true, sameWidth: true }}
    >
      <Select.Label>Account</Select.Label>
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
          className={css({ maxHeight: "max(50dvh, 8rem)", overflow: "auto" })}
        >
          {accounts.map((account) => (
            <Select.Item key={account.address} item={account}>
              <Select.ItemText>
                {account.name ?? account.address}
              </Select.ItemText>
              <Select.ItemIndicator>
                <Check fill="currentcolor" />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}

type CustomAccountParamProps = ParamProps<string> & {
  accountId: AccountId20 | AccountId32;
};

function CustomAccountParam({
  accountId,
  onChangeValue,
}: CustomAccountParamProps) {
  const [value, setValue] = useState("");

  const derivedValue = useMemo(
    () =>
      value.trim() === ""
        ? INCOMPLETE
        : getSs58AddressInfo(value).isValid
          ? value
          : INVALID,
    [value],
  );

  useEffect(
    () => {
      onChangeValue(derivedValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [derivedValue],
  );

  return (
    <Input
      type="text"
      placeholder={accountId.type}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

export type AccountIdParamProps = ParamProps<string> & {
  accountId: AccountId20 | AccountId32;
};

export function AccountIdParam({
  accountId,
  onChangeValue,
}: AccountIdParamProps) {
  const accounts = useAccounts();
  const [useCustom, setUseCustom] = useState(accounts.length === 0);

  return (
    // TODO: some weird bug where inner input will trigger switch, need to inverse order for some reason
    <section
      className={css({
        display: "flex",
        flexDirection: "column-reverse",
        gap: "0.5rem",
      })}
    >
      {useCustom ? (
        <CustomAccountParam
          accountId={accountId}
          onChangeValue={onChangeValue}
        />
      ) : (
        <ConnectedAccountParam onChangeValue={onChangeValue} />
      )}
      <Switch
        checked={useCustom}
        onCheckedChange={(event) => setUseCustom(event.checked)}
      >
        Use custom account
      </Switch>
    </section>
  );
}
