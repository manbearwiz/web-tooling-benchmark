// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import gmean from "compute-gmean";
import packageJson from "../package.json";
import suite from "./suite";

console.log(`Running Web Tooling Benchmark v${packageJson.version}…`);
console.log("-------------------------------------");

suite.on("error", (event) => {
  const benchmark = event.target;
  const name = benchmark.name;
  const error = benchmark.error;
  console.log(`Encountered error running benchmark ${name}, aborting…`);
  console.log(error.stack);
  suite.abort();
});

suite.on("cycle", (event) => {
  if (suite.aborted) return;
  const benchmark = event.target;
  const name = benchmark.name;
  const hz = benchmark.hz;
  const stats = benchmark.stats;
  console.log(`${name.padStart(14)}: ${hz.toFixed(2).padStart(5)} runs/s`);
});

suite.on("complete", (event) => {
  if (suite.aborted) return;
  const hz = gmean(suite.map((benchmark) => benchmark.hz));
  console.log("-------------------------------------");
  console.log(`Geometric mean: ${hz.toFixed(2).padStart(5)} runs/s`);
});

suite.run();
