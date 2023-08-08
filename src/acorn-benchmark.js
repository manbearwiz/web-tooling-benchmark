// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { tokenizer, parse } from "acorn";
import fs from "fs";
import { full } from "acorn-walk";

const payloads = [
  {
    name: "backbone.js",
    options: { ecmaVersion: 5, sourceType: "script" },
  },
  {
    name: "jquery.js",
    options: { ecmaVersion: 5, sourceType: "script" },
  },
  {
    name: "lodash.core.js",
    options: { ecmaVersion: 5, sourceType: "script" },
  },
  {
    name: "preact.js",
    options: { ecmaVersion: 5, sourceType: "script" },
  },
  {
    name: "redux.min.js",
    options: { ecmaVersion: 5, sourceType: "script" },
  },
  {
    name: "speedometer-es2015-test-2.0.js",
    options: { ecmaVersion: 6, sourceType: "script" },
  },
  {
    name: "underscore.js",
    options: { ecmaVersion: 5, sourceType: "script" },
  },
  {
    name: "vue.runtime.esm-nobuble.js",
    options: { ecmaVersion: 7, sourceType: "module" },
  },
].map(({ name, options }) => ({
  payload: fs.readFileSync(`third_party/${name}`, "utf8"),
  options: Object.assign(options, { locations: true }, { ranges: true }),
}));

export const name = "acorn";
export function fn() {
  return payloads.map(({ payload, options }) => {
    let count = 0;

    // Test the tokenizer by counting the resulting tokens.
    for (const token of tokenizer(payload, options)) {
      count++;
    }

    // Test the parser.
    const ast = parse(payload, options);

    // Test the AST walker.
    full(ast, (node) => count++);
    return count;
  });
}
