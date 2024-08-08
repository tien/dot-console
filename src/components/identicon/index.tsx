import { type Circle, polkadotIcon } from "./icon.ts";
import { useMemo } from "react";

type IdenticonProps = {
  address: string;
  size?: string | number;
};

function renderCircle({ cx, cy, fill, r }: Circle, key: number) {
  return <circle cx={cx} cy={cy} fill={fill} key={key} r={r} />;
}

export default function Identicon(props: IdenticonProps) {
  const circles = useMemo(() => polkadotIcon(props.address), [props.address]);

  return (
    <svg
      name={props.address}
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 64 64"
    >
      {circles.map(renderCircle)}
    </svg>
  );
}
