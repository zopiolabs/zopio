/**
 * SPDX-License-Identifier: MIT
 */

export default {
  // For JavaScript/TypeScript files
  '*.{js,jsx,ts,tsx}': (files) => {
    return [
      // Format files - unfortunately ultracite doesn't support specific files
      // but we'll only run this when there are staged JS/TS files
      'pnpm format',

      // Re-stage the formatted files that were originally staged
      // This ensures we don't stage unrelated changes
      `git add ${files.map((f) => `"${f}"`).join(' ')}`,

      // Run ESLint on just the staged files if your lint command supports it
      // Otherwise fallback to the general lint command
      'pnpm lint',
    ];
  },

  // For JSON files
  '*.json': (files) => {
    // Logging removed to comply with linting rules

    return [
      // Format files - unfortunately ultracite doesn't support specific files
      // but we'll only run this when there are staged JSON files
      'pnpm format',

      // Re-stage the formatted files that were originally staged
      `git add ${files.map((f) => `"${f}"`).join(' ')}`,
    ];
  },
};
