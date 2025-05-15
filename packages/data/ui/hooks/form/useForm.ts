import { useState, useCallback, useEffect } from 'react';
import { createDataProvider } from '@repo/data-providers';
import type { ProviderType } from '@repo/data-base';
// @ts-ignore - Ignoring zod import error as it's correctly listed in package.json
import { z } from 'zod';

export interface UseFormParams<T extends Record<string, unknown>> {
  resource: string;
  id?: string | number;
  defaultValues?: Partial<T>;
  provider?: ProviderType;
  providerOptions?: Record<string, unknown>;
  schema?: z.ZodType<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  resetAfterSubmit?: boolean;
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  // Form state
  values: T;
  defaultValues: Partial<T>;
  errors: Record<keyof T, string> | null;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isLoading: boolean;
  submitError: Error | null;
  
  // Form operations
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setTouched: <K extends keyof T>(field: K, isTouched?: boolean) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  clearErrors: () => void;
  reset: () => void;
  
  // Form submission
  validate: () => boolean;
  submit: () => Promise<void>;
  
  // Record operations
  create: (data?: Partial<T>) => Promise<T>;
  update: (data?: Partial<T>) => Promise<T>;
}

/**
 * Hook for managing form state and submission
 */
export function useForm<T extends Record<string, unknown>>({
  resource,
  id,
  defaultValues = {} as Partial<T>,
  provider = 'rest',
  providerOptions = {},
  schema,
  onSuccess,
  onError,
  resetAfterSubmit = false,
}: UseFormParams<T>): UseFormReturn<T> {
  // Create data provider
  const dataProvider = createDataProvider({
    type: provider,
    config: providerOptions,
  });

  // Form state
  const [values, setValues] = useState<T>(defaultValues as T);
  const [errors, setErrors] = useState<Record<keyof T, string> | null>(null);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  // Load record if id is provided
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      
      dataProvider
        .getOne({ resource, id })
        .then(response => {
          setValues(response.data as T);
        })
        .catch(error => {
          setSubmitError(error instanceof Error ? error : new Error(String(error)));
          onError?.(error instanceof Error ? error : new Error(String(error)));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [resource, id, dataProvider, onError]);

  // Set a single field value
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
    
    // Clear error for this field
    if (errors?.[field]) {
      setErrors(prev => {
        if (!prev) { return prev; }
        
        const newErrors = { ...prev };
        delete newErrors[field];
        
        return Object.keys(newErrors).length > 0 ? newErrors : null;
      });
    }
  }, [errors]);

  // Set multiple field values
  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
    
    // Mark fields as touched
    const newTouched = { ...touched };
    for (const key of Object.keys(newValues)) {
      newTouched[key as keyof T] = true;
    }
    setTouched(newTouched);
    
    // Clear errors for these fields
    if (errors) {
      setErrors(prev => {
        if (!prev) { return prev; }
        
        const newErrors = { ...prev };
        for (const key of Object.keys(newValues)) {
          delete newErrors[key as keyof T];
        }
        
        return Object.keys(newErrors).length > 0 ? newErrors : null;
      });
    }
  }, [touched, errors]);

  // Set a field as touched
  const setFieldTouched = useCallback(<K extends keyof T>(field: K, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [field]: isTouched,
    }));
  }, []);

  // Set an error for a field
  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors(prev => {
      const newErrors = { ...(prev || {}) } as Record<keyof T, string>;
      newErrors[field] = error;
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors(null);
  }, []);

  // Reset form to default values
  const reset = useCallback(() => {
    setValues(defaultValues as T);
    setErrors(null);
    setTouched({} as Record<keyof T, boolean>);
    setSubmitError(null);
  }, [defaultValues]);

  // Helper function to handle validation errors
  const handleValidationError = useCallback((error: unknown): boolean => {
    if (error instanceof z.ZodError) {
      const fieldErrors = {} as Record<keyof T, string>;
      
      for (const err of error.errors) {
        const field = (err.path[0] as string) as keyof T;
        fieldErrors[field] = err.message;
      }
      
      setErrors(fieldErrors);
    } else {
      // Handle non-ZodError cases
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErrors({ _form: errorMessage } as unknown as Record<keyof T, string>);
    }
    
    return false;
  }, []);

  // Validate form
  const validate = useCallback(() => {
    // Clear previous errors
    clearErrors();
    
    // If schema is provided, use it for validation
    if (schema) {
      try {
        schema.parse(values);
        return true;
      } catch (error: unknown) {
        return handleValidationError(error);
      }
    }
    
    // No schema, assume valid
    return true;
  }, [values, schema, clearErrors, handleValidationError]);

  // Submit form
  const submit = useCallback(async (): Promise<void> => {
    // Validate form
    const isValid = validate();
    
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      let response: { data: unknown };
      
      if (id) {
        // Update existing record
        response = await dataProvider.update({
          resource,
          id,
          variables: values,
        });
      } else {
        // Create new record
        response = await dataProvider.create({
          resource,
          variables: values,
        });
      }
      
      onSuccess?.(response.data as T);
      
      if (resetAfterSubmit) {
        reset();
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      setSubmitError(err);
      onError?.(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [resource, id, values, dataProvider, validate, onSuccess, onError, resetAfterSubmit, reset]);

  // Create record
  const create = useCallback(async (data?: Partial<T>): Promise<T> => {
    if (data) {
      setFormValues(data);
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const dataToSubmit = data ? { ...values, ...data } : values;
      
      const response = await dataProvider.create({
        resource,
        variables: dataToSubmit,
      });
      
      onSuccess?.(response.data as T);
      
      if (resetAfterSubmit) {
        reset();
      }
      
      return response.data as T;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      setSubmitError(err);
      onError?.(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [resource, values, dataProvider, setFormValues, onSuccess, onError, resetAfterSubmit, reset]);

  // Update record
  const update = useCallback(async (data?: Partial<T>): Promise<T> => {
    if (!id) {
      throw new Error('Cannot update record without id');
    }
    
    if (data) {
      setFormValues(data);
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const dataToSubmit = data ? { ...values, ...data } : values;
      
      const response = await dataProvider.update({
        resource,
        id,
        variables: dataToSubmit,
      });
      
      onSuccess?.(response.data as T);
      
      if (resetAfterSubmit) {
        reset();
      }
      
      return response.data as T;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      setSubmitError(err);
      onError?.(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [resource, id, values, dataProvider, setFormValues, onSuccess, onError, resetAfterSubmit, reset]);

  return {
    // Form state
    values,
    defaultValues,
    errors,
    touched,
    isSubmitting,
    isLoading,
    submitError,
    
    // Form operations
    setValue,
    setValues: setFormValues,
    setTouched: setFieldTouched,
    setError,
    clearErrors,
    reset,
    
    // Form submission
    validate,
    submit,
    
    // Record operations
    create,
    update,
  };
}
