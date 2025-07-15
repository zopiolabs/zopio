#!/usr/bin/env node
/**
 * SPDX-License-Identifier: MIT
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const args = process.argv.slice(2);
const skipInstall = args.includes('--no-install');
const dryRun = args.includes('--dry-run');
const skipRecursive = args.includes('--no-recursive');

const FOLDERS = [
  'node_modules',
  'dist',
  'build',
  'out',
  '.next',
  '.turbo',
  '.vercel',
  '.cache',
];

const FILES = [
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
];

// Directories to skip when doing recursive search
const SKIP_DIRS = [
  '.git',
];

let totalFoldersRemoved = 0;
let totalFilesRemoved = 0;

function logWouldRemove(type, name) {
  console.log(`🗑 Would remove ${type}: ${name}`);
}

function removeFolder(folderPath) {
  // Convert to relative path for logging
  const relativePath = path.relative(root, folderPath);

  if (fs.existsSync(folderPath)) {
    if (dryRun) {
      logWouldRemove('folder', relativePath || '.');
    } else {
      try {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`✔ Removed folder: ${relativePath || '.'}`);
        totalFoldersRemoved++;
      } catch (err) {
        console.error(`❌ Failed to remove folder: ${relativePath || '.'}`, err);
      }
    }
  }
}

function removeFile(filePath) {
  // Convert to relative path for logging
  const relativePath = path.relative(root, filePath);

  if (fs.existsSync(filePath)) {
    if (dryRun) {
      logWouldRemove('file', relativePath);
    } else {
      try {
        fs.rmSync(filePath);
        console.log(`✔ Removed file: ${relativePath}`);
        totalFilesRemoved++;
      } catch (err) {
        console.error(`❌ Failed to remove file: ${relativePath}`, err);
      }
    }
  }
}

/**
 * Recursively find and clean files/folders in the given directory
 */
function cleanDirectory(dir) {
  // Clean specific folders in current directory
  FOLDERS.forEach(folder => {
    const folderPath = path.join(dir, folder);
    if (fs.existsSync(folderPath)) {
      removeFolder(folderPath);
    }
  });

  // Clean specific files in current directory
  FILES.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
      removeFile(filePath);
    }
  });

  // If recursive mode is enabled, process subdirectories
  if (!skipRecursive) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subdir = path.join(dir, entry.name);

          // Skip directories in the SKIP_DIRS list
          if (SKIP_DIRS.includes(entry.name)) {
            continue;
          }

          cleanDirectory(subdir);
        }
      }
    } catch (err) {
      console.error(`❌ Error reading directory ${dir}:`, err);
    }
  }
}

function reinstall() {
  console.log('\n📦 Reinstalling dependencies with pnpm...\n');
  try {
    execSync('pnpm install', { stdio: 'inherit' });
    console.log('\n✅ Reinstallation complete.');
  } catch (err) {
    console.error('❌ Failed to reinstall dependencies.', err);
  }
}

console.log('🧹 Starting full cleanup...');
console.log(skipRecursive ? '🔍 Cleaning root directory only' : '🔍 Cleaning root and all subdirectories recursively');
console.log('');

// Start the cleaning process from the root directory
cleanDirectory(root);

if (dryRun) {
  console.log('\n🚫 Dry-run mode: nothing was deleted.');
} else {
  console.log(`\n🧹 Cleanup summary: removed ${totalFoldersRemoved} folders and ${totalFilesRemoved} files`);

  if (!skipInstall) {
    reinstall();
  } else {
    console.log('\n🚫 Skipping dependency installation (due to --no-install)');
  }
}
