import { QueryRenderer, useLazyLoadQuery } from "@reactive-dot/react";
import { Suspense } from "react";
import { Center } from "styled-system/jsx";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { InfoHeader } from "~/components/info-header";
import { Badge } from "~/components/ui/badge";
import { Table } from "~/components/ui/table";
import { useRelayChainId } from "~/hooks/chain";

export function Parachains() {
  return (
    <section>
      <InfoHeader>
        <InfoHeader.Item title="Parachains">
          <Suspense fallback={<CircularProgressIndicator size="text" />}>
            <QueryRenderer
              chainId={useRelayChainId()}
              query={(builder) =>
                builder.readStorageEntries("Paras", "ParaLifecycles", [])
              }
            >
              {(lifecycles) => lifecycles.length.toLocaleString()}
            </QueryRenderer>
          </Suspense>
        </InfoHeader.Item>
        <InfoHeader.Item title="Cores">
          <Suspense fallback={<CircularProgressIndicator size="text" />}>
            <QueryRenderer
              chainId="polkadot_coretime"
              query={(builder) => builder.readStorage("Broker", "Status", [])}
            >
              {(data) => data?.core_count.toLocaleString() ?? "N/A"}
            </QueryRenderer>
          </Suspense>
        </InfoHeader.Item>
      </InfoHeader>
      <Suspense
        fallback={
          <Center margin="2rem">
            <CircularProgressIndicator label="Loading parachains" />
          </Center>
        }
      >
        <ParachainsTable />
      </Suspense>
    </section>
  );
}

function ParachainsTable() {
  const [
    [paraLifecycles, freeOnDemandEntries, affinityOnDemandEntries],
    [workloads, reservations, leases],
  ] = useLazyLoadQuery([
    {
      chainId: "polkadot",
      query: (builder) =>
        builder
          .readStorageEntries("Paras", "ParaLifecycles", [])
          .readStorage("OnDemand", "FreeEntries", [])
          .readStorageEntries("OnDemand", "AffinityEntries", []),
    },
    {
      chainId: "polkadot_coretime",
      query: (builder) =>
        builder
          .readStorageEntries("Broker", "Workload", [])
          .readStorage("Broker", "Reservations", [])
          .readStorage("Broker", "Leases", []),
    },
  ]);

  const systemParaIds = new Set(
    reservations
      .flat()
      .map((reservation) => reservation.assignment)
      .filter((x) => x.type === "Task")
      .map((assignment) => assignment.value),
  );

  const legacyParaIds = new Set(leases.map((lease) => lease.task));

  const taskCoresMap = workloads
    .flatMap(([[core], loads]) =>
      loads.map((load) => ({ core, ...load.assignment })),
    )
    .filter((assignment) => assignment.type === "Task")
    .reduce(
      (prev, curr) =>
        prev.set(curr.value, (prev.get(curr.core) ?? new Set()).add(curr.core)),
      new Map<number, Set<number>>(),
    );

  const onDemandCoresMap = affinityOnDemandEntries
    .flatMap(([[core], entries]) =>
      entries.map((entry) => ({ core, paraId: entry.para_id })),
    )
    .reduce(
      (prev, curr) =>
        prev.set(
          curr.paraId,
          (prev.get(curr.core) ?? new Set()).add(curr.core),
        ),
      new Map<number, Set<number>>(),
    );

  const activeOnDemandParaIds = new Set(
    freeOnDemandEntries
      .map((entry) => entry.para_id)
      .concat(
        affinityOnDemandEntries.flatMap(([_, entries]) =>
          entries.map((entry) => entry.para_id),
        ),
      ),
  );

  const parachains = paraLifecycles
    .toSorted(([[a]], [[b]]) => a - b)
    .map(([[paraId]]) => {
      const type = (() => {
        if (systemParaIds.has(paraId)) {
          return "System parachain" as const;
        }

        if (legacyParaIds.has(paraId)) {
          return "Legacy parachain" as const;
        }

        if (taskCoresMap.has(paraId)) {
          return "Parachain" as const;
        }

        if (onDemandCoresMap.has(paraId)) {
          return "On-demand parachain" as const;
        }

        return "On-demand parachain" as const;
      })();

      return {
        type,
        id: paraId,
        active: taskCoresMap.has(paraId) || activeOnDemandParaIds.has(paraId),
        cores: Array.from(
          (taskCoresMap.get(paraId) ?? new Set())?.union(
            onDemandCoresMap.get(paraId) ?? new Set(),
          ) ?? [],
        ),
      };
    });

  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header>Id</Table.Header>
          <Table.Header>Type</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header>Core ID</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {parachains.map((parachain) => (
          <Table.Row key={parachain.id}>
            <Table.Cell>{parachain.id.toLocaleString()}</Table.Cell>
            <Table.Cell
              colorPalette={`${(() => {
                switch (parachain.type) {
                  case "System parachain":
                    return "current";
                  case "Parachain":
                    return "green";
                  case "Legacy parachain":
                    return "violet";
                  case "On-demand parachain":
                    return "blue";
                }
              })()}`}
            >
              <Badge variant="solid">{parachain.type}</Badge>
            </Table.Cell>
            <Table.Cell
              colorPalette={parachain.active ? "success" : "error"}
              color="colorPalette.text"
            >
              {parachain.active ? "Active" : "Inactive"}
            </Table.Cell>
            <Table.Cell>
              {parachain.cores.length > 0 ? parachain.cores.join(", ") : "N/A"}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
