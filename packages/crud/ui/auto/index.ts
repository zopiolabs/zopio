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
 * Auto UI Components for CRUD Operations
 *
 * This module exports components for building CRUD interfaces with minimal code.
 * Components automatically adapt to field types and handle common CRUD operations.
 */

// Export main components
export { AutoForm } from './AutoForm';
export { AutoTable } from './AutoTable';
export { AutoFilter } from './AutoFilter';
export { AutoFormLayout } from './AutoFormLayout';
export { AutoRelationField } from './AutoRelationField';
export { AutoDetail } from './AutoDetail';
export { AutoActions } from './AutoActions';
export { AutoExport } from './AutoExport';
export { AutoImport } from './AutoImport';
export { AutoAuditLogView } from './AutoAuditLogView';

// Export Zod integration components
export { ZodForm, createTypedZodForm } from './ZodForm';
export { zodSchemaToFieldDefinitions, validateWithZod } from './zodUtils';

// Export hooks
export { useCrudForm } from './useCrudForm';
export { useCrudTable } from './useCrudTable';

// Export types
export type {
  // Field types
  FieldOption,
  FieldComponentProps,
  FieldDefinition,
  FieldValue,
  ValidationRule,
  // Form types
  FormSection,
  FormTab,
  FormLayout,
  AutoFormProps,
  // Table types
  TableColumn,
  TableFilter,
  TablePagination,
  TableSorting,
  AutoTableProps,
  // Filter types
  AutoFilterProps,
  // Relation types
  RelationOption,
  AutoRelationFieldProps,
  // Detail types
  DetailSection,
  DetailTab,
  DetailLayout,
  AutoDetailProps,
  // Actions types
  Action,
  AutoActionsProps,
  // Export types
  ExportFormat,
  ExportOptions,
  AutoExportProps,
  // Import types
  ImportFormat,
  ImportResult,
  ImportOptions,
  AutoImportProps,
  // Audit log types
  AuditAction,
  AuditLogEntry,
  AuditLogFilter,
  AutoAuditLogViewProps,
  // Hook types
  UseCrudFormOptions,
  UseCrudFormReturn,
} from './types';

// Export field component map for custom extensions
export { fieldComponentMap } from './fieldComponentMap';
