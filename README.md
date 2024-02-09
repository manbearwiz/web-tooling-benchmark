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

## Support

The Web Tooling Benchmark is compatible with the latest [active
LTS](https://github.com/nodejs/Release#release-schedule) version of Node.js. To check the supported Node.js versions for the current release of the benchmark, see the [the `.nvmrc` file](.nvmrc).

## Building

To build the benchmark suite, run:

```sh
npm install
```

After running the command, a bundled version suitable for running in JS shells (e.g., `d8`, `jsc` or `jsshell`) will be available at `dist/cli.js`, along with a browser version at `dist/browser.js`, which is used in `dist/index.html`.

If you wish to build an individual benchmark instead of the entire suite, use the `--env only=` CLI flag like this:

```sh
npm run build -- --env only=babel
```

## Running

You have multiple options for running the benchmark suite:

Run it directly via [Node.js](https://nodejs.org/) by executing the following command:

```sh
$ node dist/cli.js
Running Web Tooling Benchmark v0.5.2…
-------------------------------------
         acorn:  5.50 runs/s
         babel:  6.10 runs/s
  babel-minify:  9.13 runs/s
       babylon:  8.00 runs/s
         buble:  4.77 runs/s
          chai: 14.47 runs/s
  coffeescript:  5.62 runs/s
        espree:  4.05 runs/s
       esprima:  6.68 runs/s
        jshint:  7.84 runs/s
         lebab:  7.52 runs/s
       postcss:  5.06 runs/s
       prepack:  6.26 runs/s
      prettier:  5.97 runs/s
    source-map:  8.60 runs/s
        terser: 16.40 runs/s
    typescript: 10.04 runs/s
     uglify-js:  3.81 runs/s
-------------------------------------
Geometric mean:  6.98 runs/s
```

Alternatively, open a web browser and navigate to `dist/index.html` to run the benchmark using the browser interface.

If you prefer to use JavaScript engine shells, you can run the special bundle in `dist/cli.js`. To install recent versions of the supported JS engine shells, you can use [`jsvu`](https://github.com/GoogleChromeLabs/jsvu). After installation, you can run the benchmark as follows:

```sh
chakra dist/cli.js
javascriptcore dist/cli.js
spidermonkey dist/cli.js
v8 dist/cli.js
```

If you want to run an individual benchmark instead of the entire suite via Node, use the `--only` CLI flag as follows:

```sh
VITE_ONLY=babel npm run build && npm run benchmark
```
