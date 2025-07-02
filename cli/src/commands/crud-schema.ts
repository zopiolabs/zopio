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
// Use ES module import for commander
import { Command } from 'commander';
import { isZopioProject, logger } from '../utils/helpers';

interface CrudSchemaCommandOptions {
  model?: string;
  output?: string;
  fields?: string;
}

/**
 * Parse fields string into an array of field objects
 * @param fieldsStr Fields string in format "name:type,age:number"
 * @returns Array of field objects
 */
function parseFields(fieldsStr: string): Array<{ name: string; type: string }> {
  if (!fieldsStr) {
    return [];
  }

  return fieldsStr.split(',').map((field) => {
    const [name, type = 'string'] = field.trim().split(':');
    return { name: name.trim(), type: type.trim() };
  });
}

/**
 * Generate a JSON schema for a model
 * @param model Model name
 * @param fields Array of field objects
 * @returns JSON schema as a string
 */
function generateJsonSchema(
  model: string,
  fields: Array<{ name: string; type: string }>
): string {
  const schemaObj = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: model,
    type: 'object',
    required: fields.map((field) => field.name),
    properties: fields.reduce(
      (props, field) => {
        let propType: Record<string, unknown> = {};

        switch (field.type.toLowerCase()) {
          case 'string':
            propType = { type: 'string' };
            break;
          case 'number':
          case 'integer':
            propType = { type: 'number' };
            break;
          case 'boolean':
            propType = { type: 'boolean' };
            break;
          case 'date':
            propType = {
              type: 'string',
              format: 'date-time',
            };
            break;
          case 'array':
            propType = {
              type: 'array',
              items: { type: 'string' },
            };
            break;
          case 'object':
            propType = {
              type: 'object',
              properties: {},
            };
            break;
          default:
            propType = { type: 'string' };
        }

        props[field.name] = propType;
        return props;
      },
      {} as Record<string, Record<string, unknown>>
    ),
  };

  return JSON.stringify(schemaObj, null, 2);
}

/**
 * Generate a TypeScript interface for a model
 * @param model Model name
 * @param fields Array of field objects
 * @returns TypeScript interface as a string
 */
function generateTypeScriptInterface(
  model: string,
  fields: Array<{ name: string; type: string }>
): string {
  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'number',
    integer: 'number',
    boolean: 'boolean',
    date: 'Date',
    array: 'string[]',
    object: 'Record<string, unknown>',
  };

  const fieldDefinitions = fields
    .map((field) => {
      const tsType = typeMap[field.type.toLowerCase()] || 'string';
      return `  ${field.name}: ${tsType};`;
    })
    .join('\n');

  return `/**
 * ${model} model interface
 */
export interface ${model} {
${fieldDefinitions}
}
`;
}

/**
 * Command to generate CRUD schema for a model
 */
// @ts-ignore: Command is imported as a type but used as a value
export const crudSchemaCommand = new Command('crud-schema')
  .description('Generate JSON schema and TypeScript interface for a model')
  .option('-m, --model <name>', 'Model name')
  .option('-f, --fields <fields>', 'Fields in format "name:type,age:number"')
  .option('-o, --output <directory>', 'Output directory for schema files')
  .action(async (options: CrudSchemaCommandOptions) => {
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
      crudSchemaCommand.help();
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
    const outputDir =
      options.output || path.join(process.cwd(), 'src', 'models');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      await fs.promises.mkdir(outputDir, { recursive: true });
      logger.info(`Created output directory: ${chalk.green(outputDir)}`);
    }

    // Generate JSON schema
    const jsonSchema = generateJsonSchema(modelName, fields);
    const schemaPath = path.join(
      outputDir,
      `${modelName.toLowerCase()}.schema.json`
    );

    await fs.promises.writeFile(schemaPath, jsonSchema);
    logger.success(`Generated JSON schema: ${chalk.green(schemaPath)}`);

    // Generate TypeScript interface
    const tsInterface = generateTypeScriptInterface(modelName, fields);
    const interfacePath = path.join(
      outputDir,
      `${modelName.toLowerCase()}.model.ts`
    );

    await fs.promises.writeFile(interfacePath, tsInterface);
    logger.success(
      `Generated TypeScript interface: ${chalk.green(interfacePath)}`
    );

    logger.info(
      '\nYou can now use these files for validation and type checking in your application.'
    );
  });
