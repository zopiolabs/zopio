/**
 * SPDX-License-Identifier: MIT
 */

// This script handles Husky installation, skipping it in CI environments
// It's used in the prepare script in package.json

import { execSync } from 'node:child_process';
import fs from 'node:fs';

// Check if we're in a CI environment
const isCI = process.env.CI === 'true';

if (isCI) {
  // Skip Husky installation in CI environments
  process.exit(0);
}

try {
  // Check if .git directory exists (we're in a git repo)
  if (fs.existsSync('.git')) {
    // Install Husky
    execSync('npx husky install', { stdio: 'inherit' });
  }
} catch (_) {
  // Silently exit with success to avoid breaking CI
  process.exit(0);
}
