import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import crimson from "@park-ui/panda-preset/colors/crimson";
import neutral from "@park-ui/panda-preset/colors/neutral";

export default defineConfig({
  preflight: true,
  presets: [
    createPreset({
      accentColor: crimson,
      grayColor: neutral,
      radius: "2xl",
    }),
  ],
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  jsxFramework: "react",
  outdir: "styled-system",
});
