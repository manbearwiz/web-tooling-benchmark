// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { compile } from "coffeescript";
import fs from "fs";

const input = fs.readFileSync(
  "third_party/coffeescript-lexer-2.0.1.coffee",
  "utf8",
);

export const name = "coffeescript";
export function fn() {
  return compile(input);
}
