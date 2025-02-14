import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift("babel-plugin-react-compiler");
      },
    }),
  ],
  tools: {
    rspack: {
      plugins: [TanStackRouterRspack()],
    },
  },
  html: {
    template: "./src/index.html",
  },
  source: {
    entry: {
      index: "./src/index.tsx",
    },
  },
});
