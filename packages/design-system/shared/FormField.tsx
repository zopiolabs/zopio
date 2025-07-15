/**
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// Utility function for class name merging
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;
}

/**
 * FormField component
 *
 * A reusable form field component that combines label, input, description, and error message.
 * Can be used in both crud/ui and view-builder modules for consistent form styling.
 */
export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      id,
      label,
      description,
      error,
      required,
      className,
      labelClassName,
      inputClassName,
      errorClassName,
      descriptionClassName,
      ...props
    },
    ref
  ) => {
    const fieldId = id || `field-${props.name}`;
    const errorId = error ? `${fieldId}-error` : undefined;
    const descriptionId = description ? `${fieldId}-description` : undefined;

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn('font-medium text-sm', labelClassName)}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </Label>
        )}

        {description && (
          <p
            id={descriptionId}
            className={cn(
              'text-muted-foreground text-sm',
              descriptionClassName
            )}
          >
            {description}
          </p>
        )}

        <Input
          id={fieldId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : description ? descriptionId : undefined
          }
          required={required}
          className={cn(error && 'border-destructive', inputClassName)}
          {...props}
        />

        {error && (
          <p
            id={errorId}
            className={cn('text-destructive text-sm', errorClassName)}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
