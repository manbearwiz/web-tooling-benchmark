// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { version } from "../package.json";
import suite, { abort, init, isAborted, meanOpsPerSecond } from "./suite";

// autoprefixer (postcss benchmark) runs browserslist, which prints an
// "outdated caniuse-lite" notice once the locked data is six months old.
// The data is pinned by package-lock.json on purpose so the workload stays
// the same between installs, so keep that notice out of the results.
process.env.BROWSERSLIST_IGNORE_OLD_DATA ??= "1";

console.log(`Running Web Tooling Benchmark v${version}…`);
console.log("-------------------------------------");

function fatalError(message, error) {
  console.error(`${message}\n${error?.stack ?? error}`);
  process.exitCode = 1;
}

suite.addEventListener("error", ({ task: { name, result } }) => {
  if (isAborted()) return;
  fatalError(
    `Encountered error running benchmark ${name}, aborting…`,
    result.error,
  );
  abort();
});

suite.addEventListener("cycle", ({ task: { name, result } }) => {
  if (isAborted()) return;
  console.log(
    `${name.padStart(14)}: ${result.hz.toFixed(2).padStart(5)} runs/s`,
  );
});

suite.addEventListener("complete", () => {
  if (isAborted()) return;
  const hz = meanOpsPerSecond(suite.results);
  console.log("-------------------------------------");
  console.log(`Geometric mean: ${hz.toFixed(2).padStart(5)} runs/s`);
});

async function main() {
  try {
    await init();
  } catch (error) {
    fatalError("Failed to initialize benchmark suite, aborting…", error);
    return;
  }
  await suite.run();
}

main();
