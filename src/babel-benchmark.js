// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { transformFromAst } from "@babel/standalone";
import { parse } from "@babel/parser";
import fs from "fs";

const payloads = [
  {
    name: "vue.runtime.esm-nobuble.js",
    options: { presets: ["es2015"], sourceType: "module" },
  },
].map(({ name, options }) => {
  const code = fs.readFileSync(`third_party/${name}`, "utf8");
  const ast = parse(code, options);
  return { ast, code, options };
});

export const name = "babel";
export function fn() {
  return payloads.map(({ ast, code, options }) =>
    transformFromAst(ast, code, options),
  );
}
