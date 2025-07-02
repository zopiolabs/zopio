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
import * as React from 'react';
import type { z } from 'zod';
import { useZodForm } from '../hooks/useZodForm';
import type { FieldDefinition, FieldValue, FormLayout } from '../types';
import { AutoForm } from './AutoForm';
import { zodSchemaToFieldDefinitions } from './zodUtils';

export interface ZodFormProps<
  T extends z.ZodObject<Record<string, z.ZodTypeAny>>,
> {
  /**
   * Zod schema for form validation
   */
  schema: T;

  /**
   * Initial form values
   */
  initialValues?: Record<string, FieldValue>;

  /**
   * Callback when form is submitted and validation passes
   */
  onSubmit?: (values: z.infer<T>) => Promise<void> | void;

  /**
   * Form layout configuration
   */
  layout?: FormLayout;

  /**
   * Submit button label
   */
  submitLabel?: string;

  /**
   * Reset button label
   */
  resetLabel?: string;

  /**
   * Whether to show the reset button
   */
  showReset?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Field options for customizing the form fields
   */
  fieldOptions?: {
    /**
     * Custom field labels
     */
    labels?: Record<string, string>;

    /**
     * Custom field descriptions
     */
    descriptions?: Record<string, string>;

    /**
     * Custom field placeholders
     */
    placeholders?: Record<string, string>;

    /**
     * Order of fields in the form
     */
    fieldOrder?: string[];

    /**
     * Fields to hide from the form
     */
    hiddenFields?: string[];

    /**
     * Fields that should be read-only
     */
    readOnlyFields?: string[];
  };

  /**
   * Custom field definitions to override the auto-generated ones
   */
  customFields?: FieldDefinition[];
}

/**
 * ZodForm component that uses Zod schemas for validation
 * Automatically generates form fields based on the schema
 */
export function ZodForm<T extends z.ZodObject<Record<string, z.ZodTypeAny>>>({
  schema,
  initialValues = {},
  onSubmit,
  layout,
  submitLabel,
  resetLabel,
  showReset = true,
  className = '',
  fieldOptions = {},
  customFields = [],
}: ZodFormProps<T>) {
  // Generate field definitions from Zod schema
  const generatedFields = React.useMemo(() => {
    return zodSchemaToFieldDefinitions(schema, fieldOptions);
  }, [schema, fieldOptions]);

  // Merge generated fields with custom fields
  const fields = React.useMemo(() => {
    const fieldMap = new Map<string, FieldDefinition>();

    // Add generated fields to the map
    for (const field of generatedFields) {
      fieldMap.set(field.name, field);
    }

    // Override with custom fields
    for (const field of customFields) {
      fieldMap.set(field.name, field);
    }

    // Convert map back to array
    return Array.from(fieldMap.values());
  }, [generatedFields, customFields]);

  // Use the Zod form hook
  const { values, errors, isSubmitting, handleChange, handleSubmit, reset } =
    useZodForm<T>({
      schema,
      initialValues,
      onSubmit,
    });

  // Handle form submission
  const handleFormSubmit = React.useCallback(async () => {
    await handleSubmit();
  }, [handleSubmit]);

  return (
    <AutoForm
      fields={fields}
      value={values}
      onChange={handleChange}
      errors={errors}
      layout={layout}
      onSubmit={handleFormSubmit}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
      resetLabel={resetLabel}
      showReset={showReset}
      className={className}
    />
  );
}

/**
 * Create a type-safe ZodForm component for a specific schema
 */
export function createTypedZodForm<
  T extends z.ZodObject<Record<string, z.ZodTypeAny>>,
>(schema: T) {
  return function TypedZodForm(props: Omit<ZodFormProps<T>, 'schema'>) {
    return <ZodForm schema={schema} {...props} />;
  };
}
