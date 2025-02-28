import { use } from "react";

const { promise: foreverPromise } = Promise.withResolvers();

export function ForeverSuspense() {
  use(foreverPromise);
  return null;
}
