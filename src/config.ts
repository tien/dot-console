import { polkadot, kusama, paseo, westend } from "@polkadot-api/descriptors";
import type { Config } from "@reactive-dot/core";
import { InjectedWalletAggregator } from "@reactive-dot/core/wallets.js";
import { WalletConnect } from "@reactive-dot/core/wallets/wallet-connect.js";
import { getSmProvider } from "polkadot-api/sm-provider";
import { startFromWorker } from "polkadot-api/smoldot/from-worker";

const smoldot = startFromWorker(
  new Worker(new URL("polkadot-api/smoldot/worker", import.meta.url), {
    type: "module",
  }),
);

export const config = {
  chains: {
    polkadot: {
      descriptor: polkadot,
      provider: () =>
        getSmProvider(
          import("polkadot-api/chains/polkadot").then(({ chainSpec }) =>
            smoldot.addChain({ chainSpec }),
          ),
        ),
    },
    kusama: {
      descriptor: kusama,
      provider: () =>
        getSmProvider(
          import("polkadot-api/chains/ksmcc3").then(({ chainSpec }) =>
            smoldot.addChain({ chainSpec }),
          ),
        ),
    },
    paseo: {
      descriptor: paseo,
      provider: () =>
        getSmProvider(
          import("polkadot-api/chains/paseo").then(({ chainSpec }) =>
            smoldot.addChain({ chainSpec }),
          ),
        ),
    },
    westend: {
      descriptor: westend,
      provider: () =>
        getSmProvider(
          import("polkadot-api/chains/westend2").then(({ chainSpec }) =>
            smoldot.addChain({ chainSpec }),
          ),
        ),
    },
  },
  wallets: [
    new InjectedWalletAggregator(),
    new WalletConnect({
      projectId: import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID,
      providerOptions: {
        metadata: {
          name: "ĐÓTConsole",
          description: "Substrate development console.",
          url: globalThis.origin,
          icons: ["/logo.png"],
        },
      },
      chainIds: [
        "polkadot:91b171bb158e2d3848fa23a9f1c25182", // Polkadot
        "polkadot:b0a8d493285c2df73290dfb7e61f870f", // Kusama
        // Nova Wallet does not support Paseo
        // "polkadot:77afd6190f1554ad45fd0d31aee62aac", // Paseo
        "polkadot:e143f23803ac50e8f6f8e62695d1ce9e", // Westend
      ],
    }),
  ],
} as const satisfies Config;
