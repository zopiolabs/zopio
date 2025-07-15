/**
 * SPDX-License-Identifier: MIT
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-import': {},
    'postcss-nesting': {},
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;
