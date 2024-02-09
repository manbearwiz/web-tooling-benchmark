import { defineConfig } from "vite";
import { resolve } from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ mode }) => ({
  build: {
    ...(mode !== "browser"
      ? {
          lib: {
            entry: resolve(__dirname, "src/cli.js"),
            name: "Toolbench",
            fileName: "cli",
            formats: ["cjs"],
          },
          rollupOptions: {
            external: [
              "@babel/parser",
              "@babel/standalone",
              "autoprefixer",
              "babel-minify",
              "buble",
              "coffeescript",
              "jshint",
              "lebab",
              "postcss-nested",
              "postcss",
              "prepack",
              "terser",
              "typescript",
            ],
          },
        }
      : {}),
    minify: false,
    sourcemap: true,
  },
  plugins: [
    nodePolyfills({
      overrides: {
        fs: resolve(__dirname, '__mocks__/fs.js'),
      },
      include: [
        "buffer",
        "fs",
        "module",
        "os",
        "path",
        "process",
        "stream",
        "util",
      ],
    }),
  ],
}));
