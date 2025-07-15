/**
 * SPDX-License-Identifier: MIT
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './stories/**/*.{js,ts,jsx,tsx}',
    '../../packages/design-system/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class'],
  plugins: [require('@tailwindcss/typography')],
  presets: [require('../../packages/design-system/theme/tailwind.preset.js')],
};
