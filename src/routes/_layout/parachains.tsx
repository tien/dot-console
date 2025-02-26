import { createFileRoute } from "@tanstack/react-router";
import { Parachains } from "~/features/coretime/components/parachains";

export const Route = createFileRoute("/_layout/parachains")({
  component: ParachainsPage,
});

function ParachainsPage() {
  return <Parachains />;
}
