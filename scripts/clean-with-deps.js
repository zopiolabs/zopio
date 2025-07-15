#!/usr/bin/env node
/**
 * SPDX-License-Identifier: MIT
 *
 * Automatically installs required devDependencies and runs the given script.
 * Usage:
 *   node scripts/clean-with-deps.js clean-cache
 *   node scripts/clean-with-deps.js clean-hard
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Map required internal scripts to their dependencies
const SCRIPT_DEP_MAP = {
  'clean-cache': {
    file: 'scripts/clean-cache.js',
    deps: ['fast-glob'],
  },
  'clean-hard': {
    file: 'scripts/clean-hard.js',
    deps: ['fast-glob'],
  },
};

function hasPackage(pkgName) {
  try {
    require.resolve(pkgName);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const scriptArg = process.argv[2];

  if (!scriptArg || !SCRIPT_DEP_MAP[scriptArg]) {
    console.error(`❌ Usage: node scripts/clean-with-deps.js <script-name>`);
    console.error(`   Available: ${Object.keys(SCRIPT_DEP_MAP).join(', ')}`);
    process.exit(1);
  }

  const { file, deps } = SCRIPT_DEP_MAP[scriptArg];
  const missingDeps = deps.filter((dep) => !hasPackage(dep));

  if (missingDeps.length > 0) {
    console.log(`📦 Installing missing devDependencies: ${missingDeps.join(', ')}`);
    try {
      execSync(`pnpm add -w -D ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`❌ Failed to install dependencies.`, err);
      process.exit(1);
    }
  }

  const absPath = path.resolve(file);
  if (!fs.existsSync(absPath)) {
    console.error(`❌ Script file not found: ${absPath}`);
    process.exit(1);
  }

  console.log(`🚀 Running: ${file}`);
  require(absPath);
}

main();
