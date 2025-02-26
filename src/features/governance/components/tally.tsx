import { useNativeTokenAmountFromPlanck } from "@reactive-dot/react";
import { css } from "styled-system/css";
import { HoverCard } from "~/components/ui/hover-card";
import * as Progress from "~/components/ui/styled/progress";

type TallyProps = { ayes: bigint; nays: bigint; support: bigint };

export function Tally({
  ayes: _ayes,
  nays: _nays,
  support: _support,
}: TallyProps) {
  const ayes = useNativeTokenAmountFromPlanck(_ayes);
  const nays = useNativeTokenAmountFromPlanck(_nays);
  const ayesPercent =
    ayes.planck === 0n && nays.planck === 0n
      ? 0.5
      : ayes.planck === 0n
        ? 0
        : ayes.valueOf() / (ayes.valueOf() + nays.valueOf());

  const support = useNativeTokenAmountFromPlanck(_support);

  return (
    <HoverCard.Root openDelay={100}>
      <HoverCard.Trigger asChild>
        <div
          className={css({
            display: "grid",
            gridTemplateAreas: "'this'",
            "&>*": { gridArea: "this" },
          })}
        >
          <Progress.Root value={ayesPercent * 100} min={0} max={100}>
            <Progress.Track backgroundColor="error.default">
              <Progress.Range colorPalette="success" />
            </Progress.Track>
          </Progress.Root>
          <div
            className={css({
              width: "stretch",
              pointerEvents: "none",
            })}
          >
            <div
              className={css({
                margin: "auto",
                width: "1.5px",
                height: "100%",
                backgroundColor: "fg.default",
              })}
            />
          </div>
        </div>
      </HoverCard.Trigger>

      <HoverCard.Positioner>
        <HoverCard.Content>
          <HoverCard.Arrow>
            <HoverCard.ArrowTip />
          </HoverCard.Arrow>
          <dl
            className={css({
              "& dt": { fontWeight: "bold" },
              "& dd + dt": { marginTop: "0.5em" },
            })}
          >
            <dt>Ayes</dt>
            <dd>
              {ayes.toLocaleString(undefined, { notation: "compact" })} ≈{" "}
              {ayesPercent.toLocaleString(undefined, { style: "percent" })}
            </dd>
            <dt>Nays</dt>
            <dd>
              {nays.toLocaleString(undefined, { notation: "compact" })} ≈{" "}
              {(1 - ayesPercent).toLocaleString(undefined, {
                style: "percent",
              })}
            </dd>
            <dt>Support</dt>
            <dd>
              {support.toLocaleString(undefined, { notation: "compact" })}
            </dd>
          </dl>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  );
}
