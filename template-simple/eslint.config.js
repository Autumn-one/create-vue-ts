import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"], name: "规则名称:js/recommended" },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], languageOptions: { globals: globals.browser }, name: "规则名称:globals.browser" },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } }, name: "规则名称:ts-eslint" },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"], name: "规则名称:css/recommended" },
]);
