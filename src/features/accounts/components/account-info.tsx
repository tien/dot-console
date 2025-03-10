import {
  useLazyLoadQuery,
  useNativeTokenAmountFromPlanck,
  useSpendableBalance,
} from "@reactive-dot/react";
import type { DenominatedNumber } from "@reactive-dot/utils";
import CloseIcon from "@w3f/polkadot-icons/solid/Close";
import { Suspense, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { css } from "styled-system/css";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { Card } from "~/components/ui/card";
import { Dialog } from "~/components/ui/dialog";
import { Heading } from "~/components/ui/heading";
import { IconButton } from "~/components/ui/icon-button";
import { Link } from "~/components/ui/link";
import { Text } from "~/components/ui/text";
import { AccountListItem } from "~/features/accounts/components/account-list-item";
import { usePeopleChainId } from "~/hooks/chain";
import { getIdentityDisplayValue } from "~/utils";

type AccountInfoProps = {
  address: string;
  name?: string | undefined;
};

export function AccountCard({ address, name }: AccountInfoProps) {
  return (
    <Card.Root>
      <Card.Header
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0.5rem",
        })}
      >
        <AccountListItem address={address} name={name} />
      </Card.Header>
      <Card.Body className={css({ "& dd": { fontWeight: "bold" } })}>
        <AccountBalances address={address} name={name} />
        <AccountIdentity address={address} name={name} />
      </Card.Body>
    </Card.Root>
  );
}

type AccountDialogProps = AccountInfoProps & {
  onClose: () => void;
};

export function AccountDialog({ address, name, onClose }: AccountDialogProps) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog.Root
      open={open}
      onExitComplete={() => onClose()}
      onOpenChange={(event) => {
        if (!event.open) {
          setOpen(false);
        }
      }}
    >
      <Dialog.Backdrop>
        <Dialog.Positioner>
          <Dialog.Content className={css({ padding: "1.5rem 2rem" })}>
            <Dialog.Title
              className={css({ marginBottom: "1rem", paddingRight: "1rem" })}
            >
              <AccountListItem
                address={address}
                name={name}
                interactive={false}
              />
            </Dialog.Title>
            <Dialog.Description>
              <AccountBalances address={address} name={name} />
              <AccountIdentity address={address} name={name} />
            </Dialog.Description>
            <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
              <IconButton variant="ghost" size="sm">
                <CloseIcon fill="currentcolor" />
              </IconButton>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}

function AccountBalances(props: AccountInfoProps) {
  return (
    <Suspense
      fallback={
        <AccountBalancesTemplate
          spendable="pending"
          free="pending"
          frozen="pending"
          reserved="pending"
        />
      }
    >
      <SuspendableAccountBalances {...props} />
    </Suspense>
  );
}

function SuspendableAccountBalances({ address }: AccountInfoProps) {
  const systemAccount = useLazyLoadQuery((builder) =>
    builder.readStorage("System", "Account", [address]),
  );

  const { free, frozen, reserved } = systemAccount.data;

  const spendable = useSpendableBalance(address, {
    includesExistentialDeposit: true,
  });

  return (
    <AccountBalancesTemplate
      spendable={spendable}
      free={useNativeTokenAmountFromPlanck(free)}
      frozen={useNativeTokenAmountFromPlanck(frozen)}
      reserved={useNativeTokenAmountFromPlanck(reserved)}
    />
  );
}

type AccountBalancesTemplateProps = {
  spendable: DenominatedNumber | "pending";
  free: DenominatedNumber | "pending";
  frozen: DenominatedNumber | "pending";
  reserved: DenominatedNumber | "pending";
};

function AccountBalancesTemplate({
  spendable,
  free,
  frozen,
  reserved,
}: AccountBalancesTemplateProps) {
  return (
    <dl className={css({ display: "flex", gap: "1rem", "&>*": { flex: 1 } })}>
      <div>
        <dt>Spendable</dt>
        <Amount value={spendable} />
      </div>
      <div>
        <dt>Free</dt>
        <Amount value={free} />
      </div>
      <div>
        <dt>Frozen</dt>
        <Amount value={frozen} />
      </div>
      <div>
        <dt>Reserved</dt>
        <Amount value={reserved} />
      </div>
    </dl>
  );
}

function Amount({ value }: { value: DenominatedNumber | "pending" }) {
  return (
    <Text
      as="dd"
      color={
        value === "pending" || value.planck === 0n ? undefined : "success.text"
      }
    >
      {value === "pending" ? (
        <CircularProgressIndicator size="text" />
      ) : (
        value.toLocaleString()
      )}
    </Text>
  );
}

export function AccountIdentity(props: AccountInfoProps) {
  return (
    <Suspense>
      <SuspendableAccountIdentity {...props} />
    </Suspense>
  );
}

export function SuspendableAccountIdentity({ address }: AccountInfoProps) {
  const result = useLazyLoadQuery(
    (builder) =>
      builder
        .readStorage("Identity", "IdentityOf", [address])
        .readStorage("Identity", "SuperOf", [address]),
    { chainId: usePeopleChainId() },
  );

  const identity = Array.isArray(result[0]) ? result[0][0] : result[0];
  const [superAddress, subName] = result[1] ?? [];

  if (identity === undefined && subName === undefined) {
    return null;
  }

  const { additional, pgp_fingerprint, ...knowns } =
    identity === undefined
      ? { additional: undefined, pgp_fingerprint: undefined }
      : "additional" in identity.info
        ? identity.info
        : { ...identity.info, additional: undefined };

  return (
    <section>
      <header className={css({ margin: "1rem 0 0.5rem 0" })}>
        <Heading as="h3" size="xl">
          Identity
        </Heading>
      </header>
      <dl
        className={css({
          display: "grid",
          gridTemplateColumns: "max-content minmax(0, 1fr)",
          gap: "0.5rem",
        })}
      >
        {superAddress !== undefined && subName !== undefined && (
          <>
            <dt>Parent-identity</dt>
            <dd>
              <AccountListItem address={superAddress} />
            </dd>
          </>
        )}
        {Object.entries(knowns)
          .filter(([_, value]) => value.value !== undefined)
          .map(([key, value]) => {
            const identityValue = getIdentityDisplayValue(value);

            return (
              <Fragment key={key}>
                <dt className={css({ textTransform: "capitalize" })}>{key}</dt>
                <dd>
                  {(() => {
                    if (identityValue === undefined) {
                      return "N/A";
                    }

                    switch (key) {
                      case "web":
                        return (
                          <Link target="_blank" href={identityValue}>
                            {identityValue}
                          </Link>
                        );
                      case "email":
                        return (
                          <Link
                            href={`mailto:${encodeURIComponent(identityValue)}`}
                          >
                            {identityValue}
                          </Link>
                        );
                      case "github":
                        return (
                          <Link
                            target="_blank"
                            href={`https://github.com/${encodeURIComponent(identityValue)}`}
                          >
                            {identityValue}
                          </Link>
                        );
                      case "matrix":
                        return (
                          <Link
                            target="_blank"
                            href={`https://riot.im/app/#/user/${encodeURIComponent(identityValue)}`}
                          >
                            {identityValue}
                          </Link>
                        );
                      case "twitter":
                        return (
                          <Link
                            target="_blank"
                            href={`https://x.com/${encodeURIComponent(identityValue?.replace("@", ""))}`}
                          >
                            {identityValue}
                          </Link>
                        );
                      default:
                        return identityValue;
                    }
                  })()}
                </dd>
              </Fragment>
            );
          })}
      </dl>
    </section>
  );
}
