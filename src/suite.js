// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { Bench } from "tinybench";
import { getTarget } from "./cli-flags-helper";
import gmean from "compute-gmean";

// We need to run deterministically, so we set 'maxTime' to 0, which
// disables the variable iteration count feature of benchmark.js,
// and specify 'minSamples' as 20 to have it collect exactly 20
// samples. We leave the 'initCount' to the default of 1. See
// https://github.com/v8/web-tooling-benchmark/issues/6 for details.
const suite = new Bench({
  time: 0,
  iterations: 20,
});

getTarget().forEach((target) => {
  const { name, fn } = require(`./${target}-benchmark`);
  suite.add(name, fn);
});

/**
 * Computes the geometric mean of the operations per second of the given results.
 */
export function meanOpsPerSecond(results) {
  return gmean(results.map(({ hz }) => hz));
}

export default suite;
