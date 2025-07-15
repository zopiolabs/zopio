/**
 * SPDX-License-Identifier: MIT
 */

// scripts/check-naming.js

const fs = require('node:fs');
const path = require('node:path');

// Define project root as the parent directory of the scripts folder
const PROJECT_ROOT = path.resolve(__dirname, '..');

// -----------------
// Rule Parsers
// -----------------
function parseRules() {
  const content = fs.readFileSync(
    path.join(PROJECT_ROOT, '.windsurfrules'),
    'utf-8'
  );
  const result = {
    ignoreDirectories: [],
  };
  const lines = content.split('\n');

  let inIgnoreDirectoriesBlock = false;

  for (const line of lines) {
    if (line.includes('component_files')) {
      result.component = line.split('=')[1].trim().replace(/"/g, '');
    }
    if (line.includes('utility_files')) {
      result.utility = line.split('=')[1].trim().replace(/"/g, '');
    }
    if (line.includes('directory_names')) {
      result.directory = line.split('=')[1].trim().replace(/"/g, '');
    }

    // Handle ignore_directory_names block
    if (line.includes('ignore_directory_names = [')) {
      inIgnoreDirectoriesBlock = true;
      continue;
    }

    if (inIgnoreDirectoriesBlock) {
      if (line.includes(']')) {
        inIgnoreDirectoriesBlock = false;
        continue;
      }

      // Extract pattern from the line, removing quotes, commas and comments
      const pattern = line
        .trim()
        .replace(/^"/, '') // Remove leading quote
        .replace(/",?$/, '') // Remove trailing quote and optional comma
        .replace(/^'/, '') // Remove leading single quote
        .replace(/',?$/, '') // Remove trailing single quote and optional comma
        .replace(/#.*$/, '') // Remove comments
        .trim();

      if (pattern) {
        result.ignoreDirectories.push(pattern);
      }
    }
  }

  return result;
}

function getBiomeIgnores() {
  const biomePath = path.join('biome.json');
  if (!fs.existsSync(biomePath)) {
    return [];
  }

  try {
    const json = JSON.parse(fs.readFileSync(biomePath, 'utf-8'));
    return json.files?.ignore || [];
  } catch (_err) {
    return [];
  }
}

// -----------------
// Regex Utilities
// -----------------
const PASCAL_CASE_REGEX = /^[A-Z][a-zA-Z0-9]*$/;
const KEBAB_CASE_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ROUTE_GROUP_REGEX = /^\([^)]+\)$/;
const DYNAMIC_SEGMENT_REGEX = /^\[[^\]]+\]$/;

function isValidName(name, format) {
  switch (format) {
    case 'PascalCase':
      return PASCAL_CASE_REGEX.test(name);
    case 'kebab-case':
      return KEBAB_CASE_REGEX.test(name);
    default:
      return true;
  }
}

function convertGlobToRegex(patternStr) {
  let pattern = patternStr.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  pattern = pattern.replace(/\*\*\//g, '.*').replace(/\*/g, '[^\\/]*');
  return new RegExp(pattern);
}

// -----------------
// Ignore Logic
// -----------------
const STATIC_EXCLUDES = [
  'node_modules',
  '.turbo',
  '.next',
  '.git',
  'dist',
  'build',
  '.cache',
  '.bin',
];

const BIOME_IGNORES = getBiomeIgnores();

function shouldIgnore(filePath, ignorePatterns) {
  const baseName = path.basename(filePath);

  // Check static excludes
  if (STATIC_EXCLUDES.includes(baseName) || baseName.startsWith('.')) {
    return true;
  }

  // Check biome ignores
  if (
    BIOME_IGNORES.some((pattern) => {
      const regex = convertGlobToRegex(pattern);
      return regex.test(filePath);
    })
  ) {
    return true;
  }

  // Check ignore_directory_names patterns
  if (ignorePatterns && ignorePatterns.length > 0) {
    for (const pattern of ignorePatterns) {
      // Handle __tests__ directories
      if (pattern === '__tests__' && baseName === '__tests__') {
        return true;
      }

      // Handle Next.js route groups (groupName)
      if (pattern === '(*)' && ROUTE_GROUP_REGEX.test(baseName)) {
        return true;
      }

      // Handle Next.js dynamic segments [param]
      if (pattern === '[*]' && DYNAMIC_SEGMENT_REGEX.test(baseName)) {
        return true;
      }

      // Handle static output directory
      if (pattern === 'out' && baseName === 'out') {
        return true;
      }

      // Direct name match
      if (baseName === pattern) {
        return true;
      }
    }
  }

  return false;
}

// -----------------
// Main Check Logic
// -----------------
function findFiles(dir, pattern, ignorePatterns) {
  const results = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (shouldIgnore(fullPath, ignorePatterns)) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && fullPath.match(pattern)) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results;
}

function checkFiles(globPattern, format, _label, ignorePatterns) {
  const regexPattern = convertGlobToRegex(globPattern);
  const files = findFiles('.', regexPattern, ignorePatterns);
  let hasError = false;

  for (const file of files) {
    const base = path.basename(file, path.extname(file));
    if (!isValidName(base, format)) {
      hasError = true;
    }
  }

  return hasError;
}

function checkDirectories(root, format, ignorePatterns) {
  let hasError = false;

  function recurse(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (!entry.isDirectory()) {
        continue;
      }
      if (shouldIgnore(fullPath, ignorePatterns)) {
        continue;
      }

      if (!isValidName(entry.name, format)) {
        hasError = true;
      }

      recurse(fullPath);
    }
  }

  recurse(root);
  return hasError;
}

// -----------------
// Run Checks
// -----------------
const rules = parseRules();
const anyError =
  checkFiles(
    '**/components/**/*.tsx',
    rules.component,
    'Component',
    rules.ignoreDirectories
  ) |
  checkFiles(
    '**/utils/**/*.ts',
    rules.utility,
    'Utility',
    rules.ignoreDirectories
  ) |
  checkDirectories('.', rules.directory, rules.ignoreDirectories);

if (anyError) {
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', '✓ Check naming completed successfully');
}
