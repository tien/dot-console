import { blockInViewAtom } from "../stores/blocks";
import { BlockAuthor } from "./block-author";
import { BlockEventsTable } from "./block-events";
import { BlockExtrinsicsTable } from "./block-extrinsics";
import { useBlock } from "@reactive-dot/react";
import ArrayBackIcon from "@w3f/polkadot-icons/solid/ArrowBack";
import BlockNumberIcon from "@w3f/polkadot-icons/solid/BlockNumber";
import CheckIcon from "@w3f/polkadot-icons/solid/Check";
import CopyIcon from "@w3f/polkadot-icons/solid/Copy";
import { useAtom } from "jotai";
import { Suspense } from "react";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";
import { CircularProgressIndicator } from "~/components/circular-progress-indicator";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Clipboard } from "~/components/ui/clipboard";
import { Heading } from "~/components/ui/heading";
import { IconButton } from "~/components/ui/icon-button";
import { Progress } from "~/components/ui/progress";
import { Tabs } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";

export function BlockDetail() {
  const finalizedBlock = useBlock("finalized");
  const [block, setBlock] = useAtom(blockInViewAtom);

  if (block === undefined) {
    return null;
  }

  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem",
      })}
    >
      <div>
        <Button onClick={() => setBlock(undefined)}>
          <ArrayBackIcon fill="currentcolor" />
          Back
        </Button>
      </div>
      <Suspense fallback={<Progress type="linear" value={null} />}>
        <Card.Root>
          <Card.Header>
            <Card.Title>
              <Heading
                as="h1"
                size="2xl"
                className={css({
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25em",
                })}
              >
                <BlockNumberIcon fill="currentcolor" />
                Block {block.number.toLocaleString()}
              </Heading>
            </Card.Title>
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Card.Title>Block information</Card.Title>
          </Card.Header>
          <Card.Body>
            <dl
              className={css({
                display: "grid",
                gridTemplateColumns: "max-content minmax(0, 1fr)",
                alignItems: "center",
                gap: "1rem",
                "& dt": { color: "fg.subtle" },
              })}
            >
              <dt>Status</dt>
              <dd
                className={css({
                  "&>span": {
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5em",
                  },
                })}
              >
                {block.number > finalizedBlock.number ? (
                  <span>
                    <CircularProgressIndicator size="text" /> Pending
                  </span>
                ) : (
                  <span>
                    <CheckIcon
                      fill={token.var("colors.success.text")}
                      className={css({ width: "1em", height: "1em" })}
                    />{" "}
                    Finalised
                  </span>
                )}
              </dd>

              <dt>Hash</dt>
              <dd>
                <Clipboard.Root value={block.hash}>
                  <Clipboard.Control
                    className={css({ display: "flex", alignItems: "center" })}
                  >
                    <Clipboard.Context>
                      {({ value }) => (
                        <Text className={css({ wordBreak: "break-all" })}>
                          {value}
                        </Text>
                      )}
                    </Clipboard.Context>
                    <Clipboard.Trigger asChild>
                      <IconButton variant="ghost" size="xs">
                        <Clipboard.Indicator
                          copied={<CheckIcon fill="currentcolor" />}
                        >
                          <CopyIcon fill="currentcolor" />
                        </Clipboard.Indicator>
                      </IconButton>
                    </Clipboard.Trigger>
                  </Clipboard.Control>
                </Clipboard.Root>
              </dd>

              <dt>Author</dt>
              <dd>
                <BlockAuthor blockHash={block.hash} />
              </dd>
            </dl>
          </Card.Body>
        </Card.Root>
        <Tabs.Root defaultValue="extrinsics">
          <Card.Root>
            <Card.Header>
              <Tabs.List>
                <Tabs.Trigger value="extrinsics">Extrinsics</Tabs.Trigger>
                <Tabs.Trigger value="events">Events</Tabs.Trigger>
                <Tabs.Indicator />
              </Tabs.List>
            </Card.Header>
            <Card.Body>
              <Tabs.Content value="extrinsics">
                <BlockExtrinsicsTable block={block} />
              </Tabs.Content>
              <Tabs.Content value="events">
                <BlockEventsTable
                  block={block}
                  filterNoise={false}
                  caption="Block's events"
                />
              </Tabs.Content>
            </Card.Body>
          </Card.Root>
        </Tabs.Root>
      </Suspense>
    </section>
  );
}
