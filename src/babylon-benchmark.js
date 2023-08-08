// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { parse } from "@babel/parser";
import fs from "fs";

const payloads = [
  {
    name: "jquery-3.2.1.js",
    options: { sourceType: "script" },
  },
  {
    name: "lodash.core-4.17.4.js",
    options: { sourceType: "script" },
  },
  {
    name: "preact-8.2.5.js",
    options: { sourceType: "script" },
  },
  {
    name: "redux.min-3.7.2.js",
    options: { sourceType: "script" },
  },
  {
    name: "speedometer-es2015-test-2.0.js",
    options: { sourceType: "script" },
  },
  {
    name: "todomvc/react/app.jsx",
    options: { sourceType: "script", plugins: ["jsx"] },
  },
  {
    name: "todomvc/react/footer.jsx",
    options: { sourceType: "script", plugins: ["jsx"] },
  },
  {
    name: "todomvc/react/todoItem.jsx",
    options: { sourceType: "script", plugins: ["jsx"] },
  },
  {
    name: "underscore-1.8.3.js",
    options: { sourceType: "script" },
  },
  {
    name: "vue.runtime.esm-nobuble-2.4.4.js",
    options: { sourceType: "module" },
  },
].map(({ name, options }) => ({
  payload: fs.readFileSync(`third_party/${name}`, "utf8"),
  options,
}));

export const name = "babylon";
export function fn() {
  return payloads.map(({ payload, options }) => parse(payload, options));
}
