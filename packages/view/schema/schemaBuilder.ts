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
import type {
  DetailViewSchema,
  FieldDefinition,
  FormLayout,
  FormViewSchema,
  TableColumn,
  TableViewSchema,
  ViewSchema,
} from '../engine/renderers/types';

/**
 * Create a new form view schema
 * @param options Form view options
 * @returns A form view schema
 */
export function createFormView(options: {
  schema: string;
  fields?: Record<string, FieldDefinition>;
  layout?: FormLayout;
  i18nNamespace?: string;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
}): FormViewSchema {
  return {
    type: 'form',
    schema: options.schema,
    fields: options.fields || {},
    layout: options.layout,
    i18nNamespace: options.i18nNamespace,
    submitLabel: options.submitLabel,
    resetLabel: options.resetLabel,
    showReset: options.showReset,
  };
}

/**
 * Create a new table view schema
 * @param options Table view options
 * @returns A table view schema
 */
export function createTableView(options: {
  schema: string;
  columns: TableColumn[];
  fields?: Record<string, FieldDefinition>;
  i18nNamespace?: string;
  pagination?: {
    defaultPageSize?: number;
    pageSizeOptions?: number[];
  };
  defaultSort?: {
    column: string;
    direction: 'asc' | 'desc';
  };
  rowActions?: string[];
  bulkActions?: string[];
  selectable?: boolean;
}): TableViewSchema {
  return {
    type: 'table',
    schema: options.schema,
    columns: options.columns,
    fields: options.fields || {},
    i18nNamespace: options.i18nNamespace,
    pagination: options.pagination,
    defaultSort: options.defaultSort,
    rowActions: options.rowActions,
    bulkActions: options.bulkActions,
    selectable: options.selectable,
  };
}

/**
 * Create a new detail view schema
 * @param options Detail view options
 * @returns A detail view schema
 */
export function createDetailView(options: {
  schema: string;
  fields?: Record<string, FieldDefinition>;
  layout?: FormLayout;
  i18nNamespace?: string;
  actions?: string[];
}): DetailViewSchema {
  return {
    type: 'detail',
    schema: options.schema,
    fields: options.fields || {},
    layout: options.layout,
    i18nNamespace: options.i18nNamespace,
    actions: options.actions,
  };
}

/**
 * Add a field to a view schema
 * @param schema The view schema to modify
 * @param fieldName The name of the field to add
 * @param fieldDef The field definition
 * @returns A new view schema with the field added
 */
export function addField(
  schema: ViewSchema,
  fieldName: string,
  fieldDef: FieldDefinition
): ViewSchema {
  const newSchema = { ...schema };

  if (!newSchema.fields) {
    newSchema.fields = {};
  }

  newSchema.fields[fieldName] = fieldDef;

  return newSchema;
}

/**
 * Remove a field from a view schema
 * @param schema The view schema to modify
 * @param fieldName The name of the field to remove
 * @returns A new view schema with the field removed
 */
export function removeField(schema: ViewSchema, fieldName: string): ViewSchema {
  const newSchema = { ...schema };

  if (!newSchema.fields) {
    return newSchema;
  }

  const { [fieldName]: _, ...remainingFields } = newSchema.fields;
  newSchema.fields = remainingFields;

  return newSchema;
}

/**
 * Update a field in a view schema
 * @param schema The view schema to modify
 * @param fieldName The name of the field to update
 * @param updates The updates to apply to the field
 * @returns A new view schema with the field updated
 */
export function updateField(
  schema: ViewSchema,
  fieldName: string,
  updates: Partial<FieldDefinition>
): ViewSchema {
  const newSchema = { ...schema };

  if (!newSchema.fields || !newSchema.fields[fieldName]) {
    return newSchema;
  }

  newSchema.fields[fieldName] = {
    ...newSchema.fields[fieldName],
    ...updates,
  };

  return newSchema;
}
