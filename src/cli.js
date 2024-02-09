// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { version } from "../package.json";
import suite, { meanOpsPerSecond, init} from "./suite";

console.log(`Running Web Tooling Benchmark v${version}…`);
console.log("-------------------------------------");

suite.addEventListener("error", ({ task: { name, result } }) => {
  console.log(`Encountered error running benchmark ${name}, aborting…`);
  console.log(result.error.stack);
  suite.abort();
});

suite.addEventListener("cycle", ({ task: { name, result } }) => {
  if (suite.aborted) return;
  console.log(
    `${name.padStart(14)}: ${result.hz.toFixed(2).padStart(5)} runs/s`,
  );
});

suite.addEventListener("complete", () => {
  if (suite.aborted) return;
  const hz = meanOpsPerSecond(suite.results);
  console.log("-------------------------------------");
  console.log(`Geometric mean: ${hz.toFixed(2).padStart(5)} runs/s`);
});

init().then(() =>
  suite.run(),
);
