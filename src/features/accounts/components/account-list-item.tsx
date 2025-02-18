import { Heading } from "../../../components/ui/heading";
import { Icon } from "../../../components/ui/icon";
import { Text } from "../../../components/ui/text";
import { AccountDialog } from "./account-info";
import { idle } from "@reactive-dot/core";
import { useLazyLoadQuery } from "@reactive-dot/react";
import IdentityIcon from "@w3f/polkadot-icons/solid/Identity";
import SubIdentityIcon from "@w3f/polkadot-icons/solid/Infrastructure";
import { PolkadotIdenticon } from "dot-identicon/react.js";
import { Suspense, useState } from "react";
import { css, cx } from "styled-system/css";
import { usePeopleChainId } from "~/hooks/chain";
import { toaster } from "~/toaster";
import { getIdentityDisplayValue } from "~/utils";

export type AccountListItemProps = {
  address: string;
  name?: string | undefined;
  interactive?: boolean | undefined;
  canCopyAddress?: boolean | undefined;
  className?: string | undefined;
};

export function AccountListItem(props: AccountListItemProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Suspense
        fallback={
          <AccountListItemTemplate
            {...props}
            onOpenDialog={() => setDialogOpen(true)}
          />
        }
      >
        <SuspendableAccountListItem
          {...props}
          onOpenDialog={() => setDialogOpen(true)}
        />
      </Suspense>
      {dialogOpen && (
        <AccountDialog
          address={props.address}
          name={props.name}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}

export function SuspendableAccountListItem({
  address,
  name,
  interactive,
  canCopyAddress,
  onOpenDialog,
  className,
}: AccountListItemProps & { onOpenDialog: () => unknown }) {
  const identity = useLazyLoadQuery(
    (builder) => builder.readStorage("Identity", "IdentityOf", [address]),
    { chainId: usePeopleChainId() },
  );

  const superIdentity = useLazyLoadQuery(
    (builder) =>
      identity !== undefined
        ? undefined
        : builder.readStorage("Identity", "SuperOf", [address]),
    { chainId: usePeopleChainId() },
  );

  const superAccountIdentity = useLazyLoadQuery(
    (builder) =>
      superIdentity === idle || superIdentity === undefined
        ? undefined
        : builder.readStorage("Identity", "IdentityOf", [superIdentity[0]]),
    { chainId: usePeopleChainId() },
  );

  const identityDisplay =
    getIdentityDisplayValue(identity?.[0]?.info.display) ??
    (superIdentity === idle ||
    superIdentity === undefined ||
    superAccountIdentity === idle ||
    superAccountIdentity === undefined
      ? undefined
      : `${getIdentityDisplayValue(superAccountIdentity[0].info.display)}/${getIdentityDisplayValue(superIdentity[1])}`);

  const displayName = identityDisplay ?? name;

  const hasOnChainIdentity = identity !== undefined;

  const isSubIdentity =
    !hasOnChainIdentity &&
    superIdentity !== idle &&
    superIdentity !== undefined;

  return (
    <AccountListItemTemplate
      address={address}
      displayName={displayName}
      displayNameType={
        hasOnChainIdentity
          ? "on-chain"
          : isSubIdentity
            ? "sub-identity"
            : undefined
      }
      interactive={interactive}
      canCopyAddress={canCopyAddress}
      onOpenDialog={onOpenDialog}
      className={className}
    />
  );
}

type AccountListItemTemplateProps = {
  address: string;
  displayName?: string | undefined;
  displayNameType?: "on-chain" | "sub-identity" | undefined;
  interactive?: boolean | undefined;
  canCopyAddress?: boolean | undefined;
  onOpenDialog: () => unknown;
  className?: string | undefined;
};

function AccountListItemTemplate({
  address,
  displayName,
  displayNameType: identityType,
  interactive = true,
  canCopyAddress = interactive,
  onOpenDialog,
  className,
}: AccountListItemTemplateProps) {
  return (
    <article
      className={cx(
        className,
        css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "0.5rem",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }),
      )}
    >
      <PolkadotIdenticon
        address={address}
        size="2.2rem"
        backgroundColor="var(--colors-fg-default)"
        onClick={
          !canCopyAddress
            ? undefined
            : () =>
                toaster.promise(navigator.clipboard.writeText(address), {
                  loading: { title: "Copying address" },
                  success: { title: "Copied address" },
                  error: { title: "Failed to copy address" },
                })
        }
        className={css({ cursor: !canCopyAddress ? undefined : "copy" })}
      />
      <div
        onClick={!interactive ? undefined : () => onOpenDialog?.()}
        className={css({
          overflow: "hidden",
          cursor: !interactive ? undefined : "pointer",
          "&:hover": {
            textDecoration: !interactive ? undefined : "underline",
          },
        })}
      >
        <header
          title={(() => {
            switch (identityType) {
              case "on-chain":
                return "On-chain identity";
              case "sub-identity":
                return "Sub-account";
              default:
                return undefined;
            }
          })()}
          className={css({
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            overflow: "hidden",
          })}
        >
          {(() => {
            switch (identityType) {
              case "on-chain":
                return (
                  <Icon size="sm">
                    <IdentityIcon fill="var(--colors-color-palette-emphasized)" />
                  </Icon>
                );
              case "sub-identity":
                return (
                  <Icon size="sm">
                    <SubIdentityIcon fill="var(--colors-color-palette-emphasized)" />
                  </Icon>
                );
              default:
                return undefined;
            }
          })()}
          <Heading
            className={css({
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            })}
            style={
              identityType === undefined
                ? undefined
                : { color: "var(--colors-color-palette-emphasized)" }
            }
          >
            {displayName ?? (
              <span
                className={css({
                  fontFamily: "monospace",
                  display: "contents",
                })}
              >
                {address}
              </span>
            )}
          </Heading>
        </header>
        {displayName !== undefined && (
          <Text
            className={css({
              fontFamily: "monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
            })}
          >
            {address}
          </Text>
        )}
      </div>
    </article>
  );
}
