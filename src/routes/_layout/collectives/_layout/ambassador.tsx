import { createFileRoute } from "@tanstack/react-router";
import { AmbassadorCollective } from "~/features/collectives/components/ambassador";

export const Route = createFileRoute("/_layout/collectives/_layout/ambassador")(
  {
    component: AmbassadorCollective,
  },
);
