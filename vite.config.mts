import { defineConfig } from "vite";
import { resolve } from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ mode }) => ({
  build: {
    // Separate output folders, so building one version doesn't wipe the other.
    outDir: mode === "browser" ? "dist-browser" : "dist",
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
    // Source maps of the browser bundles (typescript, babel) need more than 8 GB to build.
    sourcemap: mode !== "browser",
  },
  plugins: [
    nodePolyfills({
      overrides: {
        fs: resolve(__dirname, "__mocks__/fs.js"),
      },
      include: [
        "buffer",
        "fs",
        "module",
        "os",
        "path",
        // The CLI must use Node's real process object, or process.exitCode
        // and process.env changes go to a shim and never reach Node.
        ...(mode === "browser" ? ["process"] : []),
        "stream",
        "util",
      ],
      globals: { process: mode === "browser" },
    }),
  ],
}));
