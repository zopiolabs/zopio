#!/usr/bin/env node
"use strict";
/**
 * SPDX-License-Identifier: MIT
 */

const { execSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

const apps = ["app", "web", "admin", "hub", "landing"];

for (const app of apps) {
  const appPath = path.join(__dirname, "..", "apps", app);
  const pkgJsonPath = path.join(appPath, "package.json");

  if (fs.existsSync(pkgJsonPath)) {
    try {
      console.log(`🔗 Linking ${app} with Vercel...`);
      execSync("vercel link --yes", {
        cwd: appPath,
        stdio: "inherit",
      });
    } catch (err) {
      console.warn(`⚠️ Vercel link failed for ${app}:`, err.message);
    }
  }
}
