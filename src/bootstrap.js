// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { html, render } from "lit-html";
import "./style.css";
import { version } from "../package.json";
import suite, { meanOpsPerSecond, init } from "./suite.js";
import logo from "./Logo.png";

const app = document.querySelector("#app");

const template = (task = undefined) => {
  if (suite.aborted) return;
  if (task?.error) {
    return html`<h1>ERROR</h1>
      <p>
        Encountered errors during execution of ${task.name} test. Refusing to
        run a partial benchmark suite.
      </p>
      <pre>${task.error.stack}</pre>`;
  }
  const done = suite.results.every((result) => !!result) && !task;
  return html`
    <a href="https://github.com/v8/web-tooling-benchmark"
      ><img id="logo" src="${logo}" alt="Web Tooling Benchmark"
    /></a>

    <p class="summary">
      The Web Tooling Benchmark is a performance test suite focused on
      JavaScript related workloads found in common web developer tools these
      days. For more information, read the
      <a
        href="https://github.com/v8/web-tooling-benchmark/blob/master/docs/in-depth.md"
        >in-depth analysis</a
      >. Bigger scores are better.
    </p>

    <div id="result-summary">
      ${done
        ? html`
            <label>Runs/Sec</label><br />
            <span class="score"
              >${meanOpsPerSecond(suite.results).toFixed(2)}</span
            >
          `
        : ""}
    </div>

    <div id="status">
      ${!!task
        ? html`<em>Running ${task.name}...</em>`
        : html`
            <a href="javascript:void(0);" @click="${start}">
              ${!done ? "Start test" : "Test again"}
            </a>
          `}
    </div>

    <table id="results">
      <thead>
        <tr>
          <th>Benchmark</th>
          <th>Runs/Sec</th>
        </tr>
      </thead>
      <tbody>
        ${suite.tasks.map(
          (task) =>
            html`<tr>
              <td class="benchmark-name">
                <a
                  href="${`https://github.com/v8/web-tooling-benchmark/blob/master/docs/in-depth.md#${task.name}`}"
                >
                  ${task.name}
                </a>
              </td>
              <td class="result" id="results-cell-${task.name}">
                ${task.result?.hz?.toFixed(2) ?? "-"}
              </td>
            </tr>`,
        )}
      </tbody>
    </table>

    <div id="version">${version}</div>
  `;
};

function initialize() {
  init().then(() => {
    suite.tasks.forEach((task) => {
      task.addEventListener("start", () => render(template(task), app));
      task.addEventListener("complete", () => render(template(task), app));
    });

    render(template(), app);
  });
}

function start() {
  suite.reset();
  render(template(), app);
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

suite.addEventListener("complete", () => {
  window.automated.completed = true;
  if (suite.aborted) return;
  const hz = meanOpsPerSecond(suite.results);
  window.automated.results = suite.tasks.map(({ name, result }) => ({
    name,
    score: result.hz,
  }));
  window.automated.results.push({ name: "total", score: hz });
  render(template(), app);
});

suite.addEventListener("error", ({ task }) => {
  window.automated.completed = true;
  render(template(task), app);
  console.error(task.result.error);
  suite.abort();
});
