import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  // TypeScript support
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
      },
      globals: {
          ...globals.browser, // Add console, window, document, etc.
      }
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      ...ts.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "no-redeclare": "off", // Handled by @typescript-eslint/no-redeclare
      "@typescript-eslint/no-redeclare": "warn",
    },
  },

  // React support
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      globals: {
          ...globals.browser,
      }
  }
  },
];