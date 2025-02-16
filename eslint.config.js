import eslintReact from "@eslint-react/eslint-plugin";
import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks/index.js";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["src/components/ui/", "src/lib/"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  eslintReact.configs["recommended-typescript"],
  {
    plugins: {
      "react-hooks": fixupPluginRules(reactHooks),
    },
    rules: reactHooks.configs.recommended.rules,
  },
  reactRefresh.configs.recommended,
  {
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
);
