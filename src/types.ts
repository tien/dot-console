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

export type Constant = Pallet["constants"][number];

export type Storage = NonNullable<Pallet["storage"]>["items"][number];

export type RuntimeApi = Metadata["apis"][number];

export type RuntimeApiMethod = RuntimeApi["methods"][number];

export type ConstantQuery = {
  type: "constant";
  pallet: string;
  constant: string;
};

export type StorageQuery = {
  type: "storage";
  pallet: string;
  storage: string;
  key: unknown[];
};

export type StorageEntriesQuery = {
  type: "storage-entries";
  pallet: string;
  storage: string;
  key: unknown[];
};

export type RuntimeApiQuery = {
  type: "api";
  api: string;
  method: string;
  args: unknown[];
};

export type Query =
  | ConstantQuery
  | StorageQuery
  | StorageEntriesQuery
  | RuntimeApiQuery;
