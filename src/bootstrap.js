// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { html, render, nothing } from "lit-html";
import "./style.scss";
import { version } from "../package.json";
import suite, { meanOpsPerSecond, init } from "./suite.js";
import { classMap } from "lit-html/directives/class-map.js";
import logo from "./Logo.png";

const results = document.getElementById("results");

const resultsTemplate = (activeName) =>
  html`<div id="result-summary">
      ${suite.results.every((result) => !!result)
        ? html`<label>Runs/Sec</label><br />
            <span class="score"
              >${meanOpsPerSecond(suite.results).toFixed(2)}</span
            >`
        : nothing}
    </div>
    <div id="status">
      ${activeName
        ? html`<em>Running ${activeName}...</em>`
        : html`
            <button @click=${start}>
              ${suite.results.some((result) => !!result)
                ? "Test again"
                : "Start test"}
            </button>
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
          ({ name, result }) =>
            html`<tr>
              <td class="benchmark-name">
                <a
                  href="https://github.com/v8/web-tooling-benchmark/blob/master/docs/in-depth.md#${name}"
                  target="_blank"
                >
                  ${name}
                </a>
              </td>
              <td
                class=${classMap({
                  result: true,
                  "highlighted-result": name === activeName,
                })}
              >
                ${name === activeName
                  ? html`<em>Running...</em>`
                  : result?.hz?.toFixed(2) ?? "—"}
              </td>
            </tr>`,
        )}
      </tbody>
    </table>`;

function initialize() {
  document.title = `Web Tooling Benchmark v${version}`;
  render(
    html`<a href="https://github.com/v8/web-tooling-benchmark"
      ><img id="logo" src="${logo}" alt="Web Tooling Benchmark"
    /></a>`,
    document.getElementById("logo-container"),
  );
  render(html`v${version}`, document.getElementById("version"));

  init().then(() => {
    suite.tasks.forEach((task) =>
      task.addEventListener(
        "start",
        () => !suite.aborted && render(resultsTemplate(task.name), results),
      ),
    );

    render(resultsTemplate(), results);
  });
}

function start() {
  suite.reset();
  render(resultsTemplate(), results);
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
  render(resultsTemplate(), results);
});

suite.addEventListener("error", ({ task: { name, result } }) => {
  window.automated.completed = true;
  render(
    html`<h1>ERROR</h1>
      <p>
        Encountered errors during execution of ${name} test. Refusing to run a
        partial benchmark suite.
      </p>
      <pre>${result.error.stack}</pre>`,
    document.body,
  );
  console.error(result.error);
  suite.abort();
});
