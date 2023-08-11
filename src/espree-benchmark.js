// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { tokenize, parse } from "espree";
import fs from "fs";

const payloads = [
  "backbone.js",
  "jquery.js",
  "mootools-core.js",
  "underscore.js",
].map((name) => fs.readFileSync(`third_party/${name}`, "utf8"));

export const name = "espree";
export function fn() {
  return payloads.map((payload) => {
    let count = 0;
    count += tokenize(payload, { loc: true, range: true }).length;
    count += parse(payload, { loc: true, range: true }).body.length;
    return count;
  });
}
