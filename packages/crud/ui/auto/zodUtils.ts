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
// Using a type import to avoid runtime dependency issues if zod isn't installed
import type { z } from 'zod';
import type { FieldDefinition, FieldType, ValidationRule } from '../types';

/**
 * Maps Zod schema types to FieldType
 */
export function getFieldTypeFromZodType(zodType: z.ZodTypeAny): FieldType {
  if (zodType instanceof z.ZodString) {
    if (zodType._def.checks) {
      for (const check of zodType._def.checks) {
        if (check.kind === 'email') return 'email';
        if (check.kind === 'url') return 'url';
      }
    }
    return 'string';
  }
  if (zodType instanceof z.ZodNumber) return 'number';
  if (zodType instanceof z.ZodBoolean) return 'boolean';
  if (zodType instanceof z.ZodDate) return 'date';
  if (zodType instanceof z.ZodEnum) return 'enum';
  if (zodType instanceof z.ZodNativeEnum) return 'enum';
  if (zodType instanceof z.ZodArray) return 'multiselect';
  if (zodType instanceof z.ZodObject) return 'json';

  // Handle optional and nullable types
  if (zodType instanceof z.ZodOptional || zodType instanceof z.ZodNullable) {
    return getFieldTypeFromZodType(zodType.unwrap());
  }

  // Default to string for unknown types
  return 'string';
}

/**
 * Extracts validation rules from a Zod schema
 */
export function extractValidationRules(
  zodType: z.ZodTypeAny
): ValidationRule[] {
  const rules: ValidationRule[] = [];

  // Handle required validation
  if (
    !(zodType instanceof z.ZodOptional) &&
    !(zodType instanceof z.ZodNullable)
  ) {
    rules.push({
      type: 'required',
      message: 'This field is required',
    });
  }

  // Unwrap optional/nullable types
  let unwrappedType = zodType;
  if (zodType instanceof z.ZodOptional || zodType instanceof z.ZodNullable) {
    unwrappedType = zodType.unwrap();
  }

  // Extract string validations
  if (unwrappedType instanceof z.ZodString && unwrappedType._def.checks) {
    for (const check of unwrappedType._def.checks) {
      if (check.kind === 'min') {
        rules.push({
          type: 'minLength',
          value: check.value,
          message: `Must be at least ${check.value} characters`,
        });
      }
      if (check.kind === 'max') {
        rules.push({
          type: 'maxLength',
          value: check.value,
          message: `Must be at most ${check.value} characters`,
        });
      }
      if (check.kind === 'email') {
        rules.push({
          type: 'pattern',
          value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
          message: 'Must be a valid email address',
        });
      }
      if (check.kind === 'url') {
        rules.push({
          type: 'pattern',
          value:
            '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$',
          message: 'Must be a valid URL',
        });
      }
      if (check.kind === 'regex') {
        rules.push({
          type: 'pattern',
          value: check.regex.source,
          message: 'Must match the required pattern',
        });
      }
    }
  }

  // Extract number validations
  if (unwrappedType instanceof z.ZodNumber && unwrappedType._def.checks) {
    for (const check of unwrappedType._def.checks) {
      if (check.kind === 'min') {
        rules.push({
          type: 'min',
          value: check.value,
          message: `Must be at least ${check.value}`,
        });
      }
      if (check.kind === 'max') {
        rules.push({
          type: 'max',
          value: check.value,
          message: `Must be at most ${check.value}`,
        });
      }
    }
  }

  return rules;
}

/**
 * Extracts enum options from a Zod enum schema
 */
export function extractEnumOptions(
  zodType:
    | z.ZodEnum<[string, ...string[]]>
    | z.ZodNativeEnum<Record<string, string | number>>
) {
  if (zodType instanceof z.ZodEnum) {
    return zodType._def.values.map((value: string) => ({
      label: value,
      value,
    }));
  }

  if (zodType instanceof z.ZodNativeEnum) {
    const enumObject = zodType._def.values;
    return Object.keys(enumObject)
      .filter((key) => !Number.isNaN(Number(key)) && isNaN(Number(key))) // Filter out numeric keys
      .map((key) => ({
        label: key,
        value: enumObject[key],
      }));
  }

  return [];
}

/**
 * Converts a Zod schema to field definitions for AutoForm
 */
export function zodSchemaToFieldDefinitions(
  schema: z.ZodObject<Record<string, z.ZodTypeAny>>,
  options: {
    labels?: Record<string, string>;
    descriptions?: Record<string, string>;
    placeholders?: Record<string, string>;
    fieldOrder?: string[];
    hiddenFields?: string[];
    readOnlyFields?: string[];
  } = {}
): FieldDefinition[] {
  const { shape } = schema._def;
  const fieldNames = options.fieldOrder || Object.keys(shape);

  return fieldNames
    .filter((name) => !options.hiddenFields?.includes(name))
    .map((name) => {
      const zodType = shape[name];
      const fieldType = getFieldTypeFromZodType(zodType);
      const validationRules = extractValidationRules(zodType);

      const field: FieldDefinition = {
        name,
        type: fieldType,
        label: options.labels?.[name] || name,
        description: options.descriptions?.[name],
        placeholder: options.placeholders?.[name],
        validation: validationRules,
        required: validationRules.some((rule) => rule.type === 'required'),
        readOnly: options.readOnlyFields?.includes(name),
      };

      // Add enum options if applicable
      let unwrappedType = zodType;
      if (
        zodType instanceof z.ZodOptional ||
        zodType instanceof z.ZodNullable
      ) {
        unwrappedType = zodType.unwrap();
      }

      if (
        unwrappedType instanceof z.ZodEnum ||
        unwrappedType instanceof z.ZodNativeEnum
      ) {
        field.options = extractEnumOptions(unwrappedType);
      }

      return field;
    });
}

/**
 * Validates form data against a Zod schema
 * @returns An object with field names as keys and error messages as values
 */
export function validateWithZod(
  schema: z.ZodObject<Record<string, z.ZodTypeAny>>,
  data: Record<string, unknown>
): Record<string, string> {
  try {
    schema.parse(data);
    return {}; // No errors
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};

      for (const issue of error.errors) {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      }

      return errors;
    }

    return { _form: 'Invalid form data' };
  }
}
