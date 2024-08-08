import { kusama_people_spec, westend_people_spec } from "./chain-specs";
import { memoize } from "./utils";
import {
  kusama,
  kusama_asset_hub,
  kusama_people,
  paseo,
  polkadot,
  polkadot_asset_hub,
  polkadot_collectives,
  polkadot_people,
  westend,
  westend_asset_hub,
  westend_collectives,
  westend_people,
} from "@polkadot-api/descriptors";
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

const getPolkadotChain = memoize(() =>
  import("polkadot-api/chains/polkadot").then(({ chainSpec }) =>
    smoldot.addChain({ chainSpec }),
  ),
);

const getKusamaChain = memoize(() =>
  import("polkadot-api/chains/ksmcc3").then(({ chainSpec }) =>
    smoldot.addChain({ chainSpec }),
  ),
);

const getWestendChain = memoize(() =>
  import("polkadot-api/chains/westend2").then(({ chainSpec }) =>
    smoldot.addChain({ chainSpec }),
  ),
);

export const config = {
  chains: {
    polkadot: {
      descriptor: polkadot,
      provider: () => getSmProvider(getPolkadotChain()),
    },
    polkadot_asset_hub: {
      descriptor: polkadot_asset_hub,
      provider: () =>
        getSmProvider(
          import("polkadot-api/chains/polkadot_asset_hub").then(
            async ({ chainSpec }) =>
              smoldot.addChain({
                chainSpec,
                potentialRelayChains: [await getPolkadotChain()],
              }),
          ),
        ),
    },
    polkadot_collectives: {
      descriptor: polkadot_collectives,
      provider: () =>
        getSmProvider(
          import("polkadot-api/chains/polkadot_collectives").then(
            async ({ chainSpec }) =>
              smoldot.addChain({
                chainSpec,
                potentialRelayChains: [await getPolkadotChain()],
              }),
          ),
        ),
    },
    polkadot_people: {
      descriptor: polkadot_people,
      provider: () =>
        getSmProvider(
          import("polkadot-api/chains/polkadot_people").then(
            async ({ chainSpec }) =>
              smoldot.addChain({
                chainSpec,
                potentialRelayChains: [await getPolkadotChain()],
              }),
          ),
        ),
    },
    kusama: {
      descriptor: kusama,
      provider: () => getSmProvider(getKusamaChain()),
    },
    kusama_asset_hub: {
      descriptor: kusama_asset_hub,
      provider: () =>
        getSmProvider(
          import("polkadot-api/chains/ksmcc3_asset_hub").then(
            async ({ chainSpec }) =>
              smoldot.addChain({
                chainSpec,
                potentialRelayChains: [await getKusamaChain()],
              }),
          ),
        ),
    },
    kusama_people: {
      descriptor: kusama_people,
      provider: () =>
        getSmProvider(
          (async () =>
            smoldot.addChain({
              chainSpec: kusama_people_spec,
              potentialRelayChains: [await getKusamaChain()],
            }))(),
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
      provider: () => getSmProvider(getWestendChain()),
    },
    westend_asset_hub: {
      descriptor: westend_asset_hub,
      provider: () =>
        getSmProvider(
          import("polkadot-api/chains/westend2_asset_hub").then(
            async ({ chainSpec }) =>
              smoldot.addChain({
                chainSpec,
                potentialRelayChains: [await getWestendChain()],
              }),
          ),
        ),
    },
    westend_people: {
      descriptor: westend_people,
      provider: () =>
        getSmProvider(
          (async () =>
            smoldot.addChain({
              chainSpec: westend_people_spec,
              potentialRelayChains: [await getWestendChain()],
            }))(),
        ),
    },
    westend_collectives: {
      descriptor: westend_collectives,
      provider: () =>
        getSmProvider(
          import("polkadot-api/chains/westend2_collectives").then(
            async ({ chainSpec }) =>
              smoldot.addChain({
                chainSpec,
                potentialRelayChains: [await getWestendChain()],
              }),
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
      chainIds: [],
      optionalChainIds: [
        "polkadot:91b171bb158e2d3848fa23a9f1c25182", // Polkadot
        "polkadot:b0a8d493285c2df73290dfb7e61f870f", // Kusama
        "polkadot:77afd6190f1554ad45fd0d31aee62aac", // Paseo
        "polkadot:e143f23803ac50e8f6f8e62695d1ce9e", // Westend
      ],
    }),
  ],
} as const satisfies Config;
