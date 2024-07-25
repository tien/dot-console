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
        // TODO: refactor `AccountSelect` to also provide a controlled component instead
        <AccountSelect>
          {({ account, accountSelect }) => {
            onChangeValue(account?.address ?? INCOMPLETE);

            return accountSelect;
          }}
        </AccountSelect>
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
