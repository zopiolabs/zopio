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
import chalk from 'chalk';
// Use ES module import for commander
import { Command } from 'commander';
import { configCommand } from './commands/config';
import { crudCommand } from './commands/crud';
import { crudPermissionsCommand } from './commands/crud-permissions';
import { crudSchemaCommand } from './commands/crud-schema';
import { crudTestingCommand } from './commands/crud-testing';
import { crudUiCommand } from './commands/crud-ui';
import { crudUnifiedCommand } from './commands/crud-unified';
import { crudValidationCommand } from './commands/crud-validation';
import { dataProviderCommand } from './commands/data-provider';
import { generateCommand } from './commands/generate';
import { i18nCommand } from './commands/i18n';
import { initCommand } from './commands/init';
import { jobsCommand } from './commands/jobs';
import { isZopioProject, logger } from './utils/helpers';
import { pluginManager } from './utils/plugins';

// Create a new Command instance
// @ts-expect-error: Command is imported as a type but used as a value
const program = new Command();

program
  .name('zopio')
  .description('Zopio CLI - Modular B2B Framework Toolkit')
  .version('0.1.0')
  .hook('preAction', (_, actionCommand) => {
    // Skip project check for init command
    if (actionCommand.name() === 'init') {
      return;
    }

    // Check if running in a Zopio project
    if (!isZopioProject() && actionCommand.name() !== 'help') {
      logger.warning('Not running in a Zopio project directory.');
      logger.info(
        'Run "zopio init" to create a new project or navigate to an existing project directory.'
      );
    }
  });

// Add a component command
program
  .command('component')
  .description('Generate a new React component')
  .argument('<n>', 'Component name')
  .option('-i, --i18n', 'Add internationalization support')
  .option('-p, --path <path>', 'Custom path for the component', 'components')
  .action(async (name: string, options: { i18n?: boolean; path: string }) => {
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);
    const componentPath = `${options.path}/${componentName}.tsx`;

    try {
      // Import the component template
      const { default: componentTemplate } = await import(
        './templates/component-template'
      );
      const content = componentTemplate(componentName, {
        withI18n: options.i18n,
      });

      const fs = await import('node:fs');
      const path = await import('node:path');
      const fullPath = path.join(process.cwd(), componentPath);
      const dirPath = path.dirname(fullPath);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(fullPath, content);
      logger.success(
        `Created component: ${chalk.bold(componentName)} at ${chalk.bold(componentPath)}`
      );

      // Create i18n namespace if needed
      if (options.i18n) {
        const namespace = componentName.toLowerCase();
        logger.info(
          `Run 'zopio i18n --create ${namespace}' to create translation files for this component.`
        );
      }
    } catch (error) {
      logger.error(`Failed to create component: ${(error as Error).message}`);
    }
  });

// Add core commands
program.addCommand(initCommand);
program.addCommand(generateCommand);
program.addCommand(i18nCommand);
program.addCommand(configCommand);

// Add extended commands
program.addCommand(jobsCommand);
program.addCommand(crudCommand);
program.addCommand(dataProviderCommand);
program.addCommand(crudSchemaCommand);
program.addCommand(crudUiCommand);
program.addCommand(crudPermissionsCommand);
program.addCommand(crudUnifiedCommand);
program.addCommand(crudValidationCommand);
program.addCommand(crudTestingCommand);

// Add plugin command to manage plugins
program
  .command('plugins')
  .description('Manage CLI plugins')
  .option('-l, --list', 'List all installed plugins')
  .option('-i, --install <n>', 'Install a plugin')
  .action(async (options: { list?: boolean; install?: string }) => {
    if (options.list) {
      logger.title('Installed Plugins');

      // Load plugins to ensure they're registered
      await pluginManager.loadPlugins();

      if (pluginManager.plugins.size === 0) {
        logger.info('No plugins installed.');
      } else {
        for (const [name, plugin] of pluginManager.plugins.entries()) {
          const commandCount = plugin.commands?.length || 0;
          logger.info(`- ${name} (${commandCount} commands)`);
        }
      }
    } else if (options.install) {
      logger.info(`Installing plugin: ${options.install}`);
      logger.warning('This feature is not yet implemented.');
      logger.info(
        'To manually install a plugin, place it in one of these directories:'
      );
      logger.info('- <project>/.zopio/plugins/');
      logger.info('- $HOME/.zopio/plugins/');
    } else {
      program.help();
    }
  });

// Load and register plugin commands
(async () => {
  try {
    const pluginCommands = await pluginManager.loadPlugins();

    // Add all plugin commands to the program
    for (const command of pluginCommands) {
      program.addCommand(command);
    }

    // Parse arguments after plugins are loaded
    program.parse();
  } catch (error) {
    logger.error(`Failed to load plugins: ${(error as Error).message}`);
    // Parse arguments even if plugins fail to load
    program.parse();
  }
})();
