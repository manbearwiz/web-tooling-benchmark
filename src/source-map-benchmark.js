// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { SourceMapConsumer, SourceMapGenerator, SourceNode } from "source-map";
import fs from "fs";

const payloads = [
  "preact.js.map",
  "source-map.min.js.map",
  "underscore.min.js.map",
].map((name) => fs.readFileSync(`third_party/${name}`, "utf8"));

export const name = "source-map";
export function fn() {
  payloads.forEach((payload) => {
    // Parse the source map first...
    const smc = new SourceMapConsumer(payload);
    // ...then serialize the parsed source map to a String.
    const smg = SourceMapGenerator.fromSourceMap(smc);

    // Create a SourceNode from the generated code and a SourceMapConsumer.
    const fswsm = SourceNode.fromStringWithSourceMap(payload, smc);

    return [smg.toString(), fswsm.toString()];
  });
}
