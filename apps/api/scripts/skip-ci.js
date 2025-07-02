/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
const { execSync } = require('node:child_process');

const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();

if (commitMessage.includes('[skip ci]')) {
  process.stdout.write('Skipping build due to [skip ci] in commit message.\n');
  process.exit(0); // this causes Vercel to skip the build
}

process.exit(1); // continue with build
