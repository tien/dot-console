import { AccountSelect } from "../account-select";
import { Input, Switch } from "../ui";
import { INCOMPLETE, INVALID, ParamProps } from "./common";
import type { AccountId20, AccountId32 } from "@polkadot-api/metadata-builders";
import { getSs58AddressInfo } from "@polkadot-api/substrate-bindings";
import { useAccounts } from "@reactive-dot/react";
import { useEffect, useMemo, useState } from "react";
import { css } from "styled-system/css";

export type AccountIdParamProps = ParamProps<string> & {
  accountId: AccountId20 | AccountId32;
};

export function AccountIdParam({
  accountId,
  onChangeValue,
}: AccountIdParamProps) {
  const accounts = useAccounts();
  const [account, setAccount] = useState(accounts.at(0));

  const [useCustom, setUseCustom] = useState(accounts.length === 0);

  useEffect(
    () => {
      if (account !== undefined) {
        onChangeValue(account.address);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account],
  );

  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      })}
    >
      <Switch
        checked={useCustom}
        onCheckedChange={(event) => setUseCustom(event.checked)}
      >
        Use custom account
      </Switch>
      {useCustom ? (
        <CustomAccountParam
          accountId={accountId}
          onChangeValue={onChangeValue}
        />
      ) : (
        <AccountSelect
          accounts={accounts}
          account={account}
          onChangeAccount={setAccount}
        />
      )}
    </section>
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
