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
// Type definitions for CRUD UI components
import type { ReactNode } from 'react';

/**
 * Field option interface for select, radio, and multi-select components
 */
export interface FieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

/**
 * Common props for all field components
 */
export interface FieldComponentProps {
  id?: string;
  name?: string;
  value?: FieldValue | File | File[] | Record<string, unknown>;
  onChange: (
    value: FieldValue | File | File[] | Record<string, unknown>
  ) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string | null;
  description?: string;
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  accept?: string;
  rows?: number;
  cols?: number;
  autoFocus?: boolean;
  readOnly?: boolean;
  [key: string]: unknown; // Allow additional props
}

/**
 * Field definition interface for form generation
 */
export interface FieldDefinition {
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: FieldOption[];
  defaultValue?: FieldValue;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  validation?:
    | ValidationRule[]
    | {
        required?: boolean;
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        validate?: (value: FieldValue) => boolean | string;
      };
  hidden?: boolean | ((values: Record<string, FieldValue>) => boolean);
  readOnly?: boolean | ((values: Record<string, FieldValue>) => boolean);
  props?: Record<string, unknown>;
  [key: string]: unknown; // Allow additional properties
}

/**
 * Field value type
 */
export type FieldValue =
  | string
  | number
  | boolean
  | Date
  | string[]
  | number[]
  | null
  | undefined;

/**
 * Validation rule interface
 */
export interface ValidationRule {
  type:
    | 'required'
    | 'min'
    | 'max'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'custom';
  value?: number | string | RegExp;
  message?: string;
  validator?: (
    value: FieldValue,
    allValues: Record<string, FieldValue>
  ) => boolean;
}

/**
 * Form section interface
 */
export interface FormSection {
  title?: string;
  description?: string;
  fields: string[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * Form tab interface
 */
export interface FormTab {
  title: string;
  description?: string;
  sections: FormSection[];
  className?: string;
}

/**
 * Form layout interface
 */
export interface FormLayout {
  tabs?: FormTab[];
  sections?: FormSection[];
}

/**
 * AutoForm props interface
 */
export interface AutoFormProps {
  fields: FieldDefinition[];
  value: Record<string, FieldValue>;
  onChange: (value: Record<string, FieldValue>) => void;
  errors?: Record<string, string>;
  layout?: FormLayout;
  onSubmit?: (value: Record<string, FieldValue>) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  className?: string;
}

/**
 * Table column interface
 */
export interface TableColumn {
  key: string;
  title: string;
  width?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  render?: (value: FieldValue, row: Record<string, FieldValue>) => ReactNode;
}

/**
 * Table filter interface
 */
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
    | 'endsWith'
    | 'between';
  value: FieldValue;
}

/**
 * Table pagination interface
 */
export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * Table sorting interface
 */
export interface TableSorting {
  column: string;
  direction: 'asc' | 'desc';
  onSort: (column: string, direction: 'asc' | 'desc') => void;
}

/**
 * AutoTable props interface
 */
export interface AutoTableProps {
  columns: TableColumn[];
  data: Record<string, FieldValue>[];
  rowActions?: ReactNode | ((row: Record<string, FieldValue>) => ReactNode);
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

/**
 * AutoFilter props interface
 */
export interface AutoFilterProps {
  fields: FieldDefinition[];
  value?: Record<string, FieldValue>;
  onChange?: (filters: Record<string, FieldValue>) => void;
  onApply?: (filters: TableFilter[]) => void;
  onReset?: () => void;
  operatorsByType?: Record<string, string[]>;
  defaultOperatorsByType?: Record<string, string>;
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * AutoRelationField option interface
 */
export interface RelationOption {
  id: string | number;
  label: string;
  value: string | number; // Added to match FieldOption interface
  description?: string;
  icon?: string;
  disabled?: boolean;
  data?: Record<string, unknown>;
}

/**
 * AutoRelationField props interface
 */
export interface AutoRelationFieldProps extends FieldComponentProps {
  multiple?: boolean;
  fetchOptions?: (
    query: string
  ) => Promise<RelationOption[]> | RelationOption[];
  options?: RelationOption[];
  placeholder?: string;
  emptyMessage?: string;
  showDescriptions?: boolean;
  showIcons?: boolean;
  allowCreate?: boolean;
  onCreate?: (value: string) => Promise<RelationOption> | RelationOption;
  displayAsBadges?: boolean;
  maxItems?: number;
  debounceMs?: number;
  renderOption?: (option: RelationOption) => ReactNode;
  renderValue?: (option: RelationOption) => ReactNode;
}

/**
 * DetailSection interface for AutoDetail
 */
export interface DetailSection {
  title?: string;
  description?: string;
  fields: string[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * DetailTab interface for AutoDetail
 */
export interface DetailTab {
  title: string;
  description?: string;
  sections: DetailSection[];
  className?: string;
}

/**
 * DetailLayout interface for AutoDetail
 */
export interface DetailLayout {
  type: 'tabs' | 'sections' | 'basic';
  tabs?: DetailTab[];
  sections?: DetailSection[];
}

/**
 * AutoDetail props interface
 */
export interface AutoDetailProps {
  fields: FieldDefinition[];
  data: Record<string, FieldValue>;
  layout?: DetailLayout;
  showLabels?: boolean;
  actions?: ReactNode[];
  title?: string;
  description?: string;
  card?: boolean;
  showEmptyFields?: boolean;
  className?: string;
  fieldRenderers?: Record<
    string,
    (value: FieldValue, field: FieldDefinition) => ReactNode
  >;
  locale?: string;
}

/**
 * UseCrudFormOptions interface
 */
export interface UseCrudFormOptions {
  initial?: Record<string, FieldValue>;
  schema: FieldDefinition[];
  onSubmit?: (values: Record<string, FieldValue>) => Promise<void> | void;
}

/**
 * UseCrudFormReturn interface
 */
export interface UseCrudFormReturn {
  value: Record<string, FieldValue>;
  setValue: (value: Record<string, FieldValue>) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  isDirty: boolean;
  isSubmitting: boolean;
  reset: () => void;
  handleSubmit: () => Promise<boolean>;
  handleBlur: (fieldName: string) => void;
  validate: () => boolean;
}

/**
 * Action interface for AutoActions component
 */
export interface Action {
  id: string;
  label: string;
  icon?: ReactNode;
  tooltip?: string;
  onClick: (data: Record<string, FieldValue>) => void;
  disabled?: boolean | ((data: Record<string, FieldValue>) => boolean);
  hidden?: boolean | ((data: Record<string, FieldValue>) => boolean);
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  requireConfirmation?: boolean;
  confirmationMessage?: string;
  [key: string]: unknown;
}

/**
 * AutoActions props interface
 */
export interface AutoActionsProps {
  data: Record<string, FieldValue>;
  actions: Action[];
  maxVisibleActions?: number;
  showLabels?: boolean;
  showIcons?: boolean;
  align?: 'start' | 'center' | 'end';
  direction?: 'horizontal' | 'vertical';
  className?: string;
  actionClassName?: string;
}

/**
 * Export format type
 */
export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf' | 'xml';

/**
 * Export options interface
 */
export interface ExportOptions {
  format: ExportFormat;
  filename: string;
  includeHeaders: boolean;
  fields: string[];
  delimiter?: string;
  exportAll: boolean;
  [key: string]: unknown;
}

/**
 * AutoExport props interface
 */
export interface AutoExportProps {
  data: Record<string, FieldValue>[];
  fields: FieldDefinition[] | TableColumn[];
  formats?: ExportFormat[];
  defaultOptions?: Partial<ExportOptions>;
  onExport: (
    data: Record<string, FieldValue>[],
    options: ExportOptions
  ) => Promise<void> | void;
  fetchAllData?: () => Promise<Record<string, FieldValue>[]>;
  disabled?: boolean;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  label?: string;
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
}

/**
 * Import format type
 */
export type ImportFormat = 'csv' | 'json' | 'xlsx' | 'xml';

/**
 * Import result interface
 */
export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  data: Record<string, FieldValue>[];
}

/**
 * Import options interface
 */
export interface ImportOptions {
  format: ImportFormat;
  skipHeader: boolean;
  delimiter: string;
  fieldMapping: Record<string, string>;
  [key: string]: unknown;
}

/**
 * AutoImport props interface
 */
export interface AutoImportProps {
  fields: FieldDefinition[];
  formats?: ImportFormat[];
  defaultOptions?: Partial<ImportOptions>;
  onImport: (file: File, options: ImportOptions) => Promise<ImportResult>;
  onComplete?: (result: ImportResult) => void;
  disabled?: boolean;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  label?: string;
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
}

/**
 * Audit action type
 */
export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'export'
  | 'import'
  | 'login'
  | 'logout'
  | string;

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  id: string | number;
  timestamp: string | Date;
  user: {
    id: string | number;
    name: string;
    email?: string;
    avatar?: string;
  };
  action: AuditAction;
  entityType: string;
  entityId?: string | number;
  changes?: {
    field: string;
    oldValue?: FieldValue;
    newValue?: FieldValue;
  }[];
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Audit log filter interface
 */
export interface AuditLogFilter {
  startDate?: Date;
  endDate?: Date;
  users?: (string | number)[];
  actions?: AuditAction[];
  entityTypes?: string[];
  entityIds?: (string | number)[];
  search?: string;
}

/**
 * AutoAuditLogView props interface
 */
export interface AutoAuditLogViewProps {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  filters?: AuditLogFilter;
  onFilterChange?: (filters: AuditLogFilter) => void;
  availableActions?: AuditAction[];
  availableEntityTypes?: string[];
  availableUsers?: { id: string | number; name: string }[];
  onViewDetails?: (entry: AuditLogEntry) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  showCard?: boolean;
  showFilters?: boolean;
  className?: string;
  locale?: string;
}
