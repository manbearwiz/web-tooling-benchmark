// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const { targetList } = require("./src/targetList.json");

const targetSet = new Set(targetList);

function getTarget(env) {
  return env && targetSet.has(env.only) && env.only;
}

module.exports = (env) => [
  {
    mode: "development",
    module: {
      rules: [
        {
          resourceQuery: /raw/,
          type: "asset/source",
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
    context: path.resolve("src"),
    entry: "./cli.js",
    output: {
      filename: "cli.js",
    },
    bail: true,
    resolve: {
      alias: {
        fs: require.resolve("./__mocks__/fs"),
        module: require.resolve("./src/mocks/dummy"),
        os: require.resolve("os-browserify/browser"),
      },
      fallback: {
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        "process/browser": require.resolve("process/browser"),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
      new webpack.BannerPlugin({
        banner:
          "// Required for JavaScript engine shells.\n" +
          "var global = this;\n" +
          "if (typeof console === 'undefined') {\n" +
          "  console = {log: print};\n" +
          "}",
        raw: true,
      }),
      new webpack.DefinePlugin({
        ONLY: JSON.stringify(getTarget(env)),
      }),
    ],
  },
  {
    mode: "development",
    module: {
      rules: [
        {
          resourceQuery: /raw/,
          type: "asset/source",
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
    context: path.resolve("src"),
    entry: "./bootstrap.js",
    output: {
      filename: "browser.js",
    },
    bail: true,
    resolve: {
      alias: {
        define: require.resolve("./src/mocks/dummy"),
        fs: require.resolve("./__mocks__/fs"),
        module: require.resolve("./src/mocks/dummy"),
        os: require.resolve("os-browserify/browser"),
      },
      fallback: {
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        "process/browser": require.resolve("process/browser"),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: "style.css" }, { from: "Logo.png" }],
      }),
      new webpack.BannerPlugin({
        banner:
          "// Work-around for the weird JaegerMonkey\n" +
          "// work-around inside benchmark.js.\n" +
          "const define = { amd: {} };\n",
        raw: true,
      }),
      new HtmlWebpackPlugin({
        template: "./index.html",
        inject: "head",
      }),
      new webpack.DefinePlugin({
        ONLY: JSON.stringify(getTarget(env)),
      }),
    ],
  },
];
