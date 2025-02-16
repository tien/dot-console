import { createFileRoute } from "@tanstack/react-router";
import { SuspendableAssetList } from "~/features/assets/components/assets";

export const Route = createFileRoute("/_layout/assets")({
  component: AssetsPage,
});

function AssetsPage() {
  return <SuspendableAssetList />;
}
