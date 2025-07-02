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
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './stories/**/*.{js,ts,jsx,tsx}',
    '../../packages/design-system/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class'],
  plugins: [
    require('@tailwindcss/typography'),
  ],
  presets: [
    require('../../packages/design-system/theme/tailwind.preset.js')
  ]
};
