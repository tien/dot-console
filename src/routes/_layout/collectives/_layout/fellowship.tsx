import { createFileRoute } from "@tanstack/react-router";
import { Fellowship } from "~/features/collectives/components/fellowship";

export const Route = createFileRoute("/_layout/collectives/_layout/fellowship")(
  {
    component: Fellowship,
  },
);
