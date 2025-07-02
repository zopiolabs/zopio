#!/usr/bin/env node

/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This Zopio marketplace plugin is licensed under the MIT License.
 * See marketplace/LICENSE file for full license details.
 */

/**
 * Script to format and lint marketplace code
 */
const { execSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// Paths
const marketplaceDir = path.resolve(__dirname);
const categories = [
  'developer-plugins',
  'business-plugins',
  'fintech-plugins',
  'insurtech-plugins',
  'embedded-apps',
  'integrations',
];

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

process.stdout.write(`${colors.blue}Formatting marketplace code...${colors.reset}\n`);

// Check if biome is installed
try {
  execSync('npx biome --version', { stdio: 'ignore' });
} catch (error) {
  process.stdout.write(`${colors.yellow}Biome not found, installing...${colors.reset}\n`);
  execSync('npm install --save-dev @biomejs/biome', { stdio: 'inherit' });
}

// Format each category
for (const category of categories) {
  const categoryPath = path.join(marketplaceDir, category);
  if (!fs.existsSync(categoryPath)) {
    process.stdout.write(`${colors.yellow}Skipping ${category} (directory not found)${colors.reset}\n`);
    continue;
  }

  process.stdout.write(`${colors.green}Formatting ${category}...${colors.reset}\n`);
  
  try {
    // Format with Biome
    execSync(`npx biome format --write "${categoryPath}/**/*.{js,jsx,ts,tsx}"`, { 
      stdio: 'inherit',
      shell: true 
    });
    
    // Lint with Biome
    execSync(`npx biome lint "${categoryPath}/**/*.{js,jsx,ts,tsx}" --apply`, { 
      stdio: 'inherit',
      shell: true 
    });
    
    process.stdout.write(`${colors.green}✓ ${category} formatted successfully${colors.reset}\n`);
  } catch (error) {
    process.stderr.write(`${colors.red}Error formatting ${category}: ${error.message}${colors.reset}\n`);
  }
}

process.stdout.write(`${colors.blue}Marketplace formatting complete!${colors.reset}\n`);
