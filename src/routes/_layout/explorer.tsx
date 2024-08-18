import { BlockDetail } from "../../features/explorer/components/block-detail";
import { Events } from "../../features/explorer/components/block-events";
import { Blocks } from "../../features/explorer/components/blocks";
import { Statistics } from "../../features/explorer/components/statistics";
import {
  blockExtrinsicsMapAtom,
  blockInViewAtom,
  blockMapAtom,
} from "../../features/explorer/stores/blocks";
import { unstable_getBlockExtrinsics } from "@reactive-dot/core";
import { useClient, useTypedApi } from "@reactive-dot/react";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { mergeMap, type Subscription } from "rxjs";
import { css } from "styled-system/css";

export const Route = createFileRoute("/_layout/explorer")({
  component: ExplorerPage,
});

function ExplorerPage() {
  const setBlockMap = useSetAtom(blockMapAtom);
  const [blockInView, setBlockInView] = useAtom(blockInViewAtom);

  const client = useClient();
  const typedApi = useTypedApi();

  useEffect(() => {
    return () => {
      setBlockMap(new Map());
      setBlockInView(undefined);
    };
  }, [setBlockInView, setBlockMap]);

  useEffect(() => {
    const subscription = client.bestBlocks$.subscribe({
      next: (bestBlocks) =>
        setBlockMap((blocks) => {
          const newBlocks = new Map(blocks);

          for (const bestBlock of bestBlocks) {
            newBlocks.set(bestBlock.number, bestBlock);
          }

          return newBlocks;
        }),
    });

    return () => subscription.unsubscribe();
  }, [client.bestBlocks$, setBlockMap]);

  const setBlockExtrinsicsMap = useSetAtom(blockExtrinsicsMapAtom);

  useEffect(() => {
    let subscription: Subscription;

    const startSubscription = () => {
      subscription = client.bestBlocks$
        .pipe(
          mergeMap((blocks) =>
            Promise.all(
              blocks.map((block) =>
                unstable_getBlockExtrinsics(client, typedApi, block.hash).then(
                  (extrinsics) => ({ ...block, extrinsics }),
                ),
              ),
            ),
          ),
        )
        .subscribe({
          next: (blocks) =>
            setBlockExtrinsicsMap((prevBlocks) => {
              const newBlocks = new Map(prevBlocks);

              for (const block of blocks) {
                if (block.extrinsics !== undefined) {
                  newBlocks.set(block.hash, block.extrinsics);
                }
              }

              return newBlocks;
            }),
          error: (error) => {
            console.error("block error", error);
            return startSubscription();
          },
        });
    };

    startSubscription();

    return () => subscription.unsubscribe();
  }, [client, setBlockExtrinsicsMap, typedApi]);

  return (
    <>
      <div style={{ display: blockInView === undefined ? "contents" : "none" }}>
        <LiveView />
      </div>
      {blockInView !== undefined && <BlockDetail />}
    </>
  );
}

function LiveView() {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateAreas: `
        "statistics"
        "blocks"
        "events"
      `,
        "@media(min-width: 68rem)": {
          flex: "1 1 0",
          gridTemplateAreas: `
          "statistics statistics"
          "blocks     events"
        `,
          gridAutoRows: "min-content 1fr",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          overflow: "hidden",
        },
      })}
    >
      <Statistics className={css({ gridArea: "statistics" })} />
      <div className={css({ gridArea: "blocks", overflow: "auto" })}>
        <Blocks />
      </div>
      <div className={css({ gridArea: "events", overflow: "auto" })}>
        <Events />
      </div>
    </div>
  );
}
