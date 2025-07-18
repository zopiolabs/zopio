#!/usr/bin/env node
/**
 * SPDX-License-Identifier: MIT
 */

const { execSync } = require("child_process");

try {
  console.log("🔄 Fetching and pruning remote branches...");
  execSync("git fetch -p", { stdio: "inherit" });

  console.log("🔍 Checking for gone branches...");
  const output = execSync("git branch -vv", { encoding: "utf8" });

  const goneBranches = output
    .split("\n")
    .filter((line) => line.includes(": gone]"))
    .map((line) => line.trim().split(" ")[0]);

  if (goneBranches.length === 0) {
    console.log("✅ No gone branches found.");
    process.exit(0);
  }

  goneBranches.forEach((branch) => {
    console.log(`🗑️ Deleting local branch: ${branch}`);
    execSync(`git branch -D ${branch}`, { stdio: "inherit" });
  });

  console.log("✅ Cleanup complete.");
} catch (error) {
  console.error("❌ Error during cleanup:", error.message);
  process.exit(1);
}
