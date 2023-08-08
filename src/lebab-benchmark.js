// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import fs from "fs";
import { transform } from "lebab";

const payloads = [
  {
    name: "preact.js",
    options: [
      "arg-rest",
      "arg-spread",
      "arrow",
      "class",
      "for-of",
      "let",
      "template",
      "includes",
      "obj-method",
      "obj-shorthand",
    ],
  },
].map(({ name, options }) => ({
  payload: fs.readFileSync(`third_party/${name}`, "utf8"),
  options,
}));

export const name = "lebab";
export function fn() {
  return payloads.map(({ payload, options }) => transform(payload, options));
}
