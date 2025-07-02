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
import { platform } from 'node:os';
import { defineConfig } from 'tsup';

// Only use chmod on Unix-like systems
const isWindows = platform() === 'win32';
const onSuccessCommand = isWindows ? undefined : 'chmod +x dist/zopio.js';

export default defineConfig({
  entry: ['src/zopio.ts'],
  format: ['esm'],
  target: 'node16',
  clean: true,
  dts: false, // Disable declaration file generation
  sourcemap: true,
  splitting: false,
  minify: false,
  bundle: true,
  shims: true,
  external: ['commander', 'chalk', 'inquirer', 'ora'],
  banner: {
    js: '#!/usr/bin/env node',
  },
  outDir: 'dist',
  onSuccess: onSuccessCommand,
});
