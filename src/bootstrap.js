import { version } from "../package.json";
import suite, { meanOpsPerSecond } from "./suite";
import { html, render, nothing } from "lit-html";
import { map } from "lit-html/directives/map.js";
import { range } from "lit-html/directives/range.js";
import { choose } from "lit-html/directives/choose.js";

const resultsTemplate = () => {
  const numColumns = 2;
  const columnHeight = Math.ceil((suite.tasks.length + 1) / numColumns);

  return html`<tr>
      ${map(
        range(numColumns),
        () =>
          html`<th>Benchmark</th>
            <th>Runs/Sec</th>`,
      )}
    </tr>
    ${map(
      range(columnHeight),
      (row) =>
        html`<tr>
          ${map([row, row + columnHeight], (task) =>
            choose(
              task,
              [
                [
                  suite.tasks.length,
                  () =>
                    html`<td class="benchmark-name geometric-mean">
                        Geometric Mean
                      </td>
                      <td
                        class="result geometric-mean"
                        id="results-cell-geomean"
                      >
                        &mdash;
                      </td>`,
                ],
                [suite.tasks.length + 1, () => nothing],
              ],
              () => {
                const { name, result } = suite.tasks[task];

                return html`<td class="benchmark-name">
                    <a
                      href="https://github.com/v8/web-tooling-benchmark/blob/master/docs/in-depth.md#${name}"
                      target="_blank"
                    >
                      ${name}
                    </a>
                  </td>
                  <td
                    class="result ${result ? "highlighted-result" : ""}"
                    id="results-cell-${name}"
                  >
                    ${result?.hz?.toFixed(2) ?? "—"}
                  </td>`;
              },
            ),
          )}
        </tr>`,
    )}`;
};

const resultsSummaryTemplate = () =>
  suite.results.every((result) => !!result)
    ? html`<label>Runs/Sec</label><br />
        <span class="score"
          >${meanOpsPerSecond(suite.results).toFixed(2)}</span
        >`
    : nothing;

const statusTemplate = (task) =>
  task
    ? html`<em>Running ${task.name}...</em>`
    : html`
        <a href="javascript:void(0);" @click=${start}>
          ${suite.results.some((result) => !!result)
            ? "Test again"
            : "Start test"}
        </a>
      `;

const renderResults = () => {
  render(resultsSummaryTemplate(), document.getElementById("result-summary"));
  render(resultsTemplate(), document.getElementById("results"));
};

const reset = () => {
  suite.reset();
  renderResults();
};

const initialize = () => {
  reset();
  document.title = `Web Tooling Benchmark v${version}`;
  render(html`v${version}`, document.getElementById("version"));
  render(statusTemplate(), document.getElementById("status"));
};

const start = () => {
  reset();
  render(statusTemplate(), document.getElementById("status"));
  suite.setup = () => new Promise((r) => setTimeout(r, 1));
  suite.run();
};

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
    renderResults();
    render(statusTemplate(task), document.getElementById("status"));
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
  renderResults();
  render(statusTemplate(), document.getElementById("status"));
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
