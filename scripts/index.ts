#!/usr/bin/env node
/**
 * SPDX-License-Identifier: MIT
 */


import { Command } from 'commander';
import { initialize } from './initialize.js';
import { update } from './update.js';

// @ts-expect-error: Command is imported as a type but used as a value
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

program.parse(process.argv);
