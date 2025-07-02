/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This Zopio marketplace plugin is licensed under the MIT License.
 * See marketplace/LICENSE file for full license details.
 */
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@repo/design-system',
    '@repo/ui-components',
    '@repo/typescript-config',
  ],
  treeshake: true,
  minify: process.env.NODE_ENV === 'production',
  outDir: 'dist',
});
