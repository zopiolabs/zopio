/**
 * SPDX-License-Identifier: MIT
 */

import { execSync } from "node:child_process";

if (!process.env.BASEHUB_TOKEN) {
  process.stderr.write(
    "BASEHUB_TOKEN is not set; skipping `basehub build` and using checked-in generated types.\n"
  );
  process.exit(0);
}

execSync("basehub build", { stdio: "inherit" });
