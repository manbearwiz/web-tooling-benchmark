// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import UglifyJS from "../build/uglify-js-bundled";
import fs from "fs";

const payloads = [
  {
    name: "lodash.core.js",
    options: { compress: { passes: 1 } },
  },
].map(({ name, options }) => ({
  payload: fs.readFileSync(`third_party/${name}`, "utf8"),
  options,
}));

export const name = "uglify-js";
export function fn() {
  return payloads.map(({ payload, options }) =>
    UglifyJS.minify(payload, options),
  );
}
