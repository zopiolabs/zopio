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
 * Script to convert CommonJS require statements to ES module imports
 * in the CLI command files.
 */

const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Logger function to replace console usage
function logger(type, message) {
  let prefix = '';

  if (type === 'error') {
    prefix = '❌';
  } else if (type === 'success') {
    prefix = '✅';
  } else if (type === 'info') {
    prefix = '🔍';
  } else if (type === 'done') {
    prefix = '✨';
  }

  process.stdout.write(`${prefix} ${message}\n`);
}

const commandsDir = path.join(__dirname, '..', 'src', 'commands');
const mainFile = path.join(__dirname, '..', 'src', 'zopio.ts');

async function updateFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');

    // Replace CommonJS require with ES module import
    const updatedContent = content.replace(
      /\/\/ Use CommonJS require for commander to avoid TypeScript issues\n\/\/ @ts-ignore\nconst { Command } = require\('commander'\);/g,
      "// Use ES module import for commander\nimport { Command } from 'commander';"
    );

    if (content !== updatedContent) {
      await fs.writeFile(filePath, updatedContent, 'utf8');
      logger('success', `Updated: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }

    return false;
  } catch (error) {
    logger('error', `Error updating ${filePath}: ${error}`);
    return false;
  }
}

async function updateMainFile() {
  try {
    const content = await readFile(mainFile, 'utf8');

    // Replace CommonJS require with ES module import in main file
    const updatedContent = content.replace(
      /\/\/ Use a CommonJS require for commander to avoid TypeScript issues\n\/\/ @ts-ignore\nconst { Command } = require\("commander"\);/g,
      "// Use ES module import for commander\nimport { Command } from 'commander';"
    );

    if (content !== updatedContent) {
      await writeFile(mainFile, updatedContent, 'utf8');
      logger(
        'success',
        `Updated main file: ${path.relative(process.cwd(), mainFile)}`
      );
      return true;
    }

    return false;
  } catch (error) {
    logger('error', `Error updating main file: ${error}`);
    return false;
  }
}

async function main() {
  logger('info', 'Converting CommonJS requires to ES module imports...');

  // Update the main zopio.ts file
  await updateMainFile();

  // Get all command files
  const files = fs
    .readdirSync(commandsDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => path.join(commandsDir, file));

  let updatedCount = 0;

  // Update each command file
  for (const file of files) {
    const updated = await updateFile(file);
    if (updated) {
      updatedCount++;
    }
  }

  logger('done', `Done! Updated ${updatedCount} command files.`);
}

main().catch((error) => {
  logger('error', error);
});
