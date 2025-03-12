import { QueryRenderer } from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { RouteTabs } from "~/components/route-tabs";
import { useCollectivesChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/collectives/_layout")({
  component: CollectivesPage,
});

function CollectivesPage() {
  const collectivesChainId = useCollectivesChainId(false);

  if (collectivesChainId === undefined) {
    return null;
  }

  return (
    <RouteTabs>
      <RouteTabs.Item
        to="/collectives/fellowship"
        label="Fellowship"
        badge={
          <Suspense>
            <QueryRenderer
              chainId={collectivesChainId}
              query={(builder) =>
                builder.storageEntries("FellowshipCore", "Member", [])
              }
            >
              {(members) => members.length.toLocaleString()}
            </QueryRenderer>
          </Suspense>
        }
      />
      <RouteTabs.Item
        to="/collectives/ambassador"
        label="Ambassador"
        badge={
          <Suspense>
            <QueryRenderer
              chainId={collectivesChainId}
              query={(builder) =>
                builder.storageEntries("AmbassadorCore", "Member", [])
              }
            >
              {(members) => members.length.toLocaleString()}
            </QueryRenderer>
          </Suspense>
        }
      />
    </RouteTabs>
  );
}
