#!/usr/bin/env node
"use strict";
/**
 * SPDX-License-Identifier: MIT
 *
 * Removes cache and build folders in a workspace:
 * - dist, build, out
 * - .next, .turbo, .vercel, .cache
 */

const fs = require("fs");
const path = require("path");
const glob = require("fast-glob");

const TARGETS = [
  "**/dist",
  "**/build",
  "**/out",
  "**/.next",
  "**/.turbo",
  "**/.vercel",
  "**/.cache",
];

(async () => {
  const root = process.cwd();
  const folders = await glob(TARGETS, {
    onlyDirectories: true,
    ignore: ["**/.git/**"],
    cwd: root,
    absolute: true,
  });

  if (folders.length === 0) {
    console.log("✅ No cache or build folders found.");
    return;
  }

  console.log(`🧹 Removing ${folders.length} cache/build folders...\n`);

  for (const dir of folders) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✔ Removed: ${path.relative(root, dir)}`);
    } catch (err) {
      console.error(`❌ Failed to remove: ${dir}`, err);
    }
  }

  console.log("\n✅ Cache cleanup complete.");
})();
