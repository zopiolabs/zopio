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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCrudTranslation } from '../i18n';
import type {
  FieldDefinition,
  FieldValue,
  UseCrudFormOptions,
  UseCrudFormReturn,
  ValidationRule,
} from '../types';

/**
 * useCrudForm is a React hook for managing form state and validation for auto forms.
 * Features:
 * - Form state management
 * - Field validation
 * - Dirty state tracking
 * - Form submission handling
 * - Internationalization support
 */
export function useCrudForm({
  initial = {},
  schema,
  onSubmit,
}: UseCrudFormOptions): UseCrudFormReturn {
  const { t } = useCrudTranslation();
  const [value, setValue] = useState<Record<string, FieldValue>>(initial);
  const [initialValue] = useState<Record<string, FieldValue>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const touchedFields = useRef<Set<string>>(new Set());

  // Update dirty state when values change
  useEffect(() => {
    const newIsDirty = Object.keys(value).some((key) => {
      // Check if the value has changed from initial
      return JSON.stringify(value[key]) !== JSON.stringify(initialValue[key]);
    });

    setIsDirty(newIsDirty);
  }, [value, initialValue]);

  // Validate a single field
  const validateField = useCallback(
    (fieldName: string, fieldValue: FieldValue): string | null => {
      const field = schema.find((f) => f.name === fieldName);
      if (!field) return null;

      // Check required
      if (
        field.required &&
        (fieldValue === undefined || fieldValue === null || fieldValue === '')
      ) {
        return t('form.validation.required');
      }

      // Run through validation rules if any
      if (field.validation?.length) {
        for (const rule of field.validation) {
          const error = validateRule(rule, fieldValue, value);
          if (error) return error;
        }
      }

      return null;
    },
    [schema, value, t]
  );

  // Validate a rule against a value
  const validateRule = (
    rule: ValidationRule,
    fieldValue: FieldValue,
    allValues: Record<string, FieldValue>
  ): string | null => {
    switch (rule.type) {
      case 'required':
        return fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === ''
          ? rule.message || t('form.validation.required')
          : null;

      case 'min':
        return typeof fieldValue === 'number' &&
          typeof rule.value === 'number' &&
          fieldValue < rule.value
          ? rule.message || t('form.validation.min', { min: rule.value })
          : null;

      case 'max':
        return typeof fieldValue === 'number' &&
          typeof rule.value === 'number' &&
          fieldValue > rule.value
          ? rule.message || t('form.validation.max', { max: rule.value })
          : null;

      case 'minLength':
        return typeof fieldValue === 'string' &&
          typeof rule.value === 'number' &&
          fieldValue.length < rule.value
          ? rule.message || t('form.validation.minLength', { min: rule.value })
          : null;

      case 'maxLength':
        return typeof fieldValue === 'string' &&
          typeof rule.value === 'number' &&
          fieldValue.length > rule.value
          ? rule.message || t('form.validation.maxLength', { max: rule.value })
          : null;

      case 'pattern':
        if (typeof fieldValue === 'string' && typeof rule.value === 'string') {
          const pattern = new RegExp(rule.value);
          return pattern.test(fieldValue)
            ? null
            : rule.message || t('form.validation.pattern');
        }
        return null;

      case 'custom':
        return rule.validator && !rule.validator(fieldValue, allValues)
          ? rule.message
          : null;

      default:
        return null;
    }
  };

  // Validate all fields
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    schema.forEach((field: FieldDefinition) => {
      // Skip validation for hidden fields
      if (typeof field.hidden === 'function' && field.hidden(value)) return;
      if (field.hidden === true) return;

      const error = validateField(field.name, value[field.name]);
      if (error) newErrors[field.name] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [schema, value, validateField]);

  // Handle form value change
  const handleChange = useCallback(
    (newValue: Record<string, FieldValue>) => {
      setValue(newValue);

      // Validate touched fields on change
      const newErrors = { ...errors };
      Object.keys(newValue).forEach((fieldName) => {
        if (touchedFields.current.has(fieldName)) {
          const error = validateField(fieldName, newValue[fieldName]);
          if (error) {
            newErrors[fieldName] = error;
          } else {
            delete newErrors[fieldName];
          }
        }
      });

      setErrors(newErrors);
    },
    [errors, validateField]
  );

  // Handle field blur (mark as touched)
  const handleBlur = useCallback(
    (fieldName: string) => {
      touchedFields.current.add(fieldName);

      const error = validateField(fieldName, value[fieldName]);
      if (error) {
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    },
    [value, validateField]
  );

  // Reset form to initial values
  const reset = useCallback(() => {
    setValue(initialValue);
    setErrors({});
    touchedFields.current.clear();
    setIsDirty(false);
  }, [initialValue]);

  // Handle form submission
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    // Mark all fields as touched
    schema.forEach((field: FieldDefinition) => {
      touchedFields.current.add(field.name);
    });

    // Validate all fields
    const isValid = validate();
    if (!isValid) return false;

    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(value);
        return true;
      } catch (error) {
        console.error('Form submission error:', error);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    }

    return true;
  }, [schema, validate, onSubmit, value]);

  return {
    value,
    setValue: handleChange,
    errors,
    setErrors,
    isDirty,
    isSubmitting,
    reset,
    handleSubmit,
    validate,
    handleBlur,
  };
}
