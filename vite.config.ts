/// <reference types="vitest" />

import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      esbuildOptions: { loader: "tsx" },
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        jsxRuntime: "automatic",
        svgoConfig: {
          floatPrecision: 2,
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
            {
              name: "removeAttrs",
              params: {
                attrs: "*:(stroke|fill):((?!^none$).)*",
              },
            },
            {
              name: "addClassesToSVGElement",
              params: {
                classNames: ["icon"],
              },
            },
          ],
        },
        dimensions: false,
        typescript: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    passWithNoTests: true,
    coverage: {
      provider: "v8",
    },
  },
  server: {
    port: 3000,
  },
});
