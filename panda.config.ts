import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import blue from "@park-ui/panda-preset/colors/blue";
import crimson from "@park-ui/panda-preset/colors/crimson";
import green from "@park-ui/panda-preset/colors/green";
import neutral from "@park-ui/panda-preset/colors/neutral";
import red from "@park-ui/panda-preset/colors/red";
import yellow from "@park-ui/panda-preset/colors/yellow";

export default defineConfig({
  preflight: true,
  presets: [
    createPreset({
      accentColor: crimson,
      grayColor: neutral,
      radius: "2xl",
    }),
  ],
  theme: {
    extend: {
      tokens: {
        colors: {
          [green.name]: green.tokens,
          [blue.name]: blue.tokens,
          [yellow.name]: yellow.tokens,
          [red.name]: red.tokens,
          success: green.tokens,
          info: blue.tokens,
          warning: yellow.tokens,
          error: red.tokens,
        },
      },
      semanticTokens: {
        colors: {
          [green.name]: green.semanticTokens,
          [blue.name]: blue.semanticTokens,
          [yellow.name]: yellow.semanticTokens,
          [red.name]: red.semanticTokens,
          success: green.semanticTokens,
          info: blue.semanticTokens,
          warning: yellow.semanticTokens,
          error: red.semanticTokens,
        },
      },
    },
  },
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  jsxFramework: "react",
  outdir: "styled-system",
});
