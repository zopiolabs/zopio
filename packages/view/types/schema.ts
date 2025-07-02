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
 * View Schema Type Definitions
 *
 * This file contains comprehensive TypeScript type definitions for view schemas,
 * ensuring type safety across the view and view-builder modules.
 */

// Base field definition that all field types extend
export interface BaseFieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hidden?: boolean | ((values: Record<string, unknown>) => boolean);
  readOnly?: boolean | ((values: Record<string, unknown>) => boolean);
  description?: string;
  placeholder?: string;
  defaultValue?: unknown;
  validations?: ValidationRule[];
  props?: Record<string, unknown>;
}

// Field types supported by the view system
export type FieldType =
  | 'string'
  | 'text'
  | 'number'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'date'
  | 'time'
  | 'datetime'
  | 'email'
  | 'password'
  | 'url'
  | 'tel'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'image'
  | 'color'
  | 'range'
  | 'rating'
  | 'richtext'
  | 'code'
  | 'json'
  | 'relation'
  | 'custom';

// Validation rule for field validation
export interface ValidationRule {
  type:
    | 'required'
    | 'min'
    | 'max'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'custom';
  value?: unknown;
  message: string;
  validator?: (
    value: unknown,
    formValues: Record<string, unknown>
  ) => boolean | Promise<boolean>;
}

// Field option for select, multiselect, radio, etc.
export interface FieldOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}

// String field definition
export interface StringFieldDefinition extends BaseFieldDefinition {
  type: 'string' | 'text' | 'email' | 'password' | 'url' | 'tel';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// Number field definition
export interface NumberFieldDefinition extends BaseFieldDefinition {
  type: 'number' | 'integer' | 'float';
  min?: number;
  max?: number;
  step?: number;
}

// Boolean field definition
export interface BooleanFieldDefinition extends BaseFieldDefinition {
  type: 'boolean';
  trueLabel?: string;
  falseLabel?: string;
}

// Date field definition
export interface DateFieldDefinition extends BaseFieldDefinition {
  type: 'date' | 'time' | 'datetime';
  min?: string;
  max?: string;
  format?: string;
}

// Select field definition
export interface SelectFieldDefinition extends BaseFieldDefinition {
  type: 'select' | 'multiselect' | 'radio' | 'checkbox';
  options: FieldOption[];
  multiple?: boolean;
}

// File field definition
export interface FileFieldDefinition extends BaseFieldDefinition {
  type: 'file' | 'image';
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
}

// Color field definition
export interface ColorFieldDefinition extends BaseFieldDefinition {
  type: 'color';
  format?: 'hex' | 'rgb' | 'hsl';
}

// Range field definition
export interface RangeFieldDefinition extends BaseFieldDefinition {
  type: 'range' | 'rating';
  min?: number;
  max?: number;
  step?: number;
}

// Rich text field definition
export interface RichTextFieldDefinition extends BaseFieldDefinition {
  type: 'richtext' | 'code' | 'json';
  language?: string;
  toolbar?: string[];
}

// Relation field definition
export interface RelationFieldDefinition extends BaseFieldDefinition {
  type: 'relation';
  entity: string;
  displayField: string;
  valueField: string;
  multiple?: boolean;
  filter?: Record<string, unknown>;
}

// Custom field definition
export interface CustomFieldDefinition extends BaseFieldDefinition {
  type: 'custom';
  component: string;
}

// Union type for all field definitions
export type FieldDefinition =
  | StringFieldDefinition
  | NumberFieldDefinition
  | BooleanFieldDefinition
  | DateFieldDefinition
  | SelectFieldDefinition
  | FileFieldDefinition
  | ColorFieldDefinition
  | RangeFieldDefinition
  | RichTextFieldDefinition
  | RelationFieldDefinition
  | CustomFieldDefinition;

// Form section definition
export interface FormSection {
  title?: string;
  description?: string;
  fields: string[];
  columns?: 1 | 2 | 3 | 4;
  condition?: (values: Record<string, unknown>) => boolean;
}

// Form tab definition
export interface FormTab {
  title: string;
  sections: FormSection[];
  condition?: (values: Record<string, unknown>) => boolean;
}

// Form layout definition
export interface FormLayout {
  type: 'simple' | 'tabs' | 'wizard';
  sections?: FormSection[];
  tabs?: FormTab[];
}

// Table column definition
export interface TableColumn {
  name: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  format?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

// Table pagination definition
export interface TablePagination {
  enabled: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
}

// Table sorting definition
export interface TableSorting {
  enabled: boolean;
  defaultColumn?: string;
  defaultDirection?: 'asc' | 'desc';
}

// Table filtering definition
export interface TableFiltering {
  enabled: boolean;
  fields?: string[];
}

// Base view schema that all view types extend
export interface BaseViewSchema {
  id: string;
  type: ViewType;
  title: string;
  description?: string;
  entity?: string;
  fields: FieldDefinition[];
  permissions?: {
    read?: string[];
    write?: string[];
  };
  i18n?: {
    namespace?: string;
    resources?: Record<string, Record<string, string>>;
  };
}

// View types supported by the view system
export type ViewType =
  | 'form'
  | 'table'
  | 'detail'
  | 'audit-log'
  | 'import'
  | 'export';

// Form view schema
export interface FormViewSchema extends BaseViewSchema {
  type: 'form';
  layout?: FormLayout;
  actions?: {
    submit?: {
      label?: string;
      handler?: string;
    };
    cancel?: {
      label?: string;
      handler?: string;
    };
    custom?: Array<{
      label: string;
      handler: string;
      variant?: string;
    }>;
  };
}

// Table view schema
export interface TableViewSchema extends BaseViewSchema {
  type: 'table';
  columns: TableColumn[];
  pagination?: TablePagination;
  sorting?: TableSorting;
  filtering?: TableFiltering;
  actions?: {
    create?: {
      label?: string;
      handler?: string;
    };
    edit?: {
      label?: string;
      handler?: string;
    };
    delete?: {
      label?: string;
      handler?: string;
      confirmMessage?: string;
    };
    custom?: Array<{
      label: string;
      handler: string;
      variant?: string;
    }>;
  };
}

// Detail view schema
export interface DetailViewSchema extends BaseViewSchema {
  type: 'detail';
  layout?: FormLayout;
  actions?: {
    edit?: {
      label?: string;
      handler?: string;
    };
    delete?: {
      label?: string;
      handler?: string;
      confirmMessage?: string;
    };
    custom?: Array<{
      label: string;
      handler: string;
      variant?: string;
    }>;
  };
}

// Audit log view schema
export interface AuditLogViewSchema extends BaseViewSchema {
  type: 'audit-log';
  columns?: TableColumn[];
  pagination?: TablePagination;
  filtering?: TableFiltering;
}

// Import view schema
export interface ImportViewSchema extends BaseViewSchema {
  type: 'import';
  format: 'csv' | 'json' | 'excel';
  mapping?: Record<string, string>;
  validation?: {
    enabled: boolean;
    stopOnError?: boolean;
  };
}

// Export view schema
export interface ExportViewSchema extends BaseViewSchema {
  type: 'export';
  format: 'csv' | 'json' | 'excel' | 'pdf';
  columns?: TableColumn[];
  filtering?: TableFiltering;
}

// Union type for all view schemas
export type ViewSchema =
  | FormViewSchema
  | TableViewSchema
  | DetailViewSchema
  | AuditLogViewSchema
  | ImportViewSchema
  | ExportViewSchema;
