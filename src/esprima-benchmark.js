// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { tokenize, parse } from "esprima";
import fs from "fs";

const payloads = [
  "backbone-1.1.0.js",
  "jquery-3.2.1.js",
  "mootools-core-1.6.0.js",
  "underscore-1.8.3.js",
].map((name) => fs.readFileSync(`third_party/${name}`, "utf8"));

export const name = "esprima";
export function fn() {
  return payloads.map((payload) => {
    let count = 0;
    count += tokenize(payload, { loc: true, range: true }).length;
    count += parse(payload, { loc: true, range: true }).body.length;
    return count;
  });
}
