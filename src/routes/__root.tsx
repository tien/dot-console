import { config } from "../config";
import { ReDotChainProvider, ReDotProvider } from "@reactive-dot/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { registerDotConnect } from "dot-connect";

registerDotConnect({ wallets: config.wallets });

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <ReDotProvider config={config}>
      <ReDotChainProvider chainId="polkadot">
        <Outlet />
      </ReDotChainProvider>
    </ReDotProvider>
  );
}
