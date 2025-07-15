/**
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// Utility function for class name merging
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;
}

/**
 * SelectField component
 *
 * A reusable select field component that combines label, select dropdown, description, and error message.
 * Can be used in both crud/ui and view-builder modules for consistent form styling.
 */
export const SelectField = React.forwardRef<
  HTMLButtonElement,
  SelectFieldProps
>(
  (
    {
      id,
      name,
      label,
      description,
      error,
      required,
      disabled,
      placeholder,
      options,
      value,
      onChange,
      className,
      labelClassName,
      selectClassName,
      errorClassName,
      descriptionClassName,
    },
    ref
  ) => {
    const fieldId = id || `field-${name}`;
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

        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            id={fieldId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : description ? descriptionId : undefined
            }
            className={cn(error && 'border-destructive', selectClassName)}
          >
            <SelectValue placeholder={placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

SelectField.displayName = 'SelectField';
