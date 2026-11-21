# Web Tooling Benchmark

[![Build Status](https://github.com/manbearwiz/web-tooling-benchmark/actions/workflows/static.yml/badge.svg)](https://github.com/manbearwiz/web-tooling-benchmark/actions/workflows/static.yml) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

This is a benchmark suite designed to measure the JavaScript-related
workloads commonly used by web developers, such as the
core workloads in popular tools like [Babel](https://github.com/babel/babel)
or [TypeScript](https://github.com/Microsoft/TypeScript). The goal is to measure **only** the
JavaScript performance aspect (which is affected by the JavaScript engine) and not measure I/O
or other unrelated aspects.

For a detailed understanding of the tests included in this benchmark suite, please refer to our [in-depth
analysis](docs/in-depth.md).

You can access the latest browser version of the benchmark at <https://manbearwiz.github.io/web-tooling-benchmark/>.

> This is a fork of [v8/web-tooling-benchmark](https://github.com/v8/web-tooling-benchmark).
> Version 0.6.0 updates the tools and several input files (see [Changes from v0.5.3](#changes-from-v053)),
> so its scores are not comparable with v0.5.3 results, including older
> Phoronix Test Suite (`pts/node-web-tooling`) results.

## Support

The benchmark runs under [Node.js](https://nodejs.org/) and in browsers. CI tests the
Node.js versions listed in [the CI workflow](.github/workflows/ci.yml); `.nvmrc`
names the version used for development.

Standalone engine shells (`d8`, `jsc`, `jsshell`) are no longer supported: the CLI bundle
loads the benchmarked tools from `node_modules` and relies on Node.js globals.

## Building

To build the benchmark suite, run:

```sh
npm install
```

This builds the Node.js version into `dist/cli.js`. It loads the benchmarked tools from
`node_modules`, so run it from the repository checkout.

To build the browser version into `dist-browser/`, run:

```sh
npm run build:browser
```

To build an individual benchmark instead of the entire suite, set `VITE_ONLY`:

```sh
VITE_ONLY=babel npm run build
```

## Running

Run it via [Node.js](https://nodejs.org/):

```sh
$ node dist/cli.js
Running Web Tooling Benchmark v0.6.0…
-------------------------------------
         acorn:  8.65 runs/s
         babel:  2.05 runs/s
  babel-minify: 18.22 runs/s
       babylon: 10.90 runs/s
         buble:  8.42 runs/s
          chai: 19.17 runs/s
  coffeescript:  5.99 runs/s
        espree: 10.17 runs/s
       esprima: 13.06 runs/s
        jshint: 15.93 runs/s
         lebab:  8.17 runs/s
       postcss: 10.49 runs/s
       prepack:  5.35 runs/s
      prettier:  8.76 runs/s
    source-map: 45.76 runs/s
        terser: 28.19 runs/s
    typescript: 10.18 runs/s
     uglify-js:  6.43 runs/s
-------------------------------------
Geometric mean: 10.51 runs/s
```

The last line is the overall score. If any benchmark throws, the run stops, prints the
error and exits with a non-zero status instead of reporting a score.

Alternatively, serve `dist-browser/` and open it in a browser.

## Changes from v0.5.3

- Harness: [tinybench](https://github.com/tinylibs/tinybench) replaces benchmark.js.
  Each benchmark takes exactly 20 timed samples with no warm-up, and its score is
  1000 divided by the mean sample time in milliseconds.
- Build: Vite replaces webpack, and the code uses ES modules.
- Tools: every benchmarked tool except source-map (still 0.6.1) is updated; see `package.json`. Babylon is now
  `@babel/parser`, and Prettier 3 formats asynchronously.
- Inputs: jQuery 3.7.1, Backbone.js 1.5.0, lodash 4.17.21, Bootstrap 5.3.2,
  Foundation 6.8.1, Vue 2.7.15 and the CoffeeScript 2.7.0 lexer replace the older copies.
  MooTools and Angular Material are gone. espree and esprima now also parse lodash,
  Preact and Redux, and prepack also processes underscore. See the
  [in-depth analysis](docs/in-depth.md) for each benchmark's inputs.
