import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks/index.js";
import reactRefresh from "eslint-plugin-react-refresh";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["src/components/ui/"] },
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
  reactRecommended,
  reactJsxRuntime,
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
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
    },
  },
);
