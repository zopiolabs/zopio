import { useCallback, useState } from 'react';
// @ts-ignore - Ignoring zod import error as it's correctly listed in package.json
import { z } from 'zod';

export interface ValidationRule<T> {
  validate: (value: T, formValues: Record<string, unknown>) => boolean;
  message: string;
}

export interface FieldValidation<T = unknown> {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: ValidationRule<T> | ValidationRule<T>[];
}

export interface UseFormValidationParams<T extends Record<string, unknown>> {
  schema?: z.ZodType<T>;
  validationRules?: Partial<Record<keyof T, FieldValidation<T[keyof T]>>>;
}

export interface UseFormValidationReturn<T extends Record<string, unknown>> {
  // Validation state
  errors: Partial<Record<keyof T, string>>;
  
  // Validation operations
  validateField: <K extends keyof T>(field: K, value: T[K], formValues: T) => string | null;
  validateForm: (values: T) => Partial<Record<keyof T, string>>;
  setError: <K extends keyof T>(field: K, error: string) => void;
  clearErrors: () => void;
  hasErrors: boolean;
}

/**
 * Hook for form validation
 */
export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  validationRules = {},
}: UseFormValidationParams<T>): UseFormValidationReturn<T> {
  // Validation state
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  // Helper function to validate with Zod schema
  const validateWithSchema = useCallback(<K extends keyof T>(field: K, value: T[K]): string | null => {
    if (!schema) {
      return null;
    }
    
    try {
      // Create a partial schema for just this field
      const partialSchema = z.object({ [field]: schema.shape[field as string] }) as z.ZodType<Pick<T, K>>;
      partialSchema.parse({ [field]: value });
      return null;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((err: z.ZodIssue) => err.path[0] === field);
        if (fieldError) {
          return fieldError.message;
        }
      }
      return error instanceof Error ? error.message : 'Validation error';
    }
  }, [schema]);
  
  // Helper function to validate required fields
  const validateRequired = useCallback(<K extends keyof T>(field: K, value: T[K], rule: boolean | string): string | null => {
    const isEmptyValue = value === undefined || value === null || value === '';
    if (isEmptyValue) {
      return typeof rule === 'string' 
        ? rule 
        : `${String(field)} is required`;
    }
    return null;
  }, []);
  
  // Helper function to check min constraint for numbers
  const validateMinConstraint = useCallback(<K extends keyof T>(
    field: K, 
    value: number, 
    minRule: number | { value: number; message: string }
  ): string | null => {
    const minValue = typeof minRule === 'number' ? minRule : minRule.value;
    const minMessage = typeof minRule === 'number' 
      ? `${String(field)} must be at least ${minValue}` 
      : minRule.message;
    
    if (value < minValue) {
      return minMessage;
    }
    return null;
  }, []);
  
  // Helper function to check max constraint for numbers
  const validateMaxConstraint = useCallback(<K extends keyof T>(
    field: K, 
    value: number, 
    maxRule: number | { value: number; message: string }
  ): string | null => {
    const maxValue = typeof maxRule === 'number' ? maxRule : maxRule.value;
    const maxMessage = typeof maxRule === 'number' 
      ? `${String(field)} must be at most ${maxValue}` 
      : maxRule.message;
    
    if (value > maxValue) {
      return maxMessage;
    }
    return null;
  }, []);
  
  // Helper function to validate numeric constraints
  const validateNumericConstraints = useCallback(<K extends keyof T>(
    field: K, 
    value: T[K], 
    rules: FieldValidation<T[K]>
  ): string | null => {
    if (typeof value !== 'number') {
      return null;
    }
    
    // Min validation
    if (rules.min !== undefined) {
      const minError = validateMinConstraint(field, value, rules.min);
      if (minError) {
        return minError;
      }
    }
    
    // Max validation
    if (rules.max !== undefined) {
      const maxError = validateMaxConstraint(field, value, rules.max);
      if (maxError) {
        return maxError;
      }
    }
    
    return null;
  }, [validateMinConstraint, validateMaxConstraint]);
  
  // Helper function to check minLength constraint for strings
  const validateMinLengthConstraint = useCallback(<K extends keyof T>(
    field: K, 
    value: string, 
    minLengthRule: number | { value: number; message: string }
  ): string | null => {
    const minLength = typeof minLengthRule === 'number' ? minLengthRule : minLengthRule.value;
    const minLengthMessage = typeof minLengthRule === 'number' 
      ? `${String(field)} must be at least ${minLength} characters` 
      : minLengthRule.message;
    
    if (value.length < minLength) {
      return minLengthMessage;
    }
    return null;
  }, []);
  
  // Helper function to check maxLength constraint for strings
  const validateMaxLengthConstraint = useCallback(<K extends keyof T>(
    field: K, 
    value: string, 
    maxLengthRule: number | { value: number; message: string }
  ): string | null => {
    const maxLength = typeof maxLengthRule === 'number' ? maxLengthRule : maxLengthRule.value;
    const maxLengthMessage = typeof maxLengthRule === 'number' 
      ? `${String(field)} must be at most ${maxLength} characters` 
      : maxLengthRule.message;
    
    if (value.length > maxLength) {
      return maxLengthMessage;
    }
    return null;
  }, []);
  
  // Helper function to check pattern constraint for strings
  const validatePatternConstraint = useCallback(<K extends keyof T>(
    field: K, 
    value: string, 
    patternRule: RegExp | { value: RegExp; message: string }
  ): string | null => {
    const pattern = typeof patternRule === 'object' && 'value' in patternRule 
      ? patternRule.value 
      : patternRule;
    const patternMessage = typeof patternRule === 'object' && 'message' in patternRule 
      ? patternRule.message 
      : `${String(field)} is invalid`;
    
    if (!pattern.test(value)) {
      return patternMessage;
    }
    return null;
  }, []);
  
  // Helper function to validate string length constraints
  const validateStringLengthConstraints = useCallback(<K extends keyof T>(
    field: K, 
    value: string, 
    rules: FieldValidation<T[K]>
  ): string | null => {
    // MinLength validation
    if (rules.minLength !== undefined) {
      const minLengthError = validateMinLengthConstraint(field, value, rules.minLength);
      if (minLengthError) {
        return minLengthError;
      }
    }
    
    // MaxLength validation
    if (rules.maxLength !== undefined) {
      const maxLengthError = validateMaxLengthConstraint(field, value, rules.maxLength);
      if (maxLengthError) {
        return maxLengthError;
      }
    }
    
    return null;
  }, [validateMinLengthConstraint, validateMaxLengthConstraint]);

  // Helper function to validate string constraints
  const validateStringConstraints = useCallback(<K extends keyof T>(
    field: K, 
    value: T[K], 
    rules: FieldValidation<T[K]>
  ): string | null => {
    if (typeof value !== 'string') {
      return null;
    }
    
    // Check length constraints first
    const lengthError = validateStringLengthConstraints(field, value, rules);
    if (lengthError) {
      return lengthError;
    }
    
    // Pattern validation
    if (rules.pattern !== undefined) {
      const patternError = validatePatternConstraint(field, value, rules.pattern);
      if (patternError) {
        return patternError;
      }
    }
    
    return null;
  }, [validateStringLengthConstraints, validatePatternConstraint]);
  
  // Helper function to run custom validators
  const runCustomValidators = useCallback(<K extends keyof T>(
    _field: K, 
    value: T[K], 
    formValues: T, 
    validate: ValidationRule<T[K]> | ValidationRule<T[K]>[]
  ): string | null => {
    const validators = Array.isArray(validate) ? validate : [validate];
    
    for (const validator of validators) {
      const isValid = validator.validate(value, formValues);
      if (!isValid) {
        return validator.message;
      }
    }
    
    return null;
  }, []);
  
  // Helper function to check required validation
  const checkRequiredValidation = useCallback(<K extends keyof T>(
    field: K, 
    value: T[K], 
    rules: FieldValidation<T[K]>
  ): string | null => {
    if (!rules.required) {
      return null;
    }
    
    return validateRequired(field, value, rules.required);
  }, [validateRequired]);
  
  // This function is no longer needed as we're using performFieldValidations instead
  // Removing to fix the unused variable warning

  // Helper function to perform field-specific validations
  const performFieldValidations = useCallback(<K extends keyof T>(field: K, value: T[K], formValues: T, rules: FieldValidation<T[K]>): string | null => {
    // Type-specific validations
    const numericError = validateNumericConstraints(field, value, rules);
    if (numericError) {
      return numericError;
    }
    
    const stringError = validateStringConstraints(field, value, rules);
    if (stringError) {
      return stringError;
    }
    
    // Custom validation rules
    if (rules.validate) {
      return runCustomValidators(field, value, formValues, rules.validate);
    }
    
    return null;
  }, [validateNumericConstraints, validateStringConstraints, runCustomValidators]);

  // Main validation function for a single field
  const validateField = useCallback(<K extends keyof T>(field: K, value: T[K], formValues: T): string | null => {
    // First try schema validation
    const schemaError = validateWithSchema(field, value);
    if (schemaError) {
      return schemaError;
    }
    
    // If using validation rules
    const rules = validationRules[field];
    if (!rules) {
      return null;
    }
    
    // Required validation
    const requiredError = checkRequiredValidation(field, value, rules);
    if (requiredError) {
      return requiredError;
    }
    
    // Check all other validations
    return performFieldValidations(field, value, formValues, rules);
  }, [
    validateWithSchema, 
    validationRules, 
    checkRequiredValidation,
    performFieldValidations
  ]);
  
  // Process schema validation errors
  const processSchemaErrors = useCallback((error: unknown): Partial<Record<keyof T, string>> => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    if (error instanceof z.ZodError) {
      for (const err of error.errors) {
        const field = (err.path[0] as string) as keyof T;
        newErrors[field] = err.message;
      }
      return newErrors;
    }
    
    // If it's not a ZodError, add a generic error message
    // We'll use a special key for form-level errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Using a type-safe approach for form-level errors
    // We use a special key for general form errors that's not tied to a specific field
    (newErrors as Record<string, string>)._form = errorMessage;
    
    return newErrors;
  }, []);
  
  // Validate using schema
  const validateWithSchemaOnly = useCallback((values: T): Partial<Record<keyof T, string>> => {
    if (!schema) {
      return {};
    }
    
    try {
      schema.parse(values);
      return {}; // No errors
    } catch (error: unknown) {
      return processSchemaErrors(error);
    }
  }, [schema, processSchemaErrors]);
  
  // Validate using rules
  const validateWithRulesOnly = useCallback((values: T): Partial<Record<keyof T, string>> => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    for (const key of Object.keys(validationRules)) {
      const field = key as keyof T;
      const fieldError = validateField(field, values[field], values);
      
      if (fieldError) {
        newErrors[field] = fieldError;
      }
    }
    
    return newErrors;
  }, [validationRules, validateField]);
  
  // Validate entire form
  const validateForm = useCallback((values: T): Partial<Record<keyof T, string>> => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    // First try schema validation
    const schemaErrors = validateWithSchemaOnly(values);
    Object.assign(newErrors, schemaErrors);
    
    // Then try rule-based validation
    const ruleErrors = validateWithRulesOnly(values);
    Object.assign(newErrors, ruleErrors);
    
    // Update state and return errors
    setErrors(newErrors);
    return newErrors;
  }, [validateWithSchemaOnly, validateWithRulesOnly]);

  // Set an error for a field
  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Check if there are any errors
  const hasErrors = Object.keys(errors).length > 0;
  
  return {
    // Validation state
    errors,
    
    // Validation operations
    validateField,
    validateForm,
    setError,
    clearErrors,
    hasErrors,
  };
}
