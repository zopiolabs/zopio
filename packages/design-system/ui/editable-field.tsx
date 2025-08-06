/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { type ChangeEvent, useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '../lib/utils';

export interface EditableFieldProps {
  defaultValue: string;
  onUpdate?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  buttonText?: string;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export function EditableField({
  defaultValue,
  onUpdate,
  className,
  inputClassName,
  buttonClassName,
  buttonText = "Update",
  placeholder = "",
  disabled = false,
  ariaLabel,
}: EditableFieldProps) {
  const [value, setValue] = useState<string>(defaultValue);
  const [initialValue] = useState<string>(defaultValue);
  const hasChanged = value !== initialValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleUpdate = (): void => {
    if (onUpdate) {
      onUpdate(value);
    }
  };

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <Input
        value={value}
        onChange={handleChange}
        className={cn(
          "bg-transparent border-none flex-1 font-medium h-full hover:bg-secondary-foreground/10 p-1 text-xs",
          inputClassName
        )}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
      />
      <Button
        onClick={handleUpdate}
        className={cn(
          "bg-primary h-9 has-[>svg]:px-3 hover:bg-primary/90 px-4 py-2 shadow-xs text-primary-foreground",
          buttonClassName
        )}
        disabled={disabled || !hasChanged}
      >
        {buttonText}
      </Button>
    </div>
  );
}
