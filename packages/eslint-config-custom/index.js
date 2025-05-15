/** @type {import("eslint").Linter.Config} */
export default {
  extends: ["turbo", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    // Defer to Biome for most linting
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "no-undef": "off"
  },
  ignorePatterns: ["node_modules/", "dist/", ".next/", ".turbo/"]
};
