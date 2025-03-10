import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/staking/")({
  loader: () => redirect({ to: "/staking/validators" }),
});
