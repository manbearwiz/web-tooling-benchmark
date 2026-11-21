// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { html, render, nothing } from "lit-html";
import "./style.scss";
import { version, repository } from "../package.json";
import suite, { abort, init, isAborted, meanOpsPerSecond } from "./suite.js";
import { classMap } from "lit-html/directives/class-map.js";
import logo from "./Logo.png";

const docsUrl = `${repository}/blob/master/docs/in-depth.md`;

const results = document.getElementById("results");

// Helpers for automated runs in Telemetry/Catapult.
window.automated = {
  // Set to true when the whole suite is completed, or has failed.
  completed: false,
  // The result array of {name, score} pairs.
  results: [],
  // Set to the error message when the suite failed.
  error: null,
  // The function that starts the run.
  start,
};

const resultsTemplate = (activeName) =>
  html`<div id="result-summary">
      ${suite.results.length > 0 && suite.results.every((result) => !!result)
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
                <a href="${docsUrl}#${name}" target="_blank"> ${name} </a>
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

// lit-html escapes interpolated values, so error text is shown verbatim.
function displayFatalError(error, message) {
  window.automated.completed = true;
  window.automated.error = message;
  // render() keeps existing children, so clear the page first.
  document.body.replaceChildren();
  render(
    html`<h1>ERROR</h1>
      <p>${message}</p>
      <pre>${error?.stack ?? String(error)}</pre>`,
    document.body,
  );
  console.error(error);
}

function start() {
  suite.reset();
  window.automated.completed = false;
  window.automated.results = [];
  render(resultsTemplate(), results);
  // Add a small delay to allow the browser to render the status message.
  suite.setup = () => new Promise((r) => setTimeout(r, 1));
  return suite.run();
}

suite.addEventListener("complete", () => {
  if (isAborted()) return;
  const hz = meanOpsPerSecond(suite.results);
  window.automated.results = suite.tasks.map(({ name, result }) => ({
    name,
    score: result.hz,
  }));
  window.automated.results.push({ name: "total", score: hz });
  window.automated.completed = true;
  render(resultsTemplate(), results);
});

suite.addEventListener("error", ({ task: { name, result } }) => {
  if (isAborted()) return;
  abort();
  displayFatalError(
    result.error,
    `Encountered errors during execution of ${name} test. Refusing to run a partial benchmark suite.`,
  );
});

window.onerror = (message, _source, _lineno, _colno, error) => {
  displayFatalError(
    error ?? message,
    "Unexpected runtime error during benchmark.",
  );
  return true;
};

async function initialize() {
  document.title = `Web Tooling Benchmark v${version}`;
  render(
    html`<a href="${repository}"
      ><img id="logo" src="${logo}" alt="Web Tooling Benchmark"
    /></a>`,
    document.getElementById("logo-container"),
  );
  render(html`v${version}`, document.getElementById("version"));

  try {
    await init();
  } catch (error) {
    displayFatalError(error, "Failed to initialize benchmark suite.");
    return;
  }

  suite.tasks.forEach((task) =>
    task.addEventListener(
      "start",
      () => !isAborted() && render(resultsTemplate(task.name), results),
    ),
  );
  render(resultsTemplate(), results);
}

window.onload = initialize;
