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
// Entry point for the ui module

// Auto components
export { AutoForm } from './auto/AutoForm';
export { AutoTable } from './auto/AutoTable';
export { AutoActions } from './auto/AutoActions';
export { AutoAuditLogView } from './auto/AutoAuditLogView';

// Zod integration
export { ZodForm, createTypedZodForm } from './auto/ZodForm';
export { zodSchemaToFieldDefinitions, validateWithZod } from './auto/zodUtils';
export { useZodForm } from './hooks/useZodForm';

// Types
export type {
  FieldType,
  FieldValue,
  FieldOption,
  FieldDefinition,
  ValidationRule,
  FormSection,
  FormLayout,
  AutoFormProps,
  TableColumn,
  TablePagination,
  TableSorting,
  AutoTableProps,
} from './types';
export type { ZodFormProps } from './auto/ZodForm';
export type { UseZodFormOptions, UseZodFormReturn } from './hooks/useZodForm';
