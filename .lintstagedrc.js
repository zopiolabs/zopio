/**
 * SPDX-License-Identifier: MIT
 */

export default {
  // For JavaScript/TypeScript/JSON files
  "*.{js,jsx,ts,tsx,json}": (files) => {
    return [
      // Format files - unfortunately ultracite doesn't support specific files
      // but we'll only run this when there are staged JS/TS/JSON files
      "pnpm format",

      // Re-stage the formatted files that were originally staged
      // This ensures we don't stage unrelated changes
      `git add ${files.map((f) => `"${f}"`).join(" ")}`,

      // Run ESLint on just the staged files if your lint command supports it
      // Otherwise fallback to the general lint command
      "pnpm lint",
    ];
  },
};
