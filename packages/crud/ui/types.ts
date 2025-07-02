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
import type { ReactNode } from 'react';

export type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'enum'
  | 'relation'
  | 'text'
  | 'file'
  | 'richtext'
  | 'multiselect'
  | 'json'
  | 'password'
  | 'email'
  | 'url'
  | 'color'
  | 'tel';

export type FieldValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | Record<string, unknown>
  | Array<unknown>;

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FieldDefinition {
  name: string;
  type: FieldType;
  label?: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
  defaultValue?: FieldValue;
  validation?: ValidationRule[];
  props?: Record<string, unknown>;
  hidden?: boolean | ((values: Record<string, FieldValue>) => boolean);
  readOnly?: boolean | ((values: Record<string, FieldValue>) => boolean);
  options?: FieldOption[];
  dependsOn?: string[];
  render?: (value: FieldValue, row?: Record<string, FieldValue>) => ReactNode;
}

export interface ValidationRule {
  type:
    | 'required'
    | 'min'
    | 'max'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'custom';
  message: string;
  value?: string | number;
  validator?: (
    value: FieldValue,
    formValues: Record<string, FieldValue>
  ) => boolean;
}

export interface FormSection {
  title?: string;
  description?: string;
  fields: string[];
  columns?: 1 | 2 | 3 | 4;
}

export interface FormLayout {
  sections?: FormSection[];
  tabs?: Array<{ title: string; sections: FormSection[] }>;
}

export interface AutoFormProps {
  fields: FieldDefinition[];
  value: Record<string, FieldValue>;
  onChange: (value: Record<string, FieldValue>) => void;
  errors?: Record<string, string>;
  layout?: FormLayout;
  onSubmit?: (values: Record<string, FieldValue>) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  className?: string;
}

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: FieldValue, row: Record<string, FieldValue>) => ReactNode;
}

export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface TableSorting {
  column?: string;
  direction: 'asc' | 'desc';
  onSort: (column: string, direction: 'asc' | 'desc') => void;
}

export interface TableFilter {
  column: string;
  operator:
    | 'eq'
    | 'neq'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'contains'
    | 'startsWith'
    | 'endsWith';
  value: string | number | boolean;
}

export interface AutoTableProps {
  columns: TableColumn[];
  data: Record<string, FieldValue>[];
  rowActions?: (row: Record<string, FieldValue>) => ReactNode;
  bulkActions?: ReactNode;
  pagination?: TablePagination;
  sorting?: TableSorting;
  filters?: TableFilter[];
  onFilterChange?: (filters: TableFilter[]) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: Record<string, FieldValue>[]) => void;
  rowKey?: string;
  className?: string;
}

export interface UseCrudFormOptions {
  initial?: Record<string, FieldValue>;
  schema: FieldDefinition[];
  onSubmit?: (values: Record<string, FieldValue>) => Promise<void>;
}

export interface UseCrudFormReturn {
  value: Record<string, FieldValue>;
  setValue: (value: Record<string, FieldValue>) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  isDirty: boolean;
  isSubmitting: boolean;
  reset: () => void;
  handleSubmit: () => Promise<boolean>;
  validate: () => boolean;
  handleBlur: (fieldName: string) => void;
}

export interface UseCrudTableOptions {
  rows?: Record<string, FieldValue>[];
  fetchData?: (params: {
    page: number;
    pageSize: number;
    sort?: { column: string; direction: 'asc' | 'desc' };
    filters?: TableFilter[];
  }) => Promise<{ data: Record<string, FieldValue>[]; total: number }>;
  initialPage?: number;
  initialPageSize?: number;
  initialSort?: { column: string; direction: 'asc' | 'desc' };
  initialFilters?: TableFilter[];
}

export interface UseCrudTableReturn {
  rows: Record<string, FieldValue>[];
  isLoading: boolean;
  error: Error | null;
  selected: Record<string, FieldValue>[];
  setSelected: (rows: Record<string, FieldValue>[]) => void;
  pagination: TablePagination;
  sorting: TableSorting;
  filters: TableFilter[];
  setFilters: (filters: TableFilter[]) => void;
  refresh: () => Promise<void>;
}
