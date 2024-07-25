import { Select } from "./ui";
import type { PolkadotAccount } from "@reactive-dot/core";
import { useAccounts } from "@reactive-dot/react";
import Check from "@w3f/polkadot-icons/solid/Check";
import ChevronDown from "@w3f/polkadot-icons/solid/ChevronDown";
import { useState, type ReactNode } from "react";
import { css } from "styled-system/css";

export type AccountSelectProps = {
  children: (props: {
    account: PolkadotAccount | undefined;
    accountSelect: ReactNode;
  }) => ReactNode;
};

export function AccountSelect({ children }: AccountSelectProps) {
  const accounts = useAccounts();

  const defaultAccount = accounts.at(0);

  const getAccountId = (account: PolkadotAccount) =>
    `${account.wallet.id}/${account.address}`;

  const [selectedAccountId, setSelectedAccountId] = useState(() => {
    if (defaultAccount === undefined) {
      return undefined;
    }

    return getAccountId(defaultAccount);
  });

  const selectedAccount = accounts.find(
    (account) => getAccountId(account) === selectedAccountId,
  );

  const accountItems = accounts.map(({ wallet, ...account }) => ({
    label: account.name ?? account.address,
    value: getAccountId({ ...account, wallet }),
  }));

  return (
    <>
      {children({
        account: selectedAccount,
        accountSelect: (
          <Select.Root
            items={accountItems}
            value={[selectedAccountId].filter((value) => value !== undefined)}
            onValueChange={(event) => {
              const id = event.value.at(0);

              if (id !== undefined) {
                setSelectedAccountId(id);
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
        ),
      })}
    </>
  );
}
