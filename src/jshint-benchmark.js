// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import fs from "fs";
import { JSHINT } from "jshint";

const inputs = [
  "lodash.core.js",
  "preact.js",
  "underscore.js",
].map((name) => fs.readFileSync(`third_party/${name}`, "utf8"));

export const name = "jshint";
export function fn() {
  return inputs.forEach((input) => JSHINT(input));
}
