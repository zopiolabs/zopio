#!/usr/bin/env node
/**
 * SPDX-License-Identifier: MIT
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import chalk from 'chalk';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Ajv
const ajv = new Ajv({ allErrors: true });

// Load schemas
const moduleSchemaPath = path.resolve(
  __dirname,
  '../schemas/module.schema.json'
);
const appSchemaPath = path.resolve(__dirname, '../schemas/app.schema.json');
const pluginSchemaPath = path.resolve(
  __dirname,
  '../schemas/plugin.schema.json'
);
const integrationSchemaPath = path.resolve(
  __dirname,
  '../schemas/integration.schema.json'
);
const toolSchemaPath = path.resolve(__dirname, '../schemas/tool.schema.json');

// Load and parse schemas
const moduleSchema = JSON.parse(fs.readFileSync(moduleSchemaPath, 'utf8'));
const appSchema = JSON.parse(fs.readFileSync(appSchemaPath, 'utf8'));
const pluginSchema = JSON.parse(fs.readFileSync(pluginSchemaPath, 'utf8'));
const integrationSchema = JSON.parse(
  fs.readFileSync(integrationSchemaPath, 'utf8')
);
const toolSchema = JSON.parse(fs.readFileSync(toolSchemaPath, 'utf8'));

// Add schemas with IDs to resolve references
ajv.addSchema(moduleSchema, 'module.schema.json');

// Compile validators
const validateModule = ajv.compile(moduleSchema);
const validateApp = ajv.compile(appSchema);
const validatePlugin = ajv.compile(pluginSchema);
const validateIntegration = ajv.compile(integrationSchema);
const validateTool = ajv.compile(toolSchema);

// Registry module types
const moduleTypes = ['apps', 'plugins', 'integrations', 'tools'];

// Registry root directory
const registryDir = path.resolve(__dirname, '..');

// Results tracking
const results = {
  total: 0,
  valid: 0,
  invalid: 0,
  errors: [],
};

// Create a logger to avoid direct console usage
const logger = {
  info: (message) => process.stdout.write(`${message}\n`),
  success: (message) => process.stdout.write(chalk.green(`${message}\n`)),
  error: (message) => process.stderr.write(chalk.red(`${message}\n`)),
  warning: (message) => process.stderr.write(chalk.yellow(`${message}\n`)),
  bold: (message) => process.stdout.write(chalk.bold(`${message}\n`)),
};

/**
 * Get the appropriate validator for a module type
 * @param {string} moduleType Type of module
 * @returns {Function} Validator function
 */
function getValidatorForType(moduleType) {
  switch (moduleType) {
    case 'apps':
      return validateApp;
    case 'plugins':
      return validatePlugin;
    case 'integrations':
      return validateIntegration;
    case 'tools':
      return validateTool;
    default:
      return validateModule;
  }
}

/**
 * Display validation errors
 * @param {Array} errors List of validation errors
 * @param {string} errorType Type of errors
 */
function displayValidationErrors(errors, errorType) {
  if (errors.length > 0) {
    logger.warning(`  ${errorType} schema errors:`);
    for (const err of errors) {
      logger.info(`    - ${err.instancePath} ${err.message}`);
    }
  }
}

/**
 * Validate a module manifest file
 * @param {string} filePath Path to the manifest file
 * @param {string} moduleType Type of module
 */
function validateManifest(filePath, moduleType) {
  try {
    const manifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    results.total++;

    // First validate against the common module schema
    const isValidModule = validateModule(manifest);

    // Then validate against the specific module type schema
    const validator = getValidatorForType(moduleType);
    const isValidType = validator(manifest);

    if (isValidModule && isValidType) {
      results.valid++;
      logger.success(`✓ Valid: ${filePath}`);
    } else {
      results.invalid++;
      const moduleErrors = validateModule.errors || [];
      const typeErrors = validator.errors || [];

      logger.error(`✗ Invalid: ${filePath}`);
      displayValidationErrors(moduleErrors, 'Module');
      displayValidationErrors(typeErrors, moduleType);

      results.errors.push({
        file: filePath,
        moduleErrors,
        typeErrors,
      });
    }
  } catch (err) {
    results.total++;
    results.invalid++;
    logger.error(`✗ Error: ${filePath}`);
    logger.info(`    - ${err.message}`);

    results.errors.push({
      file: filePath,
      error: err.message,
    });
  }
}

/**
 * Scan a directory for module manifests
 * @param {string} moduleType Type of module
 */
function scanModuleType(moduleType) {
  const moduleTypeDir = path.join(registryDir, moduleType);

  if (!fs.existsSync(moduleTypeDir)) {
    logger.warning(`Warning: Directory not found: ${moduleTypeDir}`);
    return;
  }

  const moduleDirs = fs
    .readdirSync(moduleTypeDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  logger.info(chalk.blue(`\nScanning ${moduleType}...`));

  for (const moduleDir of moduleDirs) {
    const manifestPath = path.join(
      moduleTypeDir,
      moduleDir,
      'zopio.module.json'
    );

    if (fs.existsSync(manifestPath)) {
      validateManifest(manifestPath, moduleType);
    } else {
      logger.warning(
        `Warning: No manifest found for ${moduleType}/${moduleDir}`
      );
    }
  }
}

// Main execution
logger.bold('Validating Zopio module manifests...\n');

// Scan each module type
for (const moduleType of moduleTypes) {
  scanModuleType(moduleType);
}

// Print summary
logger.info(`\n${chalk.bold('Summary:')}`);
logger.info(`Total modules: ${results.total}`);
logger.success(`Valid modules: ${results.valid}`);

if (results.invalid > 0) {
  logger.error(`Invalid modules: ${results.invalid}`);
  process.exit(1);
} else {
  logger.success('\nAll modules are valid!');
  process.exit(0);
}
