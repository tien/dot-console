import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import amber from "@park-ui/panda-preset/colors/amber";
import blue from "@park-ui/panda-preset/colors/blue";
import crimson from "@park-ui/panda-preset/colors/crimson";
import green from "@park-ui/panda-preset/colors/green";
import neutral from "@park-ui/panda-preset/colors/neutral";
import red from "@park-ui/panda-preset/colors/red";
import violet from "@park-ui/panda-preset/colors/violet";
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
          [red.name]: red.tokens,
          [green.name]: green.tokens,
          [blue.name]: blue.tokens,
          [yellow.name]: yellow.tokens,
          [amber.name]: amber.tokens,
          success: green.tokens,
          info: blue.tokens,
          warning: amber.tokens,
          error: red.tokens,
          violet: violet.tokens,
        },
      },
      semanticTokens: {
        colors: {
          [red.name]: red.semanticTokens,
          [green.name]: green.semanticTokens,
          [blue.name]: blue.semanticTokens,
          [yellow.name]: yellow.semanticTokens,
          [amber.name]: amber.semanticTokens,
          success: green.semanticTokens,
          info: blue.semanticTokens,
          warning: amber.semanticTokens,
          error: red.semanticTokens,
          violet: violet.semanticTokens,
        },
      },
      recipes: {
        spinner: {
          variants: {
            size: {
              text: { "--size": "min(1lh, 1em)" },
            },
          },
        },
      },
    },
  },
  staticCss: {
    css: [
      {
        properties: {
          colorPalette: [
            "success",
            "info",
            "warning",
            "error",
            "violet",
            "red",
            "green",
            "blue",
            "yellow",
            "amber",
            "violet",
          ],
        },
      },
    ],
    recipes: {
      spinner: [{ size: ["text"] }],
    },
  },
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  jsxFramework: "react",
  outdir: "styled-system",
});
