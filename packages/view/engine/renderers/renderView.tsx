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
import type * as React from 'react';
import { useViewTranslations } from '../../i18n';
import {
  UnsupportedViewTypeError,
  ViewErrorBoundary,
  ViewRenderingError,
  ViewSchemaValidationError,
} from '../error';
import { safeValidateViewSchema } from '../validation/schema';
import type {
  AuditLogViewSchema,
  DetailViewSchema,
  ExportViewSchema,
  FormViewSchema,
  ImportViewSchema,
  TableViewSchema,
  ViewSchema,
} from './types';

import { AutoAuditLogView } from '@repo/crud/ui/auto/AutoAuditLogView';
import { AutoDetail } from '@repo/crud/ui/auto/AutoDetail';
import { AutoExport } from '@repo/crud/ui/auto/AutoExport';
// Import CRUD components
import { AutoForm } from '@repo/crud/ui/auto/AutoForm';
import { AutoImport } from '@repo/crud/ui/auto/AutoImport';
import { AutoTable } from '@repo/crud/ui/auto/AutoTable';

/**
 * Props for the RenderView component
 */
interface RenderViewProps {
  schema: ViewSchema;
  locale?: string;
  data?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  onError?: (error: Error) => void;
}

/**
 * Form view renderer component
 */
function FormView({
  schema,
  data,
  onSubmit,
}: {
  schema: FormViewSchema;
  data?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
}): JSX.Element {
  const t = useViewTranslations(schema.i18nNamespace);

  return (
    <AutoForm
      schema={schema.schema}
      initialData={data}
      onSubmit={onSubmit}
      submitLabel={schema.submitLabel ? t(schema.submitLabel) : undefined}
      resetLabel={schema.resetLabel ? t(schema.resetLabel) : undefined}
      showReset={schema.showReset}
      fields={schema.fields}
      layout={schema.layout}
    />
  );
}

/**
 * Table view renderer component
 */
function TableView({
  schema,
  data,
}: { schema: TableViewSchema; data?: Record<string, unknown>[] }): JSX.Element {
  const t = useViewTranslations(schema.i18nNamespace);

  return (
    <AutoTable
      schema={schema.schema}
      data={data || []}
      columns={schema.columns}
      pagination={schema.pagination}
      defaultSort={schema.defaultSort}
      rowActions={schema.rowActions}
      bulkActions={schema.bulkActions}
      selectable={schema.selectable}
    />
  );
}

/**
 * Detail view renderer component
 */
function DetailView({
  schema,
  data,
}: { schema: DetailViewSchema; data?: Record<string, unknown> }): JSX.Element {
  const t = useViewTranslations(schema.i18nNamespace);

  return (
    <AutoDetail
      schema={schema.schema}
      data={data || {}}
      fields={schema.fields}
      layout={schema.layout}
      actions={schema.actions}
    />
  );
}

/**
 * Audit log view renderer component
 */
function AuditLogView({ schema }: { schema: AuditLogViewSchema }): JSX.Element {
  const t = useViewTranslations(schema.i18nNamespace);

  return (
    <AutoAuditLogView
      schema={schema.schema}
      entityIdField={schema.entityIdField}
      showUser={schema.showUser}
      showTimestamp={schema.showTimestamp}
      showAction={schema.showAction}
    />
  );
}

/**
 * Import view renderer component
 */
function ImportView({
  schema,
  onSubmit,
}: {
  schema: ImportViewSchema;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
}): JSX.Element {
  const t = useViewTranslations(schema.i18nNamespace);

  return (
    <AutoImport
      schema={schema.schema}
      onImportComplete={onSubmit}
      fileTypes={schema.fileTypes}
      maxFileSize={schema.maxFileSize}
      templateUrl={schema.templateUrl}
      instructions={schema.instructions ? t(schema.instructions) : undefined}
    />
  );
}

/**
 * Export view renderer component
 */
function ExportView({ schema }: { schema: ExportViewSchema }): JSX.Element {
  const t = useViewTranslations(schema.i18nNamespace);

  return (
    <AutoExport
      schema={schema.schema}
      formats={schema.formats}
      defaultFormat={schema.defaultFormat}
      includeHeaders={schema.includeHeaders}
      fileName={schema.fileName}
    />
  );
}

/**
 * Main view renderer component that selects the appropriate renderer based on the view type
 */
function RenderView({
  schema,
  locale,
  data,
  onSubmit,
  onError,
}: RenderViewProps): JSX.Element {
  try {
    // Validate the schema
    const validationResult = safeValidateViewSchema(schema);

    // If validation fails, throw a validation error
    if (!validationResult.success) {
      throw new ViewSchemaValidationError(
        'Invalid view schema',
        validationResult.error
      );
    }

    // Use the validated schema
    const validatedSchema = validationResult.data;

    // Render the appropriate component based on the view type
    switch (validatedSchema.type) {
      case 'form':
        return (
          <FormView
            schema={validatedSchema as FormViewSchema}
            data={data as Record<string, unknown>}
            onSubmit={onSubmit}
          />
        );
      case 'table':
        return (
          <TableView
            schema={validatedSchema as TableViewSchema}
            data={data as Record<string, unknown>[]}
          />
        );
      case 'detail':
        return (
          <DetailView
            schema={validatedSchema as DetailViewSchema}
            data={data as Record<string, unknown>}
          />
        );
      case 'audit-log':
        return <AuditLogView schema={validatedSchema as AuditLogViewSchema} />;
      case 'import':
        return (
          <ImportView
            schema={validatedSchema as ImportViewSchema}
            onSubmit={onSubmit}
          />
        );
      case 'export':
        return <ExportView schema={validatedSchema as ExportViewSchema} />;
      default:
        throw new UnsupportedViewTypeError(validatedSchema.type as string);
    }
  } catch (error) {
    // Handle errors and call the onError callback if provided
    if (error instanceof Error) {
      if (onError) {
        onError(error);
      }

      // Wrap the error in a ViewRenderingError if it's not already a ViewError
      if (
        !(
          error instanceof ViewSchemaValidationError ||
          error instanceof UnsupportedViewTypeError
        )
      ) {
        throw new ViewRenderingError('Error rendering view', error);
      }

      throw error;
    }

    // If it's not an Error instance, wrap it
    throw new ViewRenderingError('Unknown error rendering view');
  }
}

/**
 * Renders a view based on the provided schema with error handling
 * @param schema The view schema to render
 * @param options Additional options for rendering the view
 * @returns A JSX element with the rendered view wrapped in an error boundary
 */
export function renderView(
  schema: ViewSchema,
  options?: {
    locale?: string;
    data?: Record<string, unknown> | Record<string, unknown>[];
    onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
    onError?: (error: Error) => void;
    errorFallback?: React.ReactNode | ((error: Error) => React.ReactNode);
  }
): JSX.Element {
  return (
    <ViewErrorBoundary fallback={options?.errorFallback}>
      <RenderView
        schema={schema}
        locale={options?.locale}
        data={options?.data as Record<string, unknown>}
        onSubmit={options?.onSubmit}
        onError={options?.onError}
      />
    </ViewErrorBoundary>
  );
}
