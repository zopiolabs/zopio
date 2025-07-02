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
import { z } from 'zod';
import type { ViewSchema } from '../renderers/types';

// Field definition schema
const fieldDefinitionSchema = z.object({
  label: z.string().optional(),
  type: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  hidden: z.union([z.boolean(), z.function()]).optional(),
  readOnly: z.union([z.boolean(), z.function()]).optional(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
      message: z.string().optional(),
    })
    .optional(),
});

// Field definitions schema
const fieldDefinitionsSchema = z.record(z.string(), fieldDefinitionSchema);

// Form section schema
const formSectionSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(z.string()),
  columns: z
    .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
    .optional(),
});

// Form tab schema
const formTabSchema = z.object({
  title: z.string(),
  sections: z.array(formSectionSchema),
});

// Form layout schema
const formLayoutSchema = z.object({
  tabs: z.array(formTabSchema).optional(),
  sections: z.array(formSectionSchema).optional(),
});

// Base view schema
const baseViewSchema = z.object({
  schema: z.string(),
  fields: fieldDefinitionsSchema.optional(),
  i18nNamespace: z.string().optional(),
});

// Form view schema
const formViewSchema = baseViewSchema.extend({
  type: z.literal('form'),
  layout: formLayoutSchema.optional(),
  submitAction: z.string().optional(),
  resetLabel: z.string().optional(),
  submitLabel: z.string().optional(),
  showReset: z.boolean().optional(),
});

// Table column schema
const tableColumnSchema = z.object({
  key: z.string(),
  title: z.string(),
  width: z.union([z.number(), z.string()]).optional(),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  hidden: z.boolean().optional(),
  render: z.string().optional(),
});

// Table view schema
const tableViewSchema = baseViewSchema.extend({
  type: z.literal('table'),
  columns: z.array(tableColumnSchema),
  pagination: z
    .object({
      defaultPageSize: z.number().optional(),
      pageSizeOptions: z.array(z.number()).optional(),
    })
    .optional(),
  defaultSort: z
    .object({
      column: z.string(),
      direction: z.union([z.literal('asc'), z.literal('desc')]),
    })
    .optional(),
  rowActions: z.array(z.string()).optional(),
  bulkActions: z.array(z.string()).optional(),
  selectable: z.boolean().optional(),
});

// Detail view schema
const detailViewSchema = baseViewSchema.extend({
  type: z.literal('detail'),
  layout: formLayoutSchema.optional(),
  actions: z.array(z.string()).optional(),
});

// Audit log view schema
const auditLogViewSchema = baseViewSchema.extend({
  type: z.literal('audit-log'),
  entityIdField: z.string().optional(),
  showUser: z.boolean().optional(),
  showTimestamp: z.boolean().optional(),
  showAction: z.boolean().optional(),
});

// Import view schema
const importViewSchema = baseViewSchema.extend({
  type: z.literal('import'),
  fileTypes: z.array(z.string()).optional(),
  maxFileSize: z.number().optional(),
  templateUrl: z.string().optional(),
  instructions: z.string().optional(),
});

// Export view schema
const exportViewSchema = baseViewSchema.extend({
  type: z.literal('export'),
  formats: z
    .array(
      z.union([
        z.literal('csv'),
        z.literal('xlsx'),
        z.literal('json'),
        z.literal('pdf'),
      ])
    )
    .optional(),
  defaultFormat: z
    .union([
      z.literal('csv'),
      z.literal('xlsx'),
      z.literal('json'),
      z.literal('pdf'),
    ])
    .optional(),
  includeHeaders: z.boolean().optional(),
  fileName: z.string().optional(),
});

// Union of all view schemas
const viewSchemaValidator = z.discriminatedUnion('type', [
  formViewSchema,
  tableViewSchema,
  detailViewSchema,
  auditLogViewSchema,
  importViewSchema,
  exportViewSchema,
]);

/**
 * Validates a view schema against the schema definition
 * @param schema The view schema to validate
 * @returns A zod validation result
 */
export function validateViewSchema(
  schema: unknown
): z.SafeParseReturnType<unknown, ViewSchema> {
  return viewSchemaValidator.safeParse(schema);
}

/**
 * Safe wrapper for validateViewSchema that returns a consistent result format
 * @param schema The view schema to validate
 * @returns An object with success flag and either the validated data or error
 */
export function safeValidateViewSchema(schema: unknown): {
  success: boolean;
  data?: ViewSchema;
  error?: z.ZodError;
} {
  const result = validateViewSchema(schema);

  if (result.success) {
    return {
      success: true,
      data: result.data as ViewSchema,
    };
  }

  return {
    success: false,
    error: result.error,
  };
}
