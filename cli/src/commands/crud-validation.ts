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

interface CrudValidationCommandOptions {
  model?: string;
  fields?: string;
  output?: string;
  library?: string;
}

/**
 * Parse fields string into an array of field objects
 * @param fieldsStr Fields string in format "name:type,age:number"
 * @returns Array of field objects
 */
/**
 * Parse a single validation rule
 * @param rule The validation rule string (e.g., 'required', 'min=5')
 * @param validationRules Object to store parsed rules
 */
function parseValidationRule(
  rule: string,
  validationRules: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  }
): void {
  if (rule === 'required') {
    validationRules.required = true;
  } else if (rule.startsWith('min=')) {
    validationRules.min = Number.parseInt(rule.split('=')[1], 10);
  } else if (rule.startsWith('max=')) {
    validationRules.max = Number.parseInt(rule.split('=')[1], 10);
  } else if (rule.startsWith('pattern=')) {
    validationRules.pattern = rule.split('=')[1];
  }
}

/**
 * Parse validation rules from a string
 * @param rulesStr The rules string (e.g., 'required|min=5|max=100')
 * @returns Object with parsed validation rules
 */
function parseValidationRules(rulesStr?: string): {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
} {
  const validationRules: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  } = {};

  if (!rulesStr) {
    return validationRules;
  }

  const rules = rulesStr.split('|');
  for (const rule of rules) {
    parseValidationRule(rule, validationRules);
  }

  return validationRules;
}

/**
 * Parse a single field definition
 * @param fieldStr The field string (e.g., 'name:string:required|min=2')
 * @returns Parsed field object
 */
function parseField(fieldStr: string): {
  name: string;
  type: string;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
} {
  const parts = fieldStr.trim().split(':');
  const name = parts[0].trim();
  const type = parts[1]?.trim() || 'string';
  const validationRules = parseValidationRules(parts[2]);

  return {
    name,
    type,
    ...validationRules,
  };
}

/**
 * Parse fields string into an array of field objects
 * @param fieldsStr Fields string in format "name:string:required|min=2,age:number:min=0"
 * @returns Array of field objects
 */
function parseFields(fieldsStr: string): Array<{
  name: string;
  type: string;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}> {
  if (!fieldsStr) {
    return [];
  }

  return fieldsStr.split(',').map(parseField);
}

/**
 * Get the Yup type based on field type
 * @param fieldType The field type
 * @returns Yup type as a string
 */
function getYupType(fieldType: string): string {
  switch (fieldType.toLowerCase()) {
    case 'string':
      return 'string()';
    case 'number':
    case 'integer':
      return 'number()';
    case 'boolean':
      return 'boolean()';
    case 'date':
      return 'date()';
    case 'array':
      return 'array()';
    case 'object':
      return 'object()';
    default:
      return 'string()';
  }
}

/**
 * Generate min validation rule based on field type
 * @param field The field object
 * @returns Validation rule string or undefined
 */
function generateMinValidation(field: { type: string; min?: number }):
  | string
  | undefined {
  if (field.min === undefined) {
    return undefined;
  }

  switch (field.type) {
    case 'string':
      return `min(${field.min}, 'Must be at least ${field.min} characters')`;
    case 'number':
    case 'integer':
      return `min(${field.min}, 'Must be at least ${field.min}')`;
    case 'array':
      return `min(${field.min}, 'Must have at least ${field.min} items')`;
    default:
      return undefined;
  }
}

/**
 * Generate max validation rule based on field type
 * @param field The field object
 * @returns Validation rule string or undefined
 */
function generateMaxValidation(field: { type: string; max?: number }):
  | string
  | undefined {
  if (field.max === undefined) {
    return undefined;
  }

  switch (field.type) {
    case 'string':
      return `max(${field.max}, 'Must be at most ${field.max} characters')`;
    case 'number':
    case 'integer':
      return `max(${field.max}, 'Must be at most ${field.max}')`;
    case 'array':
      return `max(${field.max}, 'Must have at most ${field.max} items')`;
    default:
      return undefined;
  }
}

/**
 * Generate Yup validation rules for a field
 * @param field The field object
 * @returns Array of validation rule strings
 */
function generateYupFieldValidations(field: {
  name: string;
  type: string;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}): string[] {
  const validations: string[] = [];

  // Add required validation
  if (field.required) {
    validations.push('required()');
  }

  // Add min validation
  const minValidation = generateMinValidation(field);
  if (minValidation) {
    validations.push(minValidation);
  }

  // Add max validation
  const maxValidation = generateMaxValidation(field);
  if (maxValidation) {
    validations.push(maxValidation);
  }

  // Add pattern validation
  if (field.pattern) {
    validations.push(`matches(/${field.pattern}/, 'Invalid format')`);
  }

  return validations;
}

/**
 * Generate Yup validation schema
 * @param model Model name
 * @param fields Array of field objects
 * @returns Yup validation schema as a string
 */
function generateYupSchema(
  model: string,
  fields: Array<{
    name: string;
    type: string;
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  }>
): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);

  // Generate validation rules for each field
  const validationRules = fields
    .map((field) => {
      const yupType = getYupType(field.type);
      const validations = generateYupFieldValidations(field);

      return `  ${field.name}: yup.${yupType}${validations.length > 0 ? `.${validations.join('.')}` : ''}`;
    })
    .join(',\n');

  return `import * as yup from 'yup';

/**
 * ${modelName} Validation Schema
 */
export const ${modelName}ValidationSchema = yup.object().shape({
${validationRules}
});
`;
}

/**
 * Get the Zod type based on field type
 * @param fieldType The field type
 * @returns Zod type as a string
 */
function getZodType(fieldType: string): string {
  switch (fieldType.toLowerCase()) {
    case 'string':
      return 'z.string()';
    case 'number':
    case 'integer':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    case 'date':
      return 'z.date()';
    case 'array':
      return 'z.array(z.any())';
    case 'object':
      return 'z.object({})';
    default:
      return 'z.string()';
  }
}

/**
 * Generate Zod validation rules for a field
 * @param field The field object
 * @returns Array of validation rule strings
 */
function generateZodFieldValidations(field: {
  name: string;
  type: string;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}): string[] {
  const validations: string[] = [];

  // Add required/optional validation
  if (!field.required) {
    validations.push('optional()');
  }

  // Add min validation
  if (field.min !== undefined) {
    if (field.type === 'string') {
      validations.push(
        `min(${field.min}, { message: 'Must be at least ${field.min} characters' })`
      );
    } else if (field.type === 'number' || field.type === 'integer') {
      validations.push(
        `min(${field.min}, { message: 'Must be at least ${field.min}' })`
      );
    } else if (field.type === 'array') {
      validations.push(
        `min(${field.min}, { message: 'Must have at least ${field.min} items' })`
      );
    }
  }

  // Add max validation
  if (field.max !== undefined) {
    if (field.type === 'string') {
      validations.push(
        `max(${field.max}, { message: 'Must be at most ${field.max} characters' })`
      );
    } else if (field.type === 'number' || field.type === 'integer') {
      validations.push(
        `max(${field.max}, { message: 'Must be at most ${field.max}' })`
      );
    } else if (field.type === 'array') {
      validations.push(
        `max(${field.max}, { message: 'Must have at most ${field.max} items' })`
      );
    }
  }

  // Add pattern validation
  if (field.pattern) {
    validations.push(
      `regex(/${field.pattern}/, { message: 'Invalid format' })`
    );
  }

  return validations;
}

/**
 * Generate Zod validation schema
 * @param model Model name
 * @param fields Array of field objects
 * @returns Zod validation schema as a string
 */
function generateZodSchema(
  model: string,
  fields: Array<{
    name: string;
    type: string;
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  }>
): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);

  // Generate validation rules for each field
  const validationRules = fields
    .map((field) => {
      const zodType = getZodType(field.type);
      const validations = generateZodFieldValidations(field);

      return `  ${field.name}: ${zodType}${validations.length > 0 ? `.${validations.join('.')}` : ''}`;
    })
    .join(',\n');

  return `import { z } from 'zod';

/**
 * ${modelName} Validation Schema
 */
export const ${modelName}Schema = z.object({
${validationRules}
});

/**
 * ${modelName} Type
 */
export type ${modelName} = z.infer<typeof ${modelName}Schema>;

export default ${modelName}Schema;
`;
}

/**
 * Determine required imports for class-validator based on field types and validations
 * @param fields Array of field objects
 * @returns Set of import names
 */
function getClassValidatorImports(
  fields: Array<{
    name: string;
    type: string;
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  }>
): Set<string> {
  const imports = new Set<string>();

  // Add imports based on field types and validations
  for (const field of fields) {
    // Required validation
    if (field.required) {
      imports.add('IsNotEmpty');
    } else {
      imports.add('IsOptional');
    }

    // Type validation
    switch (field.type.toLowerCase()) {
      case 'string':
        imports.add('IsString');
        break;
      case 'number':
      case 'integer':
        imports.add('IsNumber');
        if (field.type === 'integer') {
          imports.add('IsInt');
        }
        break;
      case 'boolean':
        imports.add('IsBoolean');
        break;
      case 'date':
        imports.add('IsDate');
        break;
      case 'array':
        imports.add('IsArray');
        if (field.min !== undefined) {
          imports.add('ArrayMinSize');
        }
        if (field.max !== undefined) {
          imports.add('ArrayMaxSize');
        }
        break;
      case 'object':
        imports.add('IsObject');
        break;
      default:
        imports.add('IsString');
    }

    // Min/max validations
    if (
      field.min !== undefined &&
      (field.type === 'string' || field.type === 'number')
    ) {
      imports.add('Min');
    }
    if (
      field.max !== undefined &&
      (field.type === 'string' || field.type === 'number')
    ) {
      imports.add('Max');
    }

    // Pattern validation
    if (field.pattern) {
      imports.add('Matches');
    }
  }

  return imports;
}

/**
 * Generate type-specific decorators for a field
 * @param fieldType The field type
 * @returns Array of type decorator strings
 */
function getTypeDecorators(fieldType: string): string[] {
  const decorators: string[] = [];
  switch (fieldType.toLowerCase()) {
    case 'string':
      decorators.push('@IsString()');
      break;
    case 'number':
      decorators.push('@IsNumber()');
      break;
    case 'integer':
      decorators.push('@IsNumber()');
      decorators.push('@IsInt()');
      break;
    case 'boolean':
      decorators.push('@IsBoolean()');
      break;
    case 'date':
      decorators.push('@IsDate()');
      break;
    case 'array':
      decorators.push('@IsArray()');
      break;
    case 'object':
      decorators.push('@IsObject()');
      break;
    default:
      decorators.push('@IsString()');
  }
  return decorators;
}

/**
 * Generate min validation decorators for a field
 * @param field The field object
 * @returns Min decorator string or empty string if not applicable
 */
function getMinDecorator(field: { type: string; min?: number }): string {
  if (field.min === undefined) {
    return '';
  }

  if (field.type === 'string') {
    return `@MinLength(${field.min}, { message: 'Must be at least ${field.min} characters' })`;
  }

  if (field.type === 'number' || field.type === 'integer') {
    return `@Min(${field.min}, { message: 'Must be at least ${field.min}' })`;
  }

  if (field.type === 'array') {
    return `@ArrayMinSize(${field.min}, { message: 'Must have at least ${field.min} items' })`;
  }

  return '';
}

/**
 * Generate max validation decorators for a field
 * @param field The field object
 * @returns Max decorator string or empty string if not applicable
 */
function getMaxDecorator(field: { type: string; max?: number }): string {
  if (field.max === undefined) {
    return '';
  }

  if (field.type === 'string') {
    return `@MaxLength(${field.max}, { message: 'Must be at most ${field.max} characters' })`;
  }

  if (field.type === 'number' || field.type === 'integer') {
    return `@Max(${field.max}, { message: 'Must be at most ${field.max}' })`;
  }

  if (field.type === 'array') {
    return `@ArrayMaxSize(${field.max}, { message: 'Must have at most ${field.max} items' })`;
  }

  return '';
}

/**
 * Generate min/max validation decorators for a field
 * @param field The field object
 * @returns Array of min/max decorator strings
 */
function getMinMaxDecorators(field: {
  type: string;
  min?: number;
  max?: number;
}): string[] {
  const decorators: string[] = [];

  const minDecorator = getMinDecorator(field);
  if (minDecorator) {
    decorators.push(minDecorator);
  }

  const maxDecorator = getMaxDecorator(field);
  if (maxDecorator) {
    decorators.push(maxDecorator);
  }

  return decorators;
}

/**
 * Generate decorators for a field
 * @param field The field object
 * @returns Array of decorator strings
 */
function generateFieldDecorators(field: {
  name: string;
  type: string;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}): string[] {
  const decorators: string[] = [];

  // Required/optional decorator
  if (field.required) {
    decorators.push('@IsNotEmpty()');
  } else {
    decorators.push('@IsOptional()');
  }

  // Add type decorators
  decorators.push(...getTypeDecorators(field.type));

  // Add min/max decorators
  decorators.push(...getMinMaxDecorators(field));

  // Pattern validation
  if (field.pattern) {
    decorators.push(
      `@Matches(/${field.pattern}/, { message: 'Invalid format' })`
    );
  }

  return decorators;
}

/**
 * Generate class-validator decorators
 * @param model Model name
 * @param fields Array of field objects
 * @returns Class with validation decorators as a string
 */
function generateClassValidators(
  model: string,
  fields: Array<{
    name: string;
    type: string;
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  }>
): string {
  const modelName = model.charAt(0).toUpperCase() + model.slice(1);

  // Collect required imports
  const imports = getClassValidatorImports(fields);

  const importStatement = `import { ${Array.from(imports).join(', ')} } from 'class-validator';`;

  // Generate class properties with decorators
  const classProperties = fields
    .map((field) => {
      // Use the helper function to generate all decorators
      const decorators = generateFieldDecorators(field);

      // Map field type to TypeScript type and create property declaration
      return `  ${decorators.join('\n  ')}\n  ${field.name}: ${mapTypeToTypeScript(field.type)};`;
    })
    .join('\n\n');

  return `${importStatement}

/**
 * ${modelName} DTO with validation decorators
 */
export class ${modelName}Dto {
${classProperties}
}
`;
}

/**
 * Map field type to TypeScript type
 * @param type Field type
 * @returns TypeScript type
 */
function mapTypeToTypeScript(type: string): string {
  switch (type.toLowerCase()) {
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'Date';
    case 'array':
      return 'any[]';
    case 'object':
      return 'Record<string, any>';
    default:
      return 'string';
  }
}

/**
 * Command to generate validation schemas for a model
 */
// @ts-ignore: Command is imported as a type but used as a value
export const crudValidationCommand = new Command('crud-validation')
  .description('Generate validation schemas for a model')
  .option('-m, --model <name>', 'Model name')
  .option(
    '-f, --fields <fields>',
    'Fields in format "name:type:validations,age:number:required|min=18"'
  )
  .option('-o, --output <directory>', 'Output directory for validation schemas')
  .option(
    '-l, --library <library>',
    'Validation library (yup, zod, class-validator)',
    'zod'
  )
  .action((options: CrudValidationCommandOptions) => {
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
      crudValidationCommand.help();
      return;
    }

    const modelName = options.model;
    const fields = options.fields ? parseFields(options.fields) : [];
    const library = options.library || 'zod';

    if (fields.length === 0) {
      logger.warning(
        'No fields specified. Use --fields <fields> to specify fields for the model.'
      );
    }

    // Determine output directory
    const outputDir =
      options.output || path.join(process.cwd(), 'src', 'validations');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      logger.info(`Created output directory: ${outputDir}`);
    }

    // Generate validation schema based on the selected library
    let schema = '';
    let fileName = '';

    switch (library.toLowerCase()) {
      case 'yup': {
        schema = generateYupSchema(modelName, fields);
        fileName = `${modelName.toLowerCase()}.yup.validation.ts`;
        break;
      }
      case 'zod': {
        schema = generateZodSchema(modelName, fields);
        fileName = `${modelName.toLowerCase()}.zod.validation.ts`;
        break;
      }
      case 'class-validator': {
        schema = generateClassValidators(modelName, fields);
        fileName = `${modelName.toLowerCase()}.dto.ts`;
        break;
      }
      default: {
        schema = generateZodSchema(modelName, fields);
        fileName = `${modelName.toLowerCase()}.zod.validation.ts`;
      }
    }

    const schemaPath = path.join(outputDir, fileName);

    fs.writeFileSync(schemaPath, schema);
    logger.success(
      `Generated ${library} validation schema: ${chalk.green(schemaPath)}`
    );

    logger.info(
      '\nYou can now use this validation schema in your application.'
    );
    logger.info(
      `Import it with: import { ${modelName}ValidationSchema } from './validations/${fileName.replace('.ts', '')}';`
    );
  });
