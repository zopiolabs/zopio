#!/usr/bin/env node

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
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const ROOT_DIR = new URL('..', import.meta.url).pathname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

async function buildCLI() {
  try {
    process.stdout.write('🔍 Building Zopio CLI...\n');

    await build({
      entryPoints: [path.join(ROOT_DIR, 'zopio.js')],
      bundle: true,
      platform: 'node',
      target: 'node16',
      outfile: path.join(DIST_DIR, 'zopio.js'),
      format: 'esm',
      banner: {
        js: '#!/usr/bin/env node',
      },
      minify: false,
      external: ['commander', 'chalk', 'inquirer', 'ora'],
    });

    // Make the output file executable
    fs.chmodSync(path.join(DIST_DIR, 'zopio.js'), '755');

    // Copy package.json to dist
    const pkg = JSON.parse(
      fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8')
    );

    // Update package.json for distribution
    pkg.bin = {
      zopio: './zopio.js',
    };

    fs.writeFileSync(
      path.join(DIST_DIR, 'package.json'),
      JSON.stringify(pkg, null, 2)
    );

    process.stdout.write('✅ Build completed successfully!\n');
  } catch (error) {
    process.stdout.write(`❌ Build failed: ${error.message}\n`);
    process.exit(1);
  }
}

buildCLI();
