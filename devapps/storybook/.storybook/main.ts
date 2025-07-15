/**
 * SPDX-License-Identifier: MIT
 */

import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/nextjs';

const require = createRequire(import.meta.url);

// Define regex at the top level scope to avoid performance issues
const cssRegex = /\.css$/;
const cssIncludeRegex = /.*\.css$/;

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
const getAbsolutePath = (value: string) =>
  dirname(require.resolve(join(value, 'package.json')));

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {
      strictMode: true,
    },
  },

  staticDirs: ['../public', '../styles'],

  core: {
    disableTelemetry: true,
  },

  webpackFinal: async (config) => {
    if (!config.module) {
      config.module = { rules: [] };
    }

    if (!config.module.rules) {
      config.module.rules = [];
    }

    // Remove existing CSS rules
    config.module.rules = config.module.rules.filter((rule) => {
      if (!rule || typeof rule !== 'object') {
        return true;
      }
      const ruleObj = rule as { test?: RegExp | string };
      return !(
        ruleObj.test instanceof RegExp &&
        ruleObj.test.toString().includes('css')
      );
    });

    // Add new CSS rule with proper configuration for Tailwind CSS v4
    config.module.rules.push({
      test: cssRegex,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                'postcss-import',
                '@tailwindcss/postcss',
                'autoprefixer',
                'postcss-nesting',
              ],
            },
          },
        },
      ],
      include: [cssIncludeRegex],
    });

    return config;
  },
};

export default config;
