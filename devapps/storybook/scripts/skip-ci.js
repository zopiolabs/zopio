/**
 * SPDX-License-Identifier: MIT
 */

const { execSync } = require('node:child_process');

const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();

if (commitMessage.includes('[skip ci]')) {
  process.stdout.write('Skipping build due to [skip ci] in commit message.\n');
  process.exit(0); // this causes Vercel to skip the build
}

process.exit(1); // continue with build
