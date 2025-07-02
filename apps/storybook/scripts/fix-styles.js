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

/**
 * This script installs the necessary dependencies for Storybook to work with Tailwind CSS v4
 * and fixes configuration issues with CSS processing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}Starting Storybook style fix script...${colors.reset}`);

// Install required dependencies
console.log(`${colors.yellow}Installing required dependencies...${colors.reset}`);
try {
  execSync('pnpm add -D tailwindcss-animate autoprefixer postcss-import postcss-nesting style-loader css-loader', { stdio: 'inherit' });
  console.log(`${colors.green}Dependencies installed successfully!${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Failed to install dependencies: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Create necessary directories if they don't exist
const stylesDir = path.join(__dirname, '..', 'styles');
if (!fs.existsSync(stylesDir)) {
  console.log(`${colors.yellow}Creating styles directory...${colors.reset}`);
  fs.mkdirSync(stylesDir, { recursive: true });
}

// Create or update PostCSS config
console.log(`${colors.yellow}Creating PostCSS configuration...${colors.reset}`);
const postcssConfig = `/** @type {import('postcss').Config} */
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nesting': {},
    'tailwindcss': {},
    'autoprefixer': {},
  },
};
`;

fs.writeFileSync(path.join(__dirname, '..', 'postcss.config.js'), postcssConfig);

// Update storybook.css file
console.log(`${colors.yellow}Updating Storybook CSS file...${colors.reset}`);
const storybookCss = `/* Storybook specific styles */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

/* Ensure Storybook container properly applies theme */
#storybook-root {
  background-color: var(--background);
  color: var(--foreground);
  padding: 1rem;
}

/* Fix for Storybook docs page */
.docs-story {
  background-color: var(--background);
  color: var(--foreground);
}

/* Ensure proper font loading */
body {
  font-family: var(--font-geist-sans);
}

code, pre {
  font-family: var(--font-geist-mono);
}

/* Force theme variables to be applied */
.sb-show-main {
  background-color: var(--background) !important;
}

/* Add specific component styles for Storybook */
.shadcn-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  font-weight: 500;
  transition: all 0.2s;
}

/* Ensure all components get proper styling */
[data-slot="button"] {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
`;

fs.writeFileSync(path.join(stylesDir, 'storybook.css'), storybookCss);

// Create or update .storybook/main.js to fix webpack config
console.log(`${colors.yellow}Updating Storybook webpack configuration...${colors.reset}`);
const storybookMainPath = path.join(__dirname, '..', '.storybook', 'main.js');
let storybookMainContent;

if (fs.existsSync(storybookMainPath)) {
  storybookMainContent = fs.readFileSync(storybookMainPath, 'utf8');
  
  // Check if webpack config already exists
  if (!storybookMainContent.includes('webpackFinal')) {
    // Add webpack configuration
    storybookMainContent = storybookMainContent.replace(
      /export default/,
      `/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = `
    );
    
    storybookMainContent = storybookMainContent.replace(
      /};$/,
      `};

// Modify webpack config to properly handle CSS
config.webpackFinal = async (config) => {
  // Find the existing CSS rule
  const cssRule = config.module.rules.find(
    (rule) => rule.test && rule.test.toString().includes('css')
  );

  if (cssRule) {
    // Ensure we're using the right loaders for CSS
    cssRule.use = [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          implementation: require('postcss'),
        },
      },
    ];
  }

  return config;
};

export default config;`
    );
  }
} else {
  // Create a new main.js file if it doesn't exist
  storybookMainContent = `/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  // Modify webpack config to properly handle CSS
  webpackFinal: async (config) => {
    // Find the existing CSS rule
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes('css')
    );

    if (cssRule) {
      // Ensure we're using the right loaders for CSS
      cssRule.use = [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            implementation: require('postcss'),
          },
        },
      ];
    }

    return config;
  },
};

export default config;`;
}

fs.writeFileSync(storybookMainPath, storybookMainContent);

console.log(`${colors.green}Storybook style fix completed successfully!${colors.reset}`);
console.log(`${colors.blue}You can now run 'pnpm dev' to start Storybook with proper styling.${colors.reset}`);
