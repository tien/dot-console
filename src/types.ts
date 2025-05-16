import type { UnifiedMetadata } from "@polkadot-api/substrate-bindings";
import type { ChainId } from "@reactive-dot/core";

export type Pallet = UnifiedMetadata["pallets"][number];

export type Constant = Pallet["constants"][number];

export type Storage = NonNullable<Pallet["storage"]>["items"][number];

export type RuntimeApi = UnifiedMetadata["apis"][number];

export type RuntimeApiMethod = RuntimeApi["methods"][number];

type BaseQuery<T> = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  chainId: ChainId;
  type: T;
};

export type ConstantQuery = BaseQuery<"constant"> & {
  pallet: string;
  constant: string;
};

export type StorageQuery = BaseQuery<"storage"> & {
  pallet: string;
  storage: string;
  key: unknown[];
};

export type StorageEntriesQuery = BaseQuery<"storage-entries"> & {
  pallet: string;
  storage: string;
  key: unknown[];
};

export type RuntimeApiQuery = BaseQuery<"api"> & {
  api: string;
  method: string;
  args: unknown[];
};

export type Query =
  | ConstantQuery
  | StorageQuery
  | StorageEntriesQuery
  | RuntimeApiQuery;
