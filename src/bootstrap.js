// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { version } from "../package.json";
import suite, { meanOpsPerSecond } from "./suite";

function displayStatusMessage(message) {
  const element = document.getElementById("status");
  element.innerHTML = `<em>${message}</em>`;
}

function displayResultMessage(name, message, style) {
  const element = document.getElementById(`results-cell-${name}`);
  element.innerHTML = message || "&mdash;";
  element.classList.remove("result", "highlighted-result");
  element.classList.add(style);
}

function reset() {
  suite.reset();
  const resultSummaryDiv = document.getElementById("result-summary");
  resultSummaryDiv.textContent = "";

  const numColumns = 2;
  const columnHeight = Math.ceil((suite.tasks.length + 1) / numColumns);
  const resultsTable = document.getElementById("results");
  let text =
    "<tr>" + "<th>Benchmark</th><th>Runs/Sec</th>".repeat(numColumns) + "</tr>";
  for (let i = 0; i < columnHeight; ++i) {
    text += "<tr>";
    for (let j = 0; j < numColumns; ++j) {
      const index = j * columnHeight + i;
      if (index > suite.tasks.length) break;
      if (index == suite.tasks.length) {
        text += `<td class="benchmark-name geometric-mean">Geometric Mean</td>`;
        text += `<td class="result geometric-mean" id="results-cell-geomean">&mdash;</td>`;
      } else {
        const benchmark = suite.tasks[index];
        text += `<td class="benchmark-name">`;
        text += `<a href="https://github.com/v8/web-tooling-benchmark/blob/master/docs/in-depth.md#${benchmark.name}" target="_blank">${benchmark.name}</a></td>`;
        text += `<td class="result" id="results-cell-${benchmark.name}">&mdash;</td>`;
      }
    }
    text += "</tr>";
  }
  resultsTable.innerHTML = text;
}

function initialize() {
  reset();

  document.title = `Web Tooling Benchmark v${version}`;

  const versionDiv = document.getElementById("version");
  versionDiv.innerHTML = `v${version}`;

  const statusDiv = document.getElementById("status");
  statusDiv.innerHTML = `<a href="javascript:void(0);">Start test</a>`;
  statusDiv.firstChild.onclick = start;
}

function start() {
  reset();

  const statusDiv = document.getElementById("status");
  statusDiv.innerHTML = "<em>Running test suite\u2026</em>";
  // Add a small delay to allow the browser to render the status message.
  suite.setup = () => new Promise((r) => setTimeout(r, 1));
  suite.run();
}

window.onerror = () => {
  // TODO(bmeurer): Provide some sane error page here.
  console.log("SOMETHING WENT WRONG!");
};
window.onload = initialize;

// Helpers for automated runs in Telemetry/Catapult.
window.automated = {
  // Set to true when the whole suite is completed.
  completed: false,
  // The result array of {name, score} pairs.
  results: [],
  // The function that starts the run.
  start,
};

suite.tasks.forEach((task) => {
  task.addEventListener("start", () => {
    if (suite.aborted) return;
    displayResultMessage(
      task.name,
      "<em>Running...</em>",
      "highlighted-result",
    );
    displayStatusMessage(`Running ${task.name}...`);
  });
  task.addEventListener("complete", () => {
    if (suite.aborted) return;
    displayResultMessage(task.name, `${task.result.hz.toFixed(2)}`, "result");
    const iterations = task.result.samples.length;
    displayStatusMessage(`Ran ${iterations} iterations of ${task.name}...`);
  });
});

suite.addEventListener("complete", () => {
  window.automated.completed = true;
  if (suite.aborted) return;
  const hz = meanOpsPerSecond(suite.results);
  window.automated.results = suite.tasks.map(({ name, result }) => ({
    name,
    score: result.hz,
  }));
  window.automated.results.push({ name: "total", score: hz });
  displayResultMessage("geomean", `${hz.toFixed(2)}`, "highlighted-result");

  const statusDiv = document.getElementById("status");
  statusDiv.innerHTML = `<a href="javascript:void(0);">Test again</a>`;
  statusDiv.firstChild.onclick = start;

  const resultSummaryDiv = document.getElementById("result-summary");
  resultSummaryDiv.innerHTML = `<label>Runs/Sec</label><br><span class="score">${hz.toFixed(
    2,
  )}</span>`;
});

suite.addEventListener("error", ({ task: { name, result } }) => {
  window.automated.completed = true;
  document.body.innerHTML = `<h1>ERROR</h1><p>Encountered errors during execution of ${name} test. Refusing to run a partial benchmark suite.</p><pre>${result.error.stack}</pre>`;
  console.error(result.error);
  suite.abort();
});
