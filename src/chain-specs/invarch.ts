export const invarchChainSpec = JSON.stringify({
  name: "InvArch Network",
  id: "invarch_polkadot",
  chainType: "Live",
  bootNodes: [
    "/dns/invarch-boot.dwellir.com/tcp/443/wss/p2p/12D3KooWHWLn81PF8T29cxeeq12hpJoaPNbJbuvtZ6pJxJ8asnTY",
    "/dns/invarch-boot.dwellir.com/tcp/30363/p2p/12D3KooWHWLn81PF8T29cxeeq12hpJoaPNbJbuvtZ6pJxJ8asnTY",
    "/dns/invarch.boot.stake.plus/tcp/30332/wss/p2p/12D3KooWJ7dgREmmhiA5skqEf1C7N43ex9uawaXuyQumhxg66Zoa",
    "/dns/invarch.boot.stake.plus/tcp/31332/wss/p2p/12D3KooWLLHBRKvbRgWA5eD2DSFEeEz7i5V9zPVCkCeMdyT966Ui",
  ],
  properties: {
    ss58Format: 117,
    tokenDecimals: 12,
    tokenSymbol: "VARCH",
  },
  relay_chain: "polkadot",
  para_id: 3340,
  codeSubstitutes: {},
  genesis: {
    stateRootHash:
      "0x64d77bb0ea342ea5b053fba4fd29248b1c3a5b20a8a9ef0cfc14cf45b0c5a4fb",
  },
});
