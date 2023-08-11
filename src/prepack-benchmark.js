// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import fs from "fs";
import { prepackSources } from "prepack";

const sourceFiles = [
  "third_party/preact.js",
  "third_party/redux.min.js",
].map((filePath) => ({
  filePath,
  fileContents: fs.readFileSync(filePath, "utf8"),
}));

export const name = "prepack";
export function fn() {
  return prepackSources(sourceFiles);
}
