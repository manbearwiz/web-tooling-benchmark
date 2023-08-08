// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import fs from "fs";
import { format } from "prettier/standalone";

import pluginBabel from "prettier/plugins/babel";
import pluginHtml from "prettier/plugins/html";
import pluginEstree from "prettier/plugins/estree";

const parserOptions = {
  parser: "babel",
  plugins: [pluginBabel, pluginHtml, pluginEstree],
};

const payloads = [
  {
    name: "preact-8.2.5.js",
    options: { semi: false, useTabs: false },
  },
  {
    name: "lodash.core-4.17.4.js",
    options: { semi: true, useTabs: true },
  },
  {
    name: "todomvc/react/app.jsx",
    options: { semi: false, useTabs: true },
  },
  {
    name: "todomvc/react/footer.jsx",
    options: { jsxBracketSameLine: true, semi: true, useTabs: true },
  },
  {
    name: "todomvc/react/todoItem.jsx",
    options: { semi: false, singleQuote: true, useTabs: true },
  },
].map(({ name, options }) => ({
  payload: fs.readFileSync(`third_party/${name}`, "utf8"),
  options,
}));

export const name = "prettier";
export const defer = true;
export async function fn(deferred) {
  await Promise.all(
    payloads.map(({ payload, options }) =>
      format(payload, { ...parserOptions, ...options }),
    ),
  );
  deferred.resolve();
}
