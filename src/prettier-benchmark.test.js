// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { fn } from "./prettier-benchmark";

it("prettier-benchmark runs to completion", () =>
  void fn({ resolve: () => {} }));
