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
/**
 * Base field definition shared across all view types
 */
export type FieldDefinition = {
  label?: string;
  type?: string;
  required?: boolean;
  options?: string[];
  hidden?: boolean | ((data: Record<string, unknown>) => boolean);
  readOnly?: boolean | ((data: Record<string, unknown>) => boolean);
  description?: string;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
};

/**
 * Field definitions for a schema
 */
export type FieldDefinitions = {
  [field: string]: FieldDefinition;
};

/**
 * Base view schema properties shared by all view types
 */
export type BaseViewSchema = {
  schema: string;
  fields?: FieldDefinitions;
  i18nNamespace?: string;
};

/**
 * Form section definition for layout
 */
export type FormSection = {
  title?: string;
  description?: string;
  fields: string[];
  columns?: 1 | 2 | 3 | 4;
};

/**
 * Tab definition for form layout
 */
export type FormTab = {
  title: string;
  sections: FormSection[];
};

/**
 * Form layout configuration
 */
export type FormLayout = {
  tabs?: FormTab[];
  sections?: FormSection[];
};

/**
 * Form view schema
 */
export type FormViewSchema = BaseViewSchema & {
  type: 'form';
  layout?: FormLayout;
  submitAction?: string;
  resetLabel?: string;
  submitLabel?: string;
  showReset?: boolean;
};

/**
 * Table column definition
 */
export type TableColumn = {
  key: string;
  title: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  render?: string; // Name of a render function
};

/**
 * Table view schema
 */
export type TableViewSchema = BaseViewSchema & {
  type: 'table';
  columns: TableColumn[];
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
};

/**
 * Detail view schema
 */
export type DetailViewSchema = BaseViewSchema & {
  type: 'detail';
  layout?: FormLayout;
  actions?: string[];
};

/**
 * Audit log view schema
 */
export type AuditLogViewSchema = BaseViewSchema & {
  type: 'audit-log';
  entityIdField?: string;
  showUser?: boolean;
  showTimestamp?: boolean;
  showAction?: boolean;
};

/**
 * Import view schema
 */
export type ImportViewSchema = BaseViewSchema & {
  type: 'import';
  fileTypes?: string[];
  maxFileSize?: number;
  templateUrl?: string;
  instructions?: string;
};

/**
 * Export view schema
 */
export type ExportViewSchema = BaseViewSchema & {
  type: 'export';
  formats?: ('csv' | 'xlsx' | 'json' | 'pdf')[];
  defaultFormat?: 'csv' | 'xlsx' | 'json' | 'pdf';
  includeHeaders?: boolean;
  fileName?: string;
};

/**
 * Union type of all view schemas
 */
export type ViewSchema =
  | FormViewSchema
  | TableViewSchema
  | DetailViewSchema
  | AuditLogViewSchema
  | ImportViewSchema
  | ExportViewSchema;
