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
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

// Create a temporary directory for testing
const TEST_DIR = path.join(process.cwd(), 'test-project');

// Create a dedicated test logger that avoids direct console usage
class TestLogger {
  #output;

  constructor() {
    this.#output = process.stdout;
  }

  info(msg) {
    this.#output.write(`${chalk.blue('ℹ')} ${msg}\n`);
  }

  success(msg) {
    this.#output.write(`${chalk.green('✓')} ${msg}\n`);
  }

  error(msg) {
    this.#output.write(`${chalk.red('✗')} ${msg}\n`);
  }

  title(msg) {
    this.#output.write(`${chalk.bold.cyan(`\n${msg}\n`)}\n`);
  }
}

const log = new TestLogger();

async function runCommand(command) {
  try {
    log.info(`Running: ${command}`);
    // Use promisify to make execSync awaitable
    const { promisify } = await import('node:util');
    const exec = promisify(require('node:child_process').exec);
    const { stdout } = await exec(command, { cwd: TEST_DIR });
    return stdout;
  } catch (error) {
    log.error(`Command failed: ${command}`);
    log.error(error.message);
    return null;
  }
}

async function cleanup() {
  log.info('Cleaning up test directory...');
  try {
    // Use fs.promises.access to check if directory exists
    try {
      await fs.promises.access(TEST_DIR);
      // If we get here, the directory exists, so remove it
      await fs.promises.rm(TEST_DIR, { recursive: true, force: true });
    } catch {
      // Directory doesn't exist, nothing to clean up
    }
  } catch (error) {
    log.error(`Failed to clean up: ${error.message}`);
  }
}

// Start tests
async function runTests() {
  log.title('ZOPIO CLI TEST SUITE');

  // Clean up any previous test directory
  await cleanup();

  // Create test directory
  log.info('Creating test directory...');
  fs.mkdirSync(TEST_DIR, { recursive: true });

  // Test init command
  log.title('Testing init command');
  const initOutput = await runCommand('node ../zopio.js init');

  if (initOutput?.includes('Initialized zopio project')) {
    log.success('Init command successful');
  } else {
    log.error('Init command failed');
    await cleanup();
    process.exit(1);
  }

  // Verify package.json was created
  if (fs.existsSync(path.join(TEST_DIR, 'package.json'))) {
    log.success('package.json created');
  } else {
    log.error('package.json not created');
    await cleanup();
    process.exit(1);
  }

  // Test i18n command
  log.title('Testing i18n command');
  const i18nListOutput = await runCommand('node ../zopio.js i18n --list');

  if (i18nListOutput?.includes('Available Locales')) {
    log.success('i18n list command successful');
  } else {
    log.error('i18n list command failed');
  }

  // Test config command
  log.title('Testing config command');
  const configOutput = await runCommand('node ../zopio.js config --init');

  if (configOutput?.includes('Created configuration file')) {
    log.success('config init command successful');
  } else {
    log.error('config init command failed');
  }

  // Test component command
  log.title('Testing component command');
  const componentOutput = await runCommand(
    'node ../zopio.js component TestComponent --i18n'
  );

  if (componentOutput?.includes('Created component')) {
    log.success('component command successful');
  } else {
    log.error('component command failed');
  }

  // Test generate command
  log.title('Testing generate command');
  const generateOutput = await runCommand(
    'node ../zopio.js generate i18n test-namespace'
  );

  if (generateOutput?.includes('Created i18n module')) {
    log.success('generate i18n command successful');
  } else {
    log.error('generate i18n command failed');
  }

  // All tests complete
  log.title('TEST SUMMARY');
  log.success('All tests completed');

  // Clean up
  await cleanup();
}

// Run the tests
runTests().catch(async (error) => {
  log.error(`Test suite failed: ${error.message}`);
  await cleanup();
  process.exit(1);
});
