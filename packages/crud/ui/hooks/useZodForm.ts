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
import { useCallback, useState } from 'react';
import { z } from 'zod';
import { validateWithZod } from '../auto/zodUtils';
import type { FieldValue } from '../types';

export interface UseZodFormOptions<T extends z.ZodObject<any>> {
  schema: T;
  initialValues?: Record<string, FieldValue>;
  onSubmit?: (values: z.infer<T>) => Promise<void> | void;
}

export interface UseZodFormReturn<T extends z.ZodObject<any>> {
  values: Record<string, FieldValue>;
  setValues: (values: Record<string, FieldValue>) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (newValues: Record<string, FieldValue>) => void;
  handleBlur: (fieldName: string) => void;
  handleSubmit: () => Promise<boolean>;
  reset: () => void;
  validateField: (fieldName: string) => boolean;
  validateForm: () => boolean;
}

/**
 * Custom hook for form handling with Zod schema validation
 */
export function useZodForm<T extends z.ZodObject<any>>({
  schema,
  initialValues = {},
  onSubmit,
}: UseZodFormOptions<T>): UseZodFormReturn<T> {
  const [values, setValues] =
    useState<Record<string, FieldValue>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialState] = useState(initialValues);

  // Check if form is dirty (values changed from initial state)
  const isDirty = useCallback(() => {
    const initialKeys = Object.keys(initialState);
    const currentKeys = Object.keys(values);

    if (initialKeys.length !== currentKeys.length) return true;

    return initialKeys.some((key) => initialState[key] !== values[key]);
  }, [initialState, values]);

  // Validate a single field
  const validateField = useCallback(
    (fieldName: string): boolean => {
      try {
        // Create a sub-schema for just this field
        const fieldSchema = z.object({ [fieldName]: schema.shape[fieldName] });
        fieldSchema.parse({ [fieldName]: values[fieldName] });

        // Clear error if validation passes
        if (errors[fieldName]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }

        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = validateWithZod(fieldSchema, {
            [fieldName]: values[fieldName],
          });

          setErrors((prev) => ({
            ...prev,
            ...fieldErrors,
          }));

          return false;
        }

        return true;
      }
    },
    [schema, values, errors]
  );

  // Validate the entire form
  const validateForm = useCallback((): boolean => {
    const validationErrors = validateWithZod(schema, values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [schema, values]);

  // Handle field blur
  const handleBlur = useCallback(
    (fieldName: string) => {
      setTouched((prev) => ({
        ...prev,
        [fieldName]: true,
      }));

      validateField(fieldName);
    },
    [validateField]
  );

  // Handle form change
  const handleChange = useCallback(
    (newValues: Record<string, FieldValue>) => {
      setValues(newValues);

      // Validate fields that have been touched
      Object.keys(touched)
        .filter((field) => touched[field])
        .forEach(validateField);
    },
    [touched, validateField]
  );

  // Handle form submission
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    // Mark all fields as touched
    const allTouched = Object.keys(schema.shape).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate all fields
    const isValid = validateForm();

    if (!isValid || !onSubmit) {
      return false;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(values as z.infer<T>);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [schema, validateForm, onSubmit, values]);

  // Reset form to initial state
  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  return {
    values,
    setValues,
    errors,
    setErrors,
    touched,
    isDirty: isDirty(),
    isSubmitting,
    isValid: Object.keys(errors).length === 0,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validateField,
    validateForm,
  };
}
