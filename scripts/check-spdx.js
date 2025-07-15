#!/usr/bin/env node
/**
 * SPDX-License-Identifier: MIT
 *
 * Script to check and fix SPDX license headers in source files
 */

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

// Configuration
const CONFIG = {
  IGNORE_DIRS: [
    'node_modules',
    '.turbo',
    '.next',
    '.git',
    'dist',
    'out',
    'build',
    '.cache',
    '.bin',
    'coverage',
  ],
  ALLOWED_EXTENSIONS: ['.js', '.ts', '.tsx', '.mjs', '.cjs'],
  SPDX_IDENTIFIER: 'SPDX-License-Identifier',
  DEFAULT_LICENSE: 'MIT',
  MAX_HEADER_LINES: 10,
  BATCH_SIZE: 100, // Process files in batches for progress reporting
};

// Detect project license
function detectProjectLicense() {
  // Try to read from LICENSE.md
  try {
    const licenseContent = fs.readFileSync('LICENSE.md', 'utf-8');
    const firstLine = licenseContent.split('\n')[0].trim();

    if (firstLine.includes('MIT')) {
      return 'MIT';
    } else if (firstLine.includes('Apache')) {
      return firstLine.includes('2.0') ? 'Apache-2.0' : 'Apache';
    } else if (firstLine.includes('BSD')) {
      if (firstLine.includes('3-Clause')) {
        return 'BSD-3-Clause';
      } else if (firstLine.includes('2-Clause')) {
        return 'BSD-2-Clause';
      }
      return 'BSD';
    } else if (firstLine.includes('GPL')) {
      if (firstLine.includes('v3')) {
        return 'GPL-3.0';
      } else if (firstLine.includes('v2')) {
        return 'GPL-2.0';
      }
      return 'GPL';
    }
  } catch (e) {
    // LICENSE.md not found or couldn't be read
  }

  // Try to read from package.json
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    if (packageJson.license) {
      return packageJson.license;
    }
  } catch (e) {
    // package.json not found or couldn't be read
  }

  // Default to MIT if nothing else is found
  return CONFIG.DEFAULT_LICENSE;
}

// Set the project license
CONFIG.PROJECT_LICENSE = detectProjectLicense();

// CLI arguments
const args = process.argv.slice(2);
const AUTO_FIX = args.includes('--fix');
const VERBOSE = args.includes('--verbose');
const HELP = args.includes('--help') || args.includes('-h');
const SPECIFIC_PATH = args.find(arg => !arg.startsWith('-'));
const QUIET = args.includes('--quiet');
const SUMMARY_ONLY = args.includes('--summary');
const GENERATE_REPORT = args.includes('--report');
const CI_MODE = args.includes('--ci');
const STAGED_ONLY = args.includes('--staged');
const LICENSE = args.find(arg => arg.startsWith('--license='))?.split('=')[1] || CONFIG.PROJECT_LICENSE;

// Detect if running in CI environment
const IS_CI = CI_MODE || process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

// Colors for terminal output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
};

// Display help message
if (HELP) {
  console.log(`${COLORS.bold}SPDX License Header Checker${COLORS.reset}

Usage: node check-spdx.js [options] [path]

Options:
  --fix              Automatically add SPDX headers to files missing them
  --verbose          Show detailed information about each file
  --quiet            Only show errors, no success messages
  --summary          Only show summary statistics
  --license=LICENSE  Specify license to use when fixing (default: auto-detected)
  --report           Generate a JSON report file with results
  --ci               Run in CI mode (minimal output, exit code only)
  --staged           Only check git staged files
  --help, -h         Show this help message

Examples:
  node check-spdx.js                     # Check all files
  node check-spdx.js --fix               # Check and fix all files
  node check-spdx.js packages/core       # Check only files in packages/core
  node check-spdx.js --fix --license=BSD # Fix with BSD license
`);
  process.exit(0);
}

// Statistics
const stats = {
  totalFiles: 0,
  checkedFiles: 0,
  missingHeaders: 0,
  fixedFiles: 0,
  errors: 0,
};

// Helper functions
function isIgnored(filePath) {
  const normalizedPath = path.normalize(filePath);
  return CONFIG.IGNORE_DIRS.some((dir) => {
    // Check if the path starts with the ignored directory
    if (normalizedPath.startsWith(`${dir}${path.sep}`)) {
      return true;
    }
    // Check if the path contains the ignored directory as a segment
    if (normalizedPath.includes(`${path.sep}${dir}${path.sep}`)) {
      return true;
    }
    // Check if the path ends with the ignored directory
    if (normalizedPath.endsWith(`${path.sep}${dir}`)) {
      return true;
    }
    // Check if the path is exactly the ignored directory
    if (normalizedPath === dir) {
      return true;
    }
    return false;
  });
}

function hasSpdxHeader(fileContent) {
  const lines = fileContent.split('\n').slice(0, CONFIG.MAX_HEADER_LINES);
  return lines.some((line) => line.includes(CONFIG.SPDX_IDENTIFIER));
}

function getFileType(filePath) {
  const ext = path.extname(filePath);
  switch (ext) {
    case '.js':
    case '.ts':
    case '.tsx':
    case '.mjs':
    case '.cjs':
      return 'javascript';
    default:
      return 'unknown';
  }
}

function createSpdxHeader(fileType, license) {
  switch (fileType) {
    case 'javascript':
      return `/**
 * SPDX-License-Identifier: ${license}
 */

`;
    default:
      return `// SPDX-License-Identifier: ${license}

`;
  }
}

function addSpdxHeader(filePath, license) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (hasSpdxHeader(content)) return false;

    const fileType = getFileType(filePath);
    const header = createSpdxHeader(fileType, license);

    // Handle shebang if present
    let newContent;
    if (content.startsWith('#!')) {
      const lines = content.split('\n');
      const shebang = lines[0];
      const rest = lines.slice(1).join('\n');
      newContent = `${shebang}\n${header}${rest}`;
    } else {
      newContent = `${header}${content}`;
    }

    fs.writeFileSync(filePath, newContent);
    return true;
  } catch (error) {
    logError(`Error fixing ${filePath}: ${error.message}`);
    stats.errors++;
    return false;
  }
}

function walkDir(dir, fileCallback, progressCallback = null) {
  const allFiles = [];

  function collectFiles(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir);

      for (const entry of entries) {
        const entryPath = path.join(currentDir, entry);

        try {
          const stats = fs.statSync(entryPath);

          if (stats.isDirectory()) {
            if (!isIgnored(entryPath)) {
              collectFiles(entryPath);
            }
          } else {
            allFiles.push(entryPath);
          }
        } catch (error) {
          // Skip files/directories that can't be accessed
          if (VERBOSE) {
            logError(`Cannot access: ${entryPath}`);
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
      if (VERBOSE) {
        logError(`Cannot read directory: ${dir}`);
      }
    }
  }

  collectFiles(dir);

  // Process files in batches with progress updates
  const totalFiles = allFiles.length;
  stats.totalFiles = totalFiles;

  for (let i = 0; i < totalFiles; i += CONFIG.BATCH_SIZE) {
    const batch = allFiles.slice(i, i + CONFIG.BATCH_SIZE);

    batch.forEach(fileCallback);

    if (progressCallback && !QUIET && !SUMMARY_ONLY) {
      progressCallback(Math.min(i + CONFIG.BATCH_SIZE, totalFiles), totalFiles);
    }
  }
}

// Logging functions
function logSuccess(message) {
  if (!QUIET && !SUMMARY_ONLY) {
    console.log(`${COLORS.green}✓${COLORS.reset} ${message}`);
  }
}

function logWarning(message) {
  if (!QUIET && !SUMMARY_ONLY) {
    console.log(`${COLORS.yellow}!${COLORS.reset} ${message}`);
  }
}

function logError(message) {
  if (!SUMMARY_ONLY) {
    console.error(`${COLORS.red}✘${COLORS.reset} ${message}`);
  }
}

function logInfo(message) {
  if (VERBOSE && !QUIET && !SUMMARY_ONLY) {
    console.log(`${COLORS.blue}i${COLORS.reset} ${message}`);
  }
}

function updateProgress(current, total) {
  const percentage = Math.floor((current / total) * 100);
  process.stdout.write(`\r${COLORS.cyan}⟳${COLORS.reset} Checking files: ${current}/${total} (${percentage}%)`);
  if (current === total) {
    process.stdout.write('\n');
  }
}

function printSummary() {
  console.log('\n' + '='.repeat(50));
  console.log(`${COLORS.bold}SPDX Header Check Summary${COLORS.reset}`);
  console.log('='.repeat(50));
  console.log(`Total files scanned: ${stats.checkedFiles}/${stats.totalFiles}`);

  if (stats.missingHeaders > 0) {
    console.log(`${COLORS.yellow}Missing headers: ${stats.missingHeaders}${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}Missing headers: ${stats.missingHeaders}${COLORS.reset}`);
  }

  if (AUTO_FIX) {
    console.log(`Fixed files: ${stats.fixedFiles}`);
  }

  if (stats.errors > 0) {
    console.log(`${COLORS.red}Errors encountered: ${stats.errors}${COLORS.reset}`);
  }

  console.log('='.repeat(50));
}

// Main execution
const startTime = Date.now();
const missingSpdxFiles = [];

// Get git staged files if in staged mode
async function getGitStagedFiles() {
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    exec('git diff --cached --name-only', (error, stdout) => {
      if (error) {
        console.error(`Error getting staged files: ${error.message}`);
        resolve([]);
        return;
      }

      const files = stdout.trim().split('\n').filter(Boolean);
      resolve(files);
    });
  });
}

// Filter function for staged files
let stagedFiles = [];
let isFileStaged = () => true; // Default to checking all files

if (STAGED_ONLY) {
  try {
    const { execSync } = require('child_process');
    stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
      .trim().split('\n').filter(Boolean);

    if (stagedFiles.length === 0) {
      if (!QUIET && !CI_MODE) {
        console.log(`${COLORS.yellow}No staged files found.${COLORS.reset}`);
      }
      process.exit(0);
    }

    isFileStaged = (file) => stagedFiles.includes(file);

    if (!QUIET && !SUMMARY_ONLY && !CI_MODE) {
      console.log(`${COLORS.blue}Found ${stagedFiles.length} staged files${COLORS.reset}`);
    }
  } catch (error) {
    console.error(`${COLORS.red}Error getting staged files: ${error.message}${COLORS.reset}`);
    process.exit(1);
  }
}

// Determine the root directory to scan
const rootDir = SPECIFIC_PATH || '.';

if (!QUIET && !SUMMARY_ONLY && !CI_MODE) {
  console.log(`${COLORS.bold}SPDX License Header Checker${COLORS.reset}`);
  console.log(`Scanning directory: ${path.resolve(rootDir)}`);
  console.log(`Project license: ${LICENSE} (${LICENSE === CONFIG.PROJECT_LICENSE ? 'auto-detected' : 'user-specified'})`);
  if (AUTO_FIX) {
    console.log(`Auto-fix enabled with license: ${LICENSE}`);
  }
  if (STAGED_ONLY) {
    console.log(`Checking ${stagedFiles.length} staged files only`);
  }
  console.log('');
}

walkDir(rootDir, (filePath) => {
  const ext = path.extname(filePath);

  // Skip if not in staged files when in staged mode
  if (STAGED_ONLY && !isFileStaged(filePath)) {
    return;
  }

  if (CONFIG.ALLOWED_EXTENSIONS.includes(ext) && !isIgnored(filePath)) {
    stats.checkedFiles++;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      if (!hasSpdxHeader(content)) {
        stats.missingHeaders++;
        missingSpdxFiles.push(filePath);

        if (AUTO_FIX) {
          const fixed = addSpdxHeader(filePath, LICENSE);
          if (fixed) {
            stats.fixedFiles++;
            logInfo(`Fixed: ${filePath}`);
          }
        } else {
          logInfo(`Missing header: ${filePath}`);
        }
      } else if (VERBOSE) {
        logInfo(`OK: ${filePath}`);
      }
    } catch (error) {
      logError(`Error reading ${filePath}: ${error.message}`);
      stats.errors++;
    }
  }
}, updateProgress);

// Final output
if (missingSpdxFiles.length > 0 && !AUTO_FIX) {
  if (!SUMMARY_ONLY) {
    console.log('\n');
    logError('Missing SPDX headers in the following files:');

    // Group files by directory for better readability
    const filesByDir = {};
    missingSpdxFiles.forEach(file => {
      const dir = path.dirname(file);
      if (!filesByDir[dir]) filesByDir[dir] = [];
      filesByDir[dir].push(path.basename(file));
    });

    // Sort directories by path depth for better organization
    const sortedDirs = Object.keys(filesByDir).sort((a, b) => {
      const depthA = a.split(path.sep).length;
      const depthB = b.split(path.sep).length;
      if (depthA === depthB) return a.localeCompare(b);
      return depthA - depthB;
    });

    // Group by top-level directory first
    const topLevelDirs = {};
    sortedDirs.forEach(dir => {
      const topDir = dir.split(path.sep)[0] || '.';
      if (!topLevelDirs[topDir]) topLevelDirs[topDir] = [];
      topLevelDirs[topDir].push(dir);
    });

    Object.entries(topLevelDirs).forEach(([topDir, dirs]) => {
      console.log(`${COLORS.bold}${COLORS.magenta}${topDir}/${COLORS.reset}`);

      dirs.forEach(dir => {
        // Skip printing the top dir again if it's the same
        if (dir !== topDir) {
          const relativeDir = dir === topDir ? '' : dir.startsWith(topDir) ? dir.substring(topDir.length + 1) : dir;
          console.log(`  ${COLORS.yellow}${relativeDir}${COLORS.reset}`);
        }

        filesByDir[dir].sort().forEach(file => {
          console.log(`    - ${file}`);
        });
      });
    });
  }

  printSummary();

  if (AUTO_FIX) {
    if (stats.fixedFiles === stats.missingHeaders) {
      logSuccess('All files fixed successfully');
      process.exit(0);
    } else {
      logError(`Fixed ${stats.fixedFiles}/${stats.missingHeaders} files with issues`);
      process.exit(1);
    }
  } else {
    logWarning(`Run with --fix to automatically add SPDX headers to ${missingSpdxFiles.length} files`);
    process.exit(1);
  }
} else {
  if (AUTO_FIX && stats.fixedFiles > 0) {
    logSuccess(`Fixed SPDX headers in ${stats.fixedFiles} files`);
  } else {
    logSuccess('SPDX header check completed successfully');
  }

  if (SUMMARY_ONLY || stats.fixedFiles > 0) {
    printSummary();
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Generate report if requested
  if (GENERATE_REPORT) {
    const reportData = {
      timestamp: new Date().toISOString(),
      duration: parseFloat(duration),
      stats: {
        totalFiles: stats.totalFiles,
        checkedFiles: stats.checkedFiles,
        missingHeaders: stats.missingHeaders,
        fixedFiles: stats.fixedFiles,
        errors: stats.errors
      },
      license: LICENSE,
      autoDetected: LICENSE === CONFIG.PROJECT_LICENSE,
      missingSpdxFiles: missingSpdxFiles.map(file => ({
        path: file,
        directory: path.dirname(file),
        filename: path.basename(file),
        extension: path.extname(file)
      })),
      rootDirectory: path.resolve(rootDir)
    };

    const reportFilename = `spdx-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(reportFilename, JSON.stringify(reportData, null, 2));
    console.log(`\n${COLORS.cyan}Report generated: ${reportFilename}${COLORS.reset}`);
  }

  if (!QUIET && !SUMMARY_ONLY) {
    console.log(`\nCompleted in ${duration}s`);
  }

  process.exit(0);
}
