import { QueryRenderer } from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { RouteTabs } from "~/components/route-tabs";
import { useGovernanceChainId } from "~/hooks/chain";

export const Route = createFileRoute("/_layout/referenda/_layout")({
  component: ReferendaPage,
});

function ReferendaPage() {
  const governanceChainId = useGovernanceChainId();

  return (
    <RouteTabs>
      <RouteTabs.Item
        to="/referenda"
        label="Active"
        badge={
          <Suspense>
            <QueryRenderer
              chainId={governanceChainId}
              query={(builder) =>
                builder.readStorageEntries("Referenda", "DecidingCount", [])
              }
            >
              {(count) =>
                count.reduce((prev, curr) => prev + curr[1], 0).toLocaleString()
              }
            </QueryRenderer>
          </Suspense>
        }
      />
      <RouteTabs.Item
        to="/referenda/concluded"
        label="Concluded"
        badge={
          <Suspense>
            <QueryRenderer
              chainId={governanceChainId}
              query={(builder) =>
                builder
                  .readStorage("Referenda", "ReferendumCount", [])
                  .readStorageEntries("Referenda", "DecidingCount", [])
              }
            >
              {([totalCount, decidingCount]) =>
                (
                  totalCount -
                  decidingCount.reduce((prev, curr) => prev + curr[1], 0)
                ).toLocaleString()
              }
            </QueryRenderer>
          </Suspense>
        }
      />
    </RouteTabs>
  );
}
