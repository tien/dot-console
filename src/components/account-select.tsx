import { AccountListItem } from "../features/accounts/components/account-list-item";
import { Select } from "./select";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import { useAccounts } from "@reactive-dot/react";
import { useMemo, useState, type ReactNode } from "react";

type ControlledAccountSelectProps = {
  accounts: WalletAccount[];
  account: WalletAccount | undefined;
  onChangeAccount: (account: WalletAccount) => void;
};

type UnControlledAccountSelectProps = {
  children: (props: {
    account: WalletAccount | undefined;
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
  const [_account, setAccount] = useState(accounts.at(0));

  const account = useMemo(
    () =>
      _account === undefined && accounts.length > 0 ? accounts.at(0) : _account,
    [_account, accounts],
  );

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
    address: account.address,
    name: account.name,
  }));

  return (
    <Select
      label="Account"
      placeholder="Select account"
      options={accountItems}
      renderOption={(option) => (
        <AccountListItem
          address={option.address}
          name={option.name}
          interactive={false}
        />
      )}
      value={account === undefined ? undefined : getAccountId(account)}
      renderValue={(value) => (
        <AccountListItem
          address={value.address}
          name={value.name}
          interactive={false}
        />
      )}
      onChangeValue={(value) => {
        const selectedAccount = accounts.find(
          (account) => getAccountId(account) === value,
        );

        if (selectedAccount !== undefined) {
          onChangeAccount(selectedAccount);
        }
      }}
    />
  );
}

function getAccountId(account: WalletAccount) {
  return `${account.wallet.id}/${account.address}`;
}
