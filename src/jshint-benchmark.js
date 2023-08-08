// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import fs from "fs";
import { JSHINT } from "jshint";

const inputs = [
  "lodash.core-4.17.4.js",
  "preact-8.2.5.js",
  "underscore-1.8.3.js",
].map((name) => fs.readFileSync(`third_party/${name}`, "utf8"));

export const name = "jshint";
export function fn() {
  return inputs.forEach((input) => JSHINT(input));
}
