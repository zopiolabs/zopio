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
import { isZopioProject, logger } from '../utils/helpers';

interface CrudUnifiedCommandOptions {
  model?: string;
  fields?: string;
  output?: string;
  api?: boolean;
  ui?: boolean;
  schema?: boolean;
  permissions?: boolean;
  roles?: string;
  theme?: string;
}

/**
 * Parse fields string into an array of field objects
 * @param fieldsStr Fields string in format "name:type:label,age:number:Age"
 * @returns Array of field objects
 */
function parseFields(
  fieldsStr: string
): Array<{ name: string; type: string; label?: string }> {
  if (!fieldsStr) {
    return [];
  }

  return fieldsStr.split(',').map((field) => {
    const parts = field.trim().split(':');
    const name = parts[0].trim();
    const type = parts[1]?.trim() || 'string';
    const label =
      parts[2]?.trim() || name.charAt(0).toUpperCase() + name.slice(1);

    return { name, type, label };
  });
}

/**
 * Parse roles string into an array of role objects
 * @param rolesStr Roles string in format "admin:all,user:read,editor:read,write"
 * @returns Array of role objects
 */
function parseRoles(
  rolesStr: string
): Array<{ role: string; permissions: string[] }> {
  if (!rolesStr) {
    return [];
  }

  return rolesStr.split(',').map((roleStr) => {
    const [role, permissionsStr = 'read'] = roleStr.trim().split(':');
    const permissions = permissionsStr.split(',');

    return {
      role: role.trim(),
      permissions: permissions.map((p) => p.trim()),
    };
  });
}

/**
 * Command to generate a complete CRUD setup for a model
 */
// @ts-ignore: Command is imported as a type but used as a value
export const crudUnifiedCommand = new Command('crud-unified')
  .description('Generate a complete CRUD setup for a model')
  .option('-m, --model <name>', 'Model name')
  .option(
    '-f, --fields <fields>',
    'Fields in format "name:type:label,age:number:Age"'
  )
  .option('-o, --output <directory>', 'Output directory for generated files')
  .option('--api', 'Generate API endpoints')
  .option('--ui', 'Generate UI components')
  .option('--schema', 'Generate JSON schema and TypeScript interface')
  .option('--permissions', 'Generate permissions configuration and middleware')
  .option(
    '-r, --roles <roles>',
    'Roles and permissions in format "admin:all,user:read,editor:read,write"'
  )
  .option('-t, --theme <theme>', 'UI theme (bootstrap, material)', 'bootstrap')
  .action(async (options: CrudUnifiedCommandOptions) => {
    // Check if running in a Zopio project
    if (!isZopioProject()) {
      logger.error(
        'Not a Zopio project. Please run this command in a Zopio project directory.'
      );
      process.exit(1);
    }

    if (!options.model) {
      logger.error(
        'Model name is required. Use --model <name> to specify a model name.'
      );
      crudUnifiedCommand.help();
      return;
    }

    const modelName = options.model;
    const fields = options.fields ? parseFields(options.fields) : [];

    if (fields.length === 0) {
      logger.warning(
        'No fields specified. Use --fields <fields> to specify fields for the model.'
      );
    }

    // Determine output directory
    const outputDir = options.output || process.cwd();

    // If no specific options are provided, generate everything
    const generateAll =
      !options.api && !options.ui && !options.schema && !options.permissions;

    // Import required commands
    const { crudCommand } = await import('./crud');
    const { crudSchemaCommand } = await import('./crud-schema');
    const { crudUiCommand } = await import('./crud-ui');
    const { crudPermissionsCommand } = await import('./crud-permissions');

    logger.title(`Generating CRUD for ${chalk.green(modelName)}`);

    // Generate API endpoints
    if (generateAll || options.api) {
      logger.info('\nGenerating API endpoints...');

      await new Promise<void>((resolve) => {
        crudCommand
          .parseAsync([
            'node',
            'zopio',
            'crud',
            '--model',
            modelName,
            '--fields',
            options.fields || '',
            '--output',
            outputDir,
            '--api-only',
          ])
          .then(() => resolve());
      });
    }

    // Generate JSON schema and TypeScript interface
    if (generateAll || options.schema) {
      logger.info('\nGenerating schema and interface...');

      await new Promise<void>((resolve) => {
        crudSchemaCommand
          .parseAsync([
            'node',
            'zopio',
            'crud-schema',
            '--model',
            modelName,
            '--fields',
            options.fields || '',
            '--output',
            outputDir,
          ])
          .then(() => resolve());
      });
    }

    // Generate UI components
    if (generateAll || options.ui) {
      logger.info('\nGenerating UI components...');

      await new Promise<void>((resolve) => {
        crudUiCommand
          .parseAsync([
            'node',
            'zopio',
            'crud-ui',
            '--model',
            modelName,
            '--fields',
            options.fields || '',
            '--output',
            outputDir,
            '--theme',
            options.theme || 'bootstrap',
          ])
          .then(() => resolve());
      });
    }

    // Generate permissions
    if (generateAll || options.permissions) {
      logger.info('\nGenerating permissions...');

      await new Promise<void>((resolve) => {
        crudPermissionsCommand
          .parseAsync([
            'node',
            'zopio',
            'crud-permissions',
            '--model',
            modelName,
            '--roles',
            options.roles || '',
            '--output',
            outputDir,
          ])
          .then(() => resolve());
      });
    }

    logger.success(
      `\nCRUD generation for ${chalk.green(modelName)} completed successfully!`
    );
    logger.info(
      `\nYou now have a complete CRUD setup for your ${modelName} model.`
    );
  });
