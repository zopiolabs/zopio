/**
 * SPDX-License-Identifier: MIT
 */

// scripts/check-registry.js
const fs = require('node:fs');
const path = require('node:path');

/**
 * Helper function to display usage information and parse command line arguments
 * @returns {Object} Parsed command line options
 */
function parseCommandLineArgs() {
  const args = process.argv.slice(2);
  const options = {
    fix: args.includes('--fix'),
    verbose: args.includes('--verbose'),
    help: args.includes('--help'),
    path: null,
  };

  // Check for path argument (format: --path=some/path)
  const pathArg = args.find((arg) => arg.startsWith('--path='));
  if (pathArg) {
    options.path = pathArg.split('=')[1];
  }

  // Display help if requested
  if (options.help) {
    // Using process.stdout.write instead of console.log to avoid lint warnings
    process.stdout.write(`
${colors.cyan('Registry Checker Tool')}

Usage: node scripts/check-registry.js [options]

Options:
  ${colors.yellow('--fix')}        Auto-fix issues when possible
  ${colors.yellow('--verbose')}    Show detailed information
  ${colors.yellow('--path=<dir>')} Check only a specific directory
  ${colors.yellow('--help')}       Show this help message

`);
    process.exit(0);
  }

  return options;
}

// Simple color functions to replace chalk
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bgRed: { white: (text) => `\x1b[41m\x1b[37m${text}\x1b[0m` },
  bgGreen: { black: (text) => `\x1b[42m\x1b[30m${text}\x1b[0m` },
};

// Directories to ignore during registry checks
const IGNORED_DIRS = [
  'node_modules',
  '.turbo',
  '.next',
  '.git',
  'dist',
  'build',
  '.cache',
  '.bin',
];

// Helper function to check if a directory should be ignored (case-insensitive)
function shouldIgnoreDir(dirName) {
  return IGNORED_DIRS.some(
    (dir) => dirName.toLowerCase() === dir.toLowerCase()
  );
}

// Use an absolute path relative to the project root, not the current working directory
const REGISTRY_DIR = path.resolve(__dirname, '../registry');
const PROJECT_ROOT = path.resolve(__dirname, '../');

// Function to read versions from .windsurfrules file
function readWindsurfRules() {
  const rulesPath = path.join(PROJECT_ROOT, '.windsurfrules');
  let reactVersion = '19.1.0'; // Default version if not found
  let typescriptVersion = '5.8.3'; // Default TypeScript version if not found
  let reactTypesVersion = null; // Will default to reactVersion if not found
  let reactDomTypesVersion = null; // Will default to reactVersion if not found

  try {
    if (fs.existsSync(rulesPath)) {
      const content = fs.readFileSync(rulesPath, 'utf8');
      const lines = content.split('\n');

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('react_version')) {
          const parts = line.split('=');
          if (parts.length >= 2) {
            // Extract version and remove quotes and whitespace
            reactVersion = parts[1].trim().replace(/["']/g, '');
          }
        } else if (trimmedLine.startsWith('typescript_version')) {
          const parts = line.split('=');
          if (parts.length >= 2) {
            // Extract version and remove quotes and whitespace
            typescriptVersion = parts[1].trim().replace(/["']/g, '');
          }
        } else if (trimmedLine.startsWith('react_types_version')) {
          const parts = line.split('=');
          if (parts.length >= 2) {
            // Extract version and remove quotes and whitespace
            reactTypesVersion = parts[1].trim().replace(/["']/g, '');
          }
        } else if (trimmedLine.startsWith('react_dom_types_version')) {
          const parts = line.split('=');
          if (parts.length >= 2) {
            // Extract version and remove quotes and whitespace
            reactDomTypesVersion = parts[1].trim().replace(/["']/g, '');
          }
        }
      }
    }
  } catch (_error) {
    // Silent fail, will use default version
  }

  // If specific types versions are not defined, use the React version
  if (reactTypesVersion === null) {
    reactTypesVersion = reactVersion;
  }

  if (reactDomTypesVersion === null) {
    reactDomTypesVersion = reactVersion;
  }

  return {
    react: `^${reactVersion}`, // Add caret for semver compatibility
    typescript: `^${typescriptVersion}`, // Add caret for semver compatibility
    reactTypes: `^${reactTypesVersion}`,
    reactDomTypes: `^${reactDomTypesVersion}`,
  };
}

// Get peer dependencies from coding standards
const REQUIRED_PEERS = ['react', 'react-dom'];
const _REQUIRED_TYPES = ['@types/react', '@types/react-dom'];

// Read versions from .windsurfrules file
const versions = readWindsurfRules();
const REACT_VERSION = versions.react;
const TYPESCRIPT_VERSION = versions.typescript;
const REACT_TYPES_VERSION = versions.reactTypes;
const REACT_DOM_TYPES_VERSION = versions.reactDomTypes;

const REQUIRED_PEER_VERSIONS = {
  react: REACT_VERSION,
  'react-dom': REACT_VERSION,
};
const REQUIRED_TYPE_VERSIONS = {
  '@types/react': REACT_TYPES_VERSION,
  '@types/react-dom': REACT_DOM_TYPES_VERSION,
  typescript: TYPESCRIPT_VERSION,
};
const INTERNAL_PREFIX = '@repo/';
const VALID_MODULE_TYPES = [
  'app',
  'plugin',
  'integration',
  'tool',
  'schema',
  'template',
  'example',
];
const REQUIRED_MODULE_FIELDS = [
  'name',
  'version',
  'description',
  'author',
  'license',
];
const REQUIRED_ZOPIO_CONFIG = ['category', 'icon'];

const warningsSummary = [];
const fixesSummary = [];

function logError(pkgName, message) {
  warningsSummary.push(`${pkgName}: ${message}`);
}

function logFix(pkgName, message) {
  fixesSummary.push(`${pkgName}: ${message}`);
}

function fixPackage(pkgPath, pkg, fix) {
  let modified = false;

  if (pkg.type !== 'module') {
    // Always log the warning first
    logError(pkg.name, `missing "type": "module"`);

    if (fix) {
      pkg.type = 'module';
      logFix(pkg.name, `added "type": "module"`);
      modified = true;
    }
  }

  if (pkg.sideEffects !== false) {
    // Always log the warning first
    logError(pkg.name, `missing or invalid "sideEffects": false`);

    if (fix) {
      pkg.sideEffects = false;
      logFix(pkg.name, `set "sideEffects": false`);
      modified = true;
    }
  }

  // Check package name follows @repo/* convention
  if (!pkg.name.startsWith(INTERNAL_PREFIX)) {
    // Always log the warning first
    logError(pkg.name, 'package name should follow @repo/* convention');

    if (fix) {
      const baseName = pkg.name.startsWith('@')
        ? pkg.name.split('/')[1]
        : pkg.name;
      pkg.name = `${INTERNAL_PREFIX}${baseName}`;
      logFix(pkg.name, 'fixed package name to follow @repo/* convention');
      modified = true;
    }
  }

  // Ensure peerDependencies exists with correct versions
  const peerDeps = pkg.peerDependencies ?? {};

  // Handle required peer dependencies with specific versions
  for (const dep in REQUIRED_PEER_VERSIONS) {
    if (Object.prototype.hasOwnProperty.call(REQUIRED_PEER_VERSIONS, dep)) {
      const version = REQUIRED_PEER_VERSIONS[dep];

      // Remove from dependencies or devDependencies
      if (pkg.dependencies?.[dep]) {
        delete pkg.dependencies[dep];
        logFix(pkg.name, `Moved ${dep} from dependencies to peerDependencies`);
        modified = true;
      }
      if (pkg.devDependencies?.[dep]) {
        delete pkg.devDependencies[dep];
        logFix(
          pkg.name,
          `Moved ${dep} from devDependencies to peerDependencies`
        );
        modified = true;
      }

      // Add to peerDependencies if missing or incorrect
      if (peerDeps[dep] !== version) {
        // Always log the warning first
        logError(
          pkg.name,
          `${dep} version should be ${version} in peerDependencies`
        );

        if (fix) {
          peerDeps[dep] = version;
          logFix(
            pkg.name,
            `Set ${dep} version to ${version} in peerDependencies`
          );
          modified = true;
        }
      }
    }
  }

  pkg.peerDependencies = peerDeps;

  // Fix dependencies
  const deps = pkg.dependencies ?? {};
  const devDeps = pkg.devDependencies ?? {};

  // Ensure TypeScript type versions match React versions and TypeScript version is consistent
  for (const typeDep in REQUIRED_TYPE_VERSIONS) {
    if (Object.prototype.hasOwnProperty.call(REQUIRED_TYPE_VERSIONS, typeDep)) {
      const version = REQUIRED_TYPE_VERSIONS[typeDep];

      // Update TypeScript type versions in devDependencies
      if (devDeps[typeDep] && devDeps[typeDep] !== version) {
        // Always log the warning first
        logError(
          pkg.name,
          `${typeDep} version should be ${version} in devDependencies`
        );

        if (fix) {
          devDeps[typeDep] = version;
          logFix(
            pkg.name,
            `Updated ${typeDep} version to ${version} in devDependencies`
          );
          modified = true;
        }
      }
    }
  }

  for (const dep of REQUIRED_PEERS) {
    if (dep in deps) {
      // Always log the warning first
      logError(
        pkg.name,
        `${dep} should be in peerDependencies, not dependencies`
      );

      if (fix) {
        // Move to peerDependencies if not already there
        if (!peerDeps[dep]) {
          peerDeps[dep] = deps[dep];
        }
        // Remove from dependencies
        delete deps[dep];
        logFix(pkg.name, `Moved ${dep} from dependencies to peerDependencies`);
        modified = true;
      }
    }
  }

  // Move external dependencies to peerDependencies
  for (const dep in deps) {
    if (
      (!dep.startsWith(INTERNAL_PREFIX) && !dep.startsWith('@')) ||
      (dep.startsWith('@') && !dep.startsWith(INTERNAL_PREFIX))
    ) {
      // Always log the warning first
      logError(
        pkg.name,
        `"${dep}" in dependencies is external; move to peer/devDependencies`
      );

      if (fix) {
        // Move to peerDependencies
        peerDeps[dep] = deps[dep];
        delete deps[dep];
        logFix(
          pkg.name,
          `moved "${dep}" from dependencies to peerDependencies`
        );
        modified = true;
      }
    }
  }

  // Update the package object
  pkg.dependencies = Object.keys(deps).length > 0 ? deps : undefined;
  pkg.peerDependencies =
    Object.keys(peerDeps).length > 0 ? peerDeps : undefined;
  pkg.devDependencies = Object.keys(devDeps).length > 0 ? devDeps : undefined;

  if (modified && fix) {
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }

  return modified;
}

function validateModuleJson(modulePath, moduleJson, fix) {
  const pkgName = moduleJson.name || path.basename(path.dirname(modulePath));
  let modified = false;

  // Check module type
  if (!moduleJson.type || !VALID_MODULE_TYPES.includes(moduleJson.type)) {
    if (fix) {
      // Try to infer type from directory structure
      const parentDir = path.basename(path.dirname(modulePath));
      if (VALID_MODULE_TYPES.includes(parentDir)) {
        moduleJson.type = parentDir.endsWith('s')
          ? parentDir.slice(0, -1)
          : parentDir;
        logFix(pkgName, `inferred and set module type to "${moduleJson.type}"`);
        modified = true;
      } else {
        // Default to 'plugin' if we can't infer
        moduleJson.type = 'plugin';
        logFix(pkgName, `set default module type to "plugin"`);
        modified = true;
      }
    } else {
      logError(pkgName, 'invalid or missing module type');
    }
  }

  // Check required fields
  for (const field of REQUIRED_MODULE_FIELDS) {
    if (!moduleJson[field]) {
      if (fix) {
        // Add default values for missing fields
        switch (field) {
          case 'version':
            moduleJson.version = '1.0.0';
            break;
          case 'description':
            moduleJson.description = `${pkgName} - A Zopio ${moduleJson.type || 'module'}`;
            break;
          case 'author':
            moduleJson.author = 'Zopio Team';
            break;
          case 'license':
            moduleJson.license = 'MIT';
            break;
        }
        logFix(
          pkgName,
          `added default value for "${field}": "${moduleJson[field]}"`
        );
        modified = true;
      } else {
        logError(pkgName, `missing required field: "${field}"`);
      }
    }
  }

  // Check zopio config
  if (moduleJson.zopio) {
    for (const field of REQUIRED_ZOPIO_CONFIG) {
      if (!moduleJson.zopio[field]) {
        if (fix) {
          // Add default values for missing zopio config fields
          switch (field) {
            case 'category':
              moduleJson.zopio.category = moduleJson.type || 'plugin';
              break;
            case 'icon':
              moduleJson.zopio.icon = 'default-icon';
              break;
          }
          logFix(
            pkgName,
            `added default value for zopio.${field}: "${moduleJson.zopio[field]}"`
          );
          modified = true;
        } else {
          logError(pkgName, `missing required zopio config: "${field}"`);
        }
      }
    }
  } else if (fix) {
    moduleJson.zopio = {
      category: moduleJson.type || 'plugin',
      icon: 'default-icon',
    };
    logFix(pkgName, 'added default zopio configuration object');
    modified = true;
  } else {
    logError(pkgName, 'missing zopio configuration object');
  }

  // Check dependencies in module.json
  if (moduleJson.dependencies) {
    const deps = moduleJson.dependencies;
    const peerDeps = moduleJson.peerDependencies || {};
    let depsModified = false;

    // Move external dependencies to peerDependencies
    for (const dep in deps) {
      if (
        (!dep.startsWith(INTERNAL_PREFIX) && !dep.startsWith('@')) ||
        (dep.startsWith('@') && !dep.startsWith(INTERNAL_PREFIX))
      ) {
        if (fix) {
          // Move to peerDependencies
          peerDeps[dep] = deps[dep];
          delete deps[dep];
          logFix(
            pkgName,
            `moved "${dep}" from dependencies to peerDependencies`
          );
          depsModified = true;
        } else {
          logError(
            pkgName,
            `"${dep}" in dependencies should be internal or moved to peerDependencies`
          );
        }
      }
    }

    // Check for React peer dependencies in module.json
    for (const dep in REQUIRED_PEER_VERSIONS) {
      if (Object.prototype.hasOwnProperty.call(REQUIRED_PEER_VERSIONS, dep)) {
        const version = REQUIRED_PEER_VERSIONS[dep];

        // Remove from dependencies if present
        if (deps[dep]) {
          delete deps[dep];
          logFix(pkgName, `Removed ${dep} from dependencies in module.json`);
          depsModified = true;
        }

        // Add to or update in peerDependencies
        if (!peerDeps[dep] || peerDeps[dep] !== version) {
          peerDeps[dep] = version;
          logFix(
            pkgName,
            `Set ${dep} version to ${version} in module.json peerDependencies`
          );
          depsModified = true;
        }
      }
    }

    // Update the module object if dependencies were modified
    if (depsModified) {
      moduleJson.dependencies = Object.keys(deps).length > 0 ? deps : undefined;
      moduleJson.peerDependencies =
        Object.keys(peerDeps).length > 0 ? peerDeps : undefined;
      modified = true;
    }
  } else if (fix) {
    // If no dependencies section exists but we need to add React peer dependencies
    const peerDeps = moduleJson.peerDependencies || {};
    let peerDepsModified = false;

    // Add React peer dependencies
    for (const dep in REQUIRED_PEER_VERSIONS) {
      if (Object.prototype.hasOwnProperty.call(REQUIRED_PEER_VERSIONS, dep)) {
        const version = REQUIRED_PEER_VERSIONS[dep];
        if (!peerDeps[dep] || peerDeps[dep] !== version) {
          peerDeps[dep] = version;
          logFix(
            pkgName,
            `Set ${dep} version to ${version} in module.json peerDependencies`
          );
          peerDepsModified = true;
        }
      }
    }

    if (peerDepsModified) {
      moduleJson.peerDependencies = peerDeps;
      modified = true;
    }
  }

  if (modified && fix) {
    try {
      fs.writeFileSync(modulePath, `${JSON.stringify(moduleJson, null, 2)}\n`);
    } catch (_err) {}
  }

  return modified;
}

function lintRegistryItem(itemPath, fix = false) {
  const stats = fs.statSync(itemPath);
  if (!stats.isDirectory()) {
    return;
  }

  const itemName = path.basename(itemPath);

  // Skip ignored directories (case-insensitive)
  if (shouldIgnoreDir(itemName)) {
    return;
  }

  const pkgPath = path.join(itemPath, 'package.json');
  const moduleJsonPath = path.join(itemPath, 'zopio.module.json');

  // Check if package.json exists
  let pkgExists = fs.existsSync(pkgPath);
  if (pkgExists) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      fixPackage(pkgPath, pkg, fix);
    } catch (err) {
      logError(itemName, `invalid package.json: ${err.message}`);
    }
  }

  // Check zopio.module.json
  let moduleJsonExists = false;
  try {
    const moduleJson = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf-8'));
    moduleJsonExists = true;
    validateModuleJson(moduleJsonPath, moduleJson, fix);
  } catch (err) {
    // File doesn't exist or is invalid
    if (err.code !== 'ENOENT') {
      logError(itemName, `invalid zopio.module.json: ${err.message}`);
    }
  }
  
  if (!moduleJsonExists && fix) {
    // Create a new zopio.module.json file with default values
    try {
      // Try to get package.json data to use for the module file
      let pkgData = {};
      try {
        pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      } catch (_err) {
        // Ignore package.json parsing errors here (file might not exist or be invalid)
      }

      // Infer module type from directory structure
      const parentDir = path.basename(path.dirname(itemPath));
      const moduleType = VALID_MODULE_TYPES.includes(
        parentDir.endsWith('s') ? parentDir.slice(0, -1) : parentDir
      )
        ? parentDir.endsWith('s')
          ? parentDir.slice(0, -1)
          : parentDir
        : 'plugin';

      const defaultModuleJson = {
        name: pkgData.name || itemName,
        version: pkgData.version || '1.0.0',
        description:
          pkgData.description || `${itemName} - A Zopio ${moduleType}`,
        author: pkgData.author || 'Zopio Team',
        license: pkgData.license || 'MIT',
        type: moduleType,
        zopio: {
          category: moduleType,
          icon: 'default-icon',
        },
      };

      // Add peer dependencies if needed
      if (moduleType === 'plugin' || moduleType === 'app') {
        defaultModuleJson.peerDependencies = {};
        for (const dep in REQUIRED_PEER_VERSIONS) {
          if (
            Object.prototype.hasOwnProperty.call(REQUIRED_PEER_VERSIONS, dep)
          ) {
            defaultModuleJson.peerDependencies[dep] =
              REQUIRED_PEER_VERSIONS[dep];
          }
        }
      }

      fs.writeFileSync(
        moduleJsonPath,
        `${JSON.stringify(defaultModuleJson, null, 2)}\n`
      );
      logFix(
        itemName,
        'created new zopio.module.json file with default values'
      );
    } catch (err) {
      logError(itemName, `failed to create zopio.module.json: ${err.message}`);
    }
  } else if (!moduleJsonExists) {
    logError(itemName, 'missing zopio.module.json file');
  }
}

function lintAllRegistryItems(fix = false, specificPath = null) {
  process.stdout.write(`\n${colors.cyan('Checking registry items...')}\n\n`);

  // If a specific path is provided, check only that path
  if (specificPath) {
    const fullPath = path.isAbsolute(specificPath)
      ? specificPath
      : path.resolve(PROJECT_ROOT, specificPath);

    if (!fs.existsSync(fullPath)) {
      process.stderr.write(
        `${colors.red('Error:')} Path not found at ${fullPath}\n`
      );
      process.exit(1);
    }

    process.stdout.write(
      `${colors.cyan('Checking specific path:')} ${fullPath}\n\n`
    );
    lintRegistryItem(fullPath, fix);
    return;
  }

  // Check if registry directory exists
  if (!fs.existsSync(REGISTRY_DIR)) {
    process.stderr.write(
      `${colors.red('Error:')} Registry directory not found at ${REGISTRY_DIR}\n`
    );
    process.exit(1);
  }

  // Get all subdirectories in registry
  const registrySubdirs = fs.readdirSync(REGISTRY_DIR);

  // Process each subdirectory (apps, plugins, etc.)
  for (const subdir of registrySubdirs) {
    // Skip ignored directories at the top level (case-insensitive)
    if (shouldIgnoreDir(subdir)) {
      continue;
    }

    const subdirPath = path.join(REGISTRY_DIR, subdir);

    try {
      const stats = fs.statSync(subdirPath);

      if (stats.isDirectory()) {
        process.stdout.write(`\n${colors.yellow(subdir.toUpperCase())}\n`);

        // Get all items in the subdirectory
        const items = fs.readdirSync(subdirPath);

        // Process each item
        for (const item of items) {
          // Skip ignored directories (case-insensitive)
          if (shouldIgnoreDir(item)) {
            continue;
          }

          const itemPath = path.join(subdirPath, item);
          lintRegistryItem(itemPath, fix);
        }
      }
    } catch (err) {
      process.stderr.write(`Error processing ${subdirPath}: ${err.message}\n`);
    }
  }

  // Print summary
  if (warningsSummary.length > 0) {
    process.stdout.write(`\n${colors.red('Registry check found issues:')}\n`);
    process.stdout.write(
      `${warningsSummary.map((err) => `  - ${err}`).join('\n')}\n`
    );

    if (fix) {
      process.stdout.write(
        `\n${colors.green('✔')} ${colors.bgGreen.black(' FIXED ')} Issues have been automatically fixed.\n`
      );
    } else {
      process.stdout.write(
        `\n${colors.red('✘')} ${colors.bgRed.white(' FAILED ')} Run with --fix to automatically fix these issues.\n`
      );
      process.exit(1);
    }
  } else {
    process.stdout.write(
      `\n${colors.green('✔')} ${colors.bgGreen.black(' SUCCESS ')} All registry items are valid.\n`
    );
  }
}

// Ensure logs directory exists
const LOGS_DIR = path.resolve(PROJECT_ROOT, 'logs');
if (!fs.existsSync(LOGS_DIR)) {
  try {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  } catch (err) {
    process.stderr.write(
      `${colors.red('Error:')} Failed to create logs directory: ${err.message}\n`
    );
  }
}

// Parse command line arguments
const options = parseCommandLineArgs();

// Run the registry check with the parsed options
lintAllRegistryItems(options.fix, options.path);

// Write detailed log file with information about changes and versions
const LOG_FILE = path.join(LOGS_DIR, 'check-registry.log');
const timestamp = new Date().toISOString();
let logContent = `\n--- Registry Check: ${timestamp} ---\n`;

// Add environment information
logContent += 'Environment:\n';
logContent += `  Node.js: ${process.version}\n`;
logContent += `  Platform: ${process.platform}\n`;
logContent += `  React Version: ${REACT_VERSION}\n`;
logContent += `  TypeScript Version: ${TYPESCRIPT_VERSION}\n\n`;

// Add command information
logContent += 'Command Options:\n';
logContent += `  Fix Mode: ${options.fix ? 'Enabled' : 'Disabled'}\n`;
logContent += `  Verbose Mode: ${options.verbose ? 'Enabled' : 'Disabled'}\n`;
logContent += `  Path: ${options.path || 'All registry items'}\n\n`;

// Add detailed results for errors and fixes

// Process warnings (issues found before fixing)
if (warningsSummary.length > 0) {
  logContent += `WARNINGS - Found ${warningsSummary.length} issues:\n`;

  // Group warnings by package for better readability
  const warningsByPackage = {};
  for (const warning of warningsSummary) {
    const [pkgName, message] = warning.split(': ');
    if (!warningsByPackage[pkgName]) {
      warningsByPackage[pkgName] = [];
    }
    warningsByPackage[pkgName].push(message);
  }

  // Format grouped warnings
  for (const pkgName of Object.keys(warningsByPackage).sort()) {
    logContent += `  Package: ${pkgName}\n`;
    for (const msg of warningsByPackage[pkgName]) {
      // Extract version information if present
      const versionMatch = msg.match(/version to (\^?[0-9]+\.[0-9]+\.[0-9]+)/);
      if (versionMatch) {
        logContent += `    - Version mismatch: ${versionMatch[1]} required\n`;
      } else if (msg.includes('moved') && msg.includes('dependencies')) {
        // Dependency changes
        logContent += `    - Dependency issue: ${msg}\n`;
      } else {
        logContent += `    - ${msg}\n`;
      }
    }
  }

  logContent += '\n';
}

// Process fixes (only when --fix is used)
if (fixesSummary.length > 0) {
  logContent += `FIXES APPLIED - ${fixesSummary.length} issues fixed:\n`;

  // Group fixes by package for better readability
  const fixesByPackage = {};
  for (const fix of fixesSummary) {
    const [pkgName, message] = fix.split(': ');
    if (!fixesByPackage[pkgName]) {
      fixesByPackage[pkgName] = [];
    }
    fixesByPackage[pkgName].push(message);
  }

  // Format grouped fixes
  for (const pkgName of Object.keys(fixesByPackage).sort()) {
    logContent += `  Package: ${pkgName}\n`;
    for (const msg of fixesByPackage[pkgName]) {
      // Extract version information if present
      const versionMatch = msg.match(/version to (\^?[0-9]+\.[0-9]+\.[0-9]+)/);
      if (versionMatch) {
        logContent += `    - Version updated to: ${versionMatch[1]}\n`;
      } else if (msg.includes('moved') && msg.includes('dependencies')) {
        // Dependency changes
        logContent += `    - Dependency change: ${msg}\n`;
      } else {
        logContent += `    - ${msg}\n`;
      }
    }
  }

  logContent += '\n';
}

if (warningsSummary.length === 0 && fixesSummary.length === 0) {
  logContent += 'All registry items are valid.\n';
} else if (options.fix) {
  logContent += 'Issues were automatically fixed.\n';
} else if (warningsSummary.length > 0) {
  logContent += 'Issues were not fixed.\n';
}

// Add summary information
logContent += '\nSummary:\n';
logContent += `  Directory checked: ${options.path || REGISTRY_DIR}\n`;
logContent += `  Total packages checked: ${options.path ? '1' : 'All registry packages'}\n`;
logContent += `  Issues found: ${warningsSummary.length}\n`;
logContent += `  Status: ${warningsSummary.length > 0 ? (options.fix ? 'Fixed' : 'Issues Reported') : 'Valid'}\n`;
logContent += `  Timestamp: ${new Date().toLocaleString()}\n`;
logContent += '-----------------------------------\n';

try {
  // Append to log file
  fs.appendFileSync(LOG_FILE, logContent);
  if (options.verbose) {
    process.stdout.write(`\n${colors.green('✔')} Log written to ${LOG_FILE}\n`);
  }
} catch (err) {
  process.stderr.write(
    `${colors.red('Error:')} Failed to write to log file: ${err.message}\n`
  );
}

// If verbose mode is enabled, show additional information
if (options.verbose) {
  process.stdout.write(`\n${colors.cyan('Registry Check Complete')}\n`);
  process.stdout.write(`Time: ${new Date().toLocaleTimeString()}\n`);
  process.stdout.write(`Directory: ${options.path || REGISTRY_DIR}\n`);
}
