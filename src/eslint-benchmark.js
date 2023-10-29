// Copyright 2023 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import fs from "fs";
import * as eslint from "eslint-linter-browserify";

const payloads = [
  "backbone.js",
  "jquery.js",
  "lodash.core.js",
  "preact.js",
  "redux.js",
  "underscore.js",
].map((name) => fs.readFileSync(`third_party/${name}`, "utf8"));

export const name = "eslint";
export const defer = true;
export async function fn(deferred) {
  await Promise.all(
    payloads.map(async (payload) => {
      const linter = new eslint.Linter();
      linter.verify(payload);
    }),
  );
  deferred.resolve();
}
