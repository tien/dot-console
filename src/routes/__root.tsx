import { config } from "../config";
import { pending } from "@reactive-dot/core";
import { ReactiveDotProvider, useMutationEffect } from "@reactive-dot/react";
import {
  createRootRoute,
  Outlet,
  retainSearchParams,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import Close from "@w3f/polkadot-icons/solid/Close";
import { registerDotConnect } from "dot-connect";
import "dot-connect/font.css";
import "react18-json-view/src/dark.css";
import "react18-json-view/src/style.css";
import { z } from "zod";
import { IconButton } from "~/components/ui/icon-button";
import { Toaster } from "~/components/ui/styled/toast";
import { Toast } from "~/components/ui/toast";
import { toaster } from "~/toaster";

registerDotConnect({ wallets: config.wallets ?? [] });

const searchSchema = z.object({
  chain: z.string().optional(),
});

export const Route = createRootRoute({
  component: Root,
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [retainSearchParams(["chain"])],
  },
});

function MutationToaster() {
  useMutationEffect((event) => {
    if (event.value === pending) {
      toaster.loading({ id: event.id, title: "Submitting transaction" });
      return;
    }

    if (event.value instanceof Error) {
      toaster.error({ id: event.id, title: "Failed to submit transaction" });
      return;
    }

    switch (event.value.type) {
      case "finalized":
        if (event.value.ok) {
          toaster.success({ id: event.id, title: "Submitted transaction" });
        } else {
          toaster.error({ id: event.id, title: "Transaction failed" });
        }
        break;
      default:
        toaster.loading({ id: event.id, title: "Transaction pending" });
    }
  });

  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root key={toast.id}>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
          <Toast.CloseTrigger asChild>
            <IconButton variant="link" size="sm">
              <Close fill="currentcolor" />
            </IconButton>
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </Toaster>
  );
}

function Root() {
  return (
    <ReactiveDotProvider config={config}>
      <Outlet />
      <MutationToaster />
    </ReactiveDotProvider>
  );
}
