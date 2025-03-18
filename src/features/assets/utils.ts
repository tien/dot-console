import type { XcmV3Junctions } from "@polkadot-api/descriptors";

type XcmAssetId = { parents: number; interior: XcmV3Junctions };

export type AssetId = number | XcmAssetId;

export const NATIVE_ASSET_ID = {
  parents: 1,
  interior: {
    type: "Here",
    value: undefined,
  },
} as const satisfies XcmAssetId;

export const USDT_ASSET_ID = 1984;

export function getAssetId(id: AssetId): XcmAssetId {
  return typeof id !== "number"
    ? id
    : {
        parents: 0,
        interior: {
          type: "X2",
          value: [
            { type: "PalletInstance", value: 50 },
            { type: "GeneralIndex", value: BigInt(id) },
          ],
        },
      };
}
