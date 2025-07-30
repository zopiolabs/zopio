/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@repo/design-system/lib/utils';

/* ---------------------------------- Types ---------------------------------- */

export interface RadioProps
  extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, 'title'>,
    VariantProps<typeof radioVariants> {
  /**
   * Label for the radio button
   */
  label?: React.ReactNode;
  /**
   * Description text for the radio button
   */
  description?: React.ReactNode;
  /**
   * Whether to render the component as a child
   */
  asChild?: boolean;
  /**
   * Whether the radio is disabled
   */
  disabled?: boolean;
  /**
   * Custom classNames for specific parts of the component
   */
  classNames?: {
    root?: string;
    button?: string;
    indicator?: string;
    label?: string;
    description?: string;
  };
  /**
   * Whether to use a card layout for the radio
   */
  isCard?: boolean;
  /**
   * Icon to display when radio is selected
   */
  icon?: React.ReactNode;
  /**
   * Whether to hide the default indicator
   */
  hideIndicator?: boolean;
}

/* -------------------------------- Variants -------------------------------- */

const radioVariants = cva(
  'aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      size: {
        sm: 'size-3',
        md: 'size-4',
        lg: 'size-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const radioCardVariants = cva(
  'group relative flex w-full rounded-md border border-input bg-background p-4 transition-colors hover:bg-accent/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent/50 [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary',
  {
    variants: {
      layout: {
        horizontal: 'flex-row items-center gap-4',
        vertical: 'flex-col items-start gap-2',
      },
    },
    defaultVariants: {
      layout: 'horizontal',
    },
  }
);

/* -------------------------------- Component ------------------------------- */

const Radio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioProps
>(
  (
    {
      asChild = false,
      className,
      classNames,
      description,
      disabled,
      hideIndicator = false,
      icon,
      id,
      isCard = false,
      label,
      size,
      ...props
    },
    ref
  ) => {
    const RadioComponent = asChild ? Slot : RadioGroupPrimitive.Item;
    const generatedId = React.useId();
    const radioId = id || generatedId;

    // Simple radio button
    if (!isCard) {
      return (
        <div
          data-slot="radio-root"
          className={cn('flex items-center gap-2', classNames?.root, className)}
        >
          <RadioComponent
            ref={ref}
            id={radioId}
            disabled={disabled}
            data-slot="radio-button"
            className={cn(radioVariants({ size }), classNames?.button)}
            {...props}
          >
            {!hideIndicator && (
              <RadioGroupPrimitive.Indicator
                data-slot="radio-indicator"
                className={cn(
                  'relative flex items-center justify-center',
                  classNames?.indicator
                )}
              >
                {icon || (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-2 fill-primary"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </RadioGroupPrimitive.Indicator>
            )}
          </RadioComponent>
          {(label || description) && (
            <div className="flex flex-col gap-0.5">
              {label && (
                <label
                  htmlFor={radioId}
                  className={cn(
                    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    classNames?.label
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p
                  className={cn(
                    'text-sm text-muted-foreground',
                    classNames?.description
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }

    // Card style radio
    return (
      <div
        data-slot="radio-card"
        className={cn(
          radioCardVariants({ layout: description ? 'vertical' : 'horizontal' }),
          classNames?.root,
          className
        )}
      >
        <RadioComponent
          ref={ref}
          id={radioId}
          disabled={disabled}
          data-slot="radio-button"
          className={cn(
            'absolute right-4 top-4',
            radioVariants({ size }),
            classNames?.button
          )}
          {...props}
        >
          {!hideIndicator && (
            <RadioGroupPrimitive.Indicator
              data-slot="radio-indicator"
              className={cn(
                'relative flex items-center justify-center',
                classNames?.indicator
              )}
            >
              {icon || (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-2 fill-primary"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              )}
            </RadioGroupPrimitive.Indicator>
          )}
        </RadioComponent>
        <div className="flex flex-col gap-1">
          {label && (
            <label
              htmlFor={radioId}
              className={cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                classNames?.label
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                classNames?.description
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Radio.displayName = 'Radio';

/* -------------------------------- RadioGroup -------------------------------- */

export interface RadioGroupProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
  /**
   * Custom classNames for specific parts of the component
   */
  classNames?: {
    root?: string;
  };
  /**
   * Whether to use a card layout for all radios in the group
   */
  isCard?: boolean;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, classNames, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      data-slot="radio-group"
      className={cn('grid gap-3', classNames?.root, className)}
      {...props}
    />
  );
});

RadioGroup.displayName = 'RadioGroup';

/* --------------------------------- Exports --------------------------------- */

export { Radio, RadioGroup };
