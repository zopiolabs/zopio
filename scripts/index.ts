#!/usr/bin/env node
/**
 * SPDX-License-Identifier: MIT
 */


import { Command } from 'commander';
import { initialize } from './initialize.js';
import { update } from './update.js';
import { projectSetup } from './project-setup.js';

const program = new Command();

program
  .command('init')
  .description('Initialize a new zopio project')
  .option('--name <name>', 'Name of the project')
  .option(
    '--package-manager <manager>',
    'Package manager to use (npm, yarn, bun, pnpm)'
  )
  .option('--disable-git', 'Disable git initialization')
  .action(initialize);

program
  .command('update')
  .description('Update the project from one version to another')
  .option('--from <version>', 'Version to update from e.g. 1.0.0')
  .option('--to <version>', 'Version to update to e.g. 2.0.0')
  .action(update);

program
  .command('project:setup')
  .description('Interactive setup for a new Zopio-based project in this monorepo')
  .option('--dry-run', 'Preview changes without applying them')
  .action(projectSetup);

program.parse(process.argv);
