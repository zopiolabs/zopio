/**
 * SPDX-License-Identifier: MIT
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('fast-glob');

// List of folder names to ignore at any depth
const IGNORED_NAMES = [
  'node_modules',
  '.turbo',
  '.next',
  '.git',
  'dist',
  'build',
  '.cache',
  '.bin',
];

// Convert each folder name to glob patterns that match at any depth
const IGNORED_PATTERNS = IGNORED_NAMES.flatMap((name) => [
  `**/${name}/**`, // Ignore all contents inside the folder
  `**/${name}`, // Ignore the folder itself
]);

// Run a shell command and print output with a label
const run = (label, command) => {
  console.info(`\n🔍 Running: ${label}\n`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.info(`✅ ${label} passed\n`);
  } catch (err) {
    console.error(`❌ ${label} failed\n`);
    process.exit(1);
  }
};

// Get all target files excluding ignored patterns
async function getTargetFiles() {
  const extensions = ['ts', 'tsx', 'js', 'jsx'];
  const files = await glob(`**/*.{${extensions.join(',')}}`, {
    ignore: IGNORED_PATTERNS,
    onlyFiles: true,
  });
  return files;
}

// Main function to execute formatting and linting
(async () => {
  const files = await getTargetFiles();
  if (files.length === 0) {
    console.log('⚠️  No matching files found to format/lint.');
    process.exit(0);
  }

  const filesArg = files.map((f) => `"${f}"`).join(' ');

  run('🧹 Ultracite Format', `npx ultracite format ${filesArg}`);
  run('🔵 Ultracite Lint', `npx ultracite lint ${filesArg}`);
  run('🧠 TypeScript Typecheck', `pnpm tsc --noEmit --project .`);
})();
