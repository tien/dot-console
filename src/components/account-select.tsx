import { Select } from "./ui";
import type { PolkadotAccount } from "@reactive-dot/core";
import { useAccounts } from "@reactive-dot/react";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { useState, type ReactNode } from "react";
import { css } from "styled-system/css";

type ControlledAccountSelectProps = {
  accounts: PolkadotAccount[];
  account: PolkadotAccount | undefined;
  onChangeAccount: (account: PolkadotAccount) => void;
};

type UnControlledAccountSelectProps = {
  children: (props: {
    account: PolkadotAccount | undefined;
    accountSelect: ReactNode;
  }) => ReactNode;
};

export type AccountSelectProps =
  | ControlledAccountSelectProps
  | UnControlledAccountSelectProps;

export function AccountSelect(props: AccountSelectProps) {
  return "children" in props ? (
    <UnControlledAccountSelect {...props} />
  ) : (
    <ControlledAccountSelect {...props} />
  );
}

export function UnControlledAccountSelect({
  children,
}: UnControlledAccountSelectProps) {
  const accounts = useAccounts();
  const [account, setAccount] = useState(accounts.at(0));

  return (
    <>
      {children({
        account,
        accountSelect: (
          <ControlledAccountSelect
            accounts={accounts}
            account={account}
            onChangeAccount={setAccount}
          />
        ),
      })}
    </>
  );
}

export function ControlledAccountSelect({
  accounts,
  account,
  onChangeAccount,
}: ControlledAccountSelectProps) {
  const accountItems = accounts.map(({ wallet, ...account }) => ({
    label: account.name ?? account.address,
    value: getAccountId({ ...account, wallet }),
  }));

  return (
    <Select.Root
      items={accountItems}
      value={[account === undefined ? undefined : getAccountId(account)].filter(
        (value) => value !== undefined,
      )}
      onValueChange={(event) => {
        const id = event.value.at(0);
        const selectedAccount = accounts.find(
          (account) => getAccountId(account) === id,
        );

        if (selectedAccount !== undefined) {
          onChangeAccount(selectedAccount);
        }
      }}
      positioning={{ fitViewport: true, sameWidth: true }}
    >
      <Select.Label>Account</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select an account" />
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
          {accountItems.map((item) => (
            <Select.Item key={item.value} item={item}>
              <Select.ItemText>{item.label}</Select.ItemText>
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

function getAccountId(account: PolkadotAccount) {
  return `${account.wallet.id}/${account.address}`;
}
