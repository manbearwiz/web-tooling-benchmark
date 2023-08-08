// Copyright 2018 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import fs from "fs";
import postcss from "postcss";
import nested from "postcss-nested";
import autoprefixer from "autoprefixer";

import nestedRules from "./mocks/nested-rules";

const cleaner = postcss([autoprefixer({ add: false })]);
const processor = postcss([autoprefixer, nested]);

const payloads = [
  "bootstrap.css",
  "foundation.css",
  "angular-material.css",
].map((name) => {
  // Clean prefixes.
  const source = fs.readFileSync(`third_party/${name}`, "utf8");
  // Add some nested rules.
  const css = cleaner.process(source).css + nestedRules;

  return {
    payload: css,
    options: {
      from: `third_party/${name}`,
      map: false,
    },
  };
});

export const name = "postcss";
export function fn() {
  return payloads.map(
    ({ payload, options }) => processor.process(payload, options).css,
  );
}
