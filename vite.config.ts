/// <reference types="vitest" />
import path from "node:path";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { webpackStats } from "rollup-plugin-webpack-stats";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  plugins: [
    webpackStats(),
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
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  test: {
    environment: "happy-dom",
    exclude: ["src/test/e2e/**", "node_modules/**"],
    setupFiles: "./src/test/setup.ts",
    passWithNoTests: true,
    coverage: {
      provider: "v8",
    },
  },
});
