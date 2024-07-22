import { FixedSizeBinary, Binary } from "@polkadot-api/substrate-bindings";

export function stringifyCodec(variable: unknown) {
  return JSON.stringify(
    variable,
    (_, value) => {
      if (typeof value === "bigint") {
        return value.toLocaleString();
      }

      if (value instanceof FixedSizeBinary) {
        return value.asHex();
      }

      if (value instanceof Binary) {
        return value.asText();
      }

      return value;
    },
    2,
  );
}
