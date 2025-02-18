import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/collectives/")({
  loader: () => redirect({ to: "/collectives/fellowship" }),
});
