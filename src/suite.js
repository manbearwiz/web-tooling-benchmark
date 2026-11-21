// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { Bench } from "tinybench";
import { getTarget } from "./cli-flags-helper";
import gmean from "compute-gmean";

// We need to run deterministically, so every benchmark collects exactly
// 20 samples: 'time' is 0, so tinybench stops after 'iterations' samples
// instead of running for a fixed duration. There is no warm-up phase.
// Each benchmark's score is 1000 / (mean sample time in ms). See
// https://github.com/v8/web-tooling-benchmark/issues/6 for the background.
//
// tinybench has no Bench#abort(); a suite is stopped through its
// AbortSignal, which skips every task that has not started yet.
const controller = new AbortController();

const suite = new Bench({
  time: 0,
  iterations: 20,
  signal: controller.signal,
});

/**
 * Stops the suite: tasks that have not started yet are skipped.
 */
export function abort() {
  controller.abort();
}

/**
 * Whether the suite has been aborted, e.g. because a benchmark threw.
 */
export function isAborted() {
  return controller.signal.aborted;
}

export async function init() {
  const targets = getTarget();
  const modules = await Promise.all(
    targets.map((target) => import(`./${target}-benchmark.js`)),
  );
  modules.forEach(({ name, fn }) => suite.add(name, fn));
}

/**
 * Computes the geometric mean of the operations per second of the given results.
 */
export function meanOpsPerSecond(results) {
  return gmean(results.map(({ hz }) => hz));
}

export default suite;
