import { toaster } from "../../routes/__root.tsx";
import { type Circle, polkadotIcon } from "./icon.ts";
import { useMemo } from "react";
import { css } from "styled-system/css";

type IdenticonProps = {
  address: string;
  size?: string | number;
};

function renderCircle({ cx, cy, fill, r }: Circle, key: number) {
  return <circle cx={cx} cy={cy} fill={fill} key={key} r={r} />;
}

export default function Identicon({ address, size }: IdenticonProps) {
  const circles = useMemo(() => polkadotIcon(address), [address]);

  return (
    <button
      onClick={async () =>
        toaster.promise(globalThis.navigator.clipboard.writeText(address), {
          loading: { title: "Copying address to clipboard" },
          success: { title: "Copied address to clipboard" },
          error: { title: "Failed to copy address" },
        })
      }
      className={css({ display: "contents", cursor: "copy" })}
    >
      <svg
        name={address}
        width={size ?? 24}
        height={size ?? 24}
        viewBox="0 0 64 64"
      >
        {circles.map(renderCircle)}
      </svg>
    </button>
  );
}
