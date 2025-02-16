import { hydrationChainSpec } from "./chain-specs/hydration";
import { invarchChainSpec } from "./chain-specs/invarch";
import {
  hydration,
  invarch,
  kusama,
  kusama_asset_hub,
  kusama_people,
  paseo,
  paseo_asset_hub,
  polkadot,
  polkadot_asset_hub,
  polkadot_collectives,
  polkadot_people,
  westend,
  westend_asset_hub,
  westend_collectives,
  westend_people,
} from "@polkadot-api/descriptors";
import { defineConfig } from "@reactive-dot/core";
import { createLightClientProvider } from "@reactive-dot/core/providers/light-client.js";
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";
import { LedgerWallet } from "@reactive-dot/wallet-ledger";
import { WalletConnect } from "@reactive-dot/wallet-walletconnect";

const lightClientProvider = createLightClientProvider();

const polkadotProvider = lightClientProvider.addRelayChain({ id: "polkadot" });

const kusamaProvider = lightClientProvider.addRelayChain({ id: "kusama" });

const paseoProvider = lightClientProvider.addRelayChain({ id: "paseo" });

const westendProvider = lightClientProvider.addRelayChain({ id: "westend" });

export const config = defineConfig({
  chains: {
    polkadot: {
      descriptor: polkadot,
      provider: polkadotProvider,
    },
    polkadot_asset_hub: {
      descriptor: polkadot_asset_hub,
      provider: polkadotProvider.addParachain({ id: "polkadot_asset_hub" }),
    },
    polkadot_collectives: {
      descriptor: polkadot_collectives,
      provider: polkadotProvider.addParachain({ id: "polkadot_collectives" }),
    },
    polkadot_people: {
      descriptor: polkadot_people,
      provider: polkadotProvider.addParachain({ id: "polkadot_people" }),
    },
    hydration: {
      descriptor: hydration,
      provider: polkadotProvider.addParachain({
        chainSpec: hydrationChainSpec,
      }),
    },
    invarch: {
      descriptor: invarch,
      provider: polkadotProvider.addParachain({ chainSpec: invarchChainSpec }),
    },
    kusama: {
      descriptor: kusama,
      provider: kusamaProvider,
    },
    kusama_asset_hub: {
      descriptor: kusama_asset_hub,
      provider: kusamaProvider.addParachain({ id: "kusama_asset_hub" }),
    },
    kusama_people: {
      descriptor: kusama_people,
      provider: kusamaProvider.addParachain({ id: "kusama_people" }),
    },
    paseo: {
      descriptor: paseo,
      provider: paseoProvider,
    },
    paseo_asset_hub: {
      descriptor: paseo_asset_hub,
      provider: paseoProvider.addParachain({ id: "paseo_asset_hub" }),
    },
    westend: {
      descriptor: westend,
      provider: westendProvider,
    },
    westend_asset_hub: {
      descriptor: westend_asset_hub,
      provider: westendProvider.addParachain({ id: "westend_asset_hub" }),
    },
    westend_people: {
      descriptor: westend_people,
      provider: westendProvider.addParachain({ id: "westend_people" }),
    },
    westend_collectives: {
      descriptor: westend_collectives,
      provider: westendProvider.addParachain({ id: "westend_collectives" }),
    },
  },
  wallets: [
    new InjectedWalletProvider(),
    new LedgerWallet(),
    new WalletConnect({
      projectId: import.meta.env.PUBLIC_WALLET_CONNECT_PROJECT_ID,
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
      ],
      optionalChainIds: [
        "polkadot:91b171bb158e2d3848fa23a9f1c25182", // Polkadot
        "polkadot:b0a8d493285c2df73290dfb7e61f870f", // Kusama
        "polkadot:77afd6190f1554ad45fd0d31aee62aac", // Paseo
        "polkadot:e143f23803ac50e8f6f8e62695d1ce9e", // Westend
      ],
    }),
  ],
});
