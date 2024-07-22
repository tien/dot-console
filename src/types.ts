import {
  Codec,
  metadata as metadataCodec,
} from "@polkadot-api/substrate-bindings";

type _Metadata =
  typeof metadataCodec extends Codec<infer Metadata>
    ? // @ts-expect-error TODO: fix this
      Metadata["metadata"]
    : never;

export type Metadata = Extract<_Metadata, { tag: "v14" | "v15" }>["value"];

export type Pallet = Metadata["pallets"][number];

export type Storage = NonNullable<Pallet["storage"]>["items"][number];

export type StorageQuery = {
  pallet: string;
  storage: string;
  key: unknown;
};
