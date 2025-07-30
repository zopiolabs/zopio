/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { Check, CircleAlert } from 'lucide-react';

import { cn } from '@repo/design-system/lib/utils';

/* ---------------------------------- Types ---------------------------------- */

export interface EnhancedProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  /**
   * Position of the value label
   * @default 'none'
   */
  labelPosition?: 'none' | 'start' | 'start-outside' | 'follow' | 'end' | 'end-outside';
  
  /**
   * Custom label renderer function
   */
  label?: (value?: number | null) => React.ReactNode;
  
  /**
   * Additional className for the value label
   */
  labelClassName?: string;

  /**
   * The shape of the progress bar
   * @default 'rounded'
   */
  shape?: 'rounded' | 'square' | 'pill';

  /**
   * Whether the progress bar is indeterminate
   * @default false
   */
  indeterminate?: boolean;

  /**
   * The status of the progress bar
   * @default 'default'
   */
  status?: 'default' | 'success' | 'error' | 'warning';

  /**
   * Whether to show a status icon when completed or error
   * @default false
   */
  showStatusIcon?: boolean;

  /**
   * Whether to show a radial progress instead of a linear one
   * @default false
   */
  radial?: boolean;

  /**
   * The size of the radial progress
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * The thickness of the radial progress
   * @default 'md'
   */
  thickness?: 'sm' | 'md' | 'lg';

  /**
   * Custom classNames for specific parts of the component
   */
  classNames?: {
    root?: string;
    indicator?: string;
    label?: string;
    statusIcon?: string;
  };
}

/* -------------------------------- Variants -------------------------------- */

const progressVariants = cva(
  'relative overflow-hidden bg-secondary',
  {
    variants: {
      variant: {
        default: 'bg-secondary',
        success: 'bg-success/20',
        error: 'bg-destructive/20',
        warning: 'bg-warning/20',
      },
      shape: {
        rounded: 'rounded-full',
        square: 'rounded-none',
        pill: 'rounded-full',
      },
      size: {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
        xl: 'h-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      shape: 'rounded',
      size: 'md',
    },
  }
);

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 transition-all',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-success',
        error: 'bg-destructive',
        warning: 'bg-warning',
      },
      indeterminate: {
        true: 'animate-indeterminate-progress',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      indeterminate: false,
    },
  }
);

const radialProgressVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      size: {
        sm: 'h-16 w-16',
        md: 'h-24 w-24',
        lg: 'h-32 w-32',
        xl: 'h-40 w-40',
      },
      variant: {
        default: 'bg-secondary',
        success: 'bg-success/20',
        error: 'bg-destructive/20',
        warning: 'bg-warning/20',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

const radialProgressIndicatorVariants = cva(
  'absolute inset-0 flex items-center justify-center',
  {
    variants: {
      thickness: {
        sm: '[--thickness:0.25rem]',
        md: '[--thickness:0.5rem]',
        lg: '[--thickness:0.75rem]',
      },
    },
    defaultVariants: {
      thickness: 'md',
    },
  }
);

/* -------------------------------- Component ------------------------------- */

const EnhancedProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  EnhancedProgressProps
>(({
  className,
  classNames,
  value,
  max = 100,
  labelPosition = 'none',
  label,
  labelClassName,
  shape = 'rounded',
  indeterminate = false,
  status = 'default',
  showStatusIcon = false,
  radial = false,
  size = 'md',
  thickness = 'md',
  ...props
}, ref) => {
  const valueCommonClass = cn(
    'absolute -top-0.5 left-0 h-fit px-4 w-full items-center hidden'
  );

  const variant = status;

  // Calculate the percentage for the progress indicator
  const percentage = React.useMemo(() => {
    if (indeterminate) return 0;
    return Math.min(Math.max(0, ((value || 0) / max) * 100), 100);
  }, [value, max, indeterminate]);

  // Function to render the label
  const ProgressLabel = () => (
    <span
      data-slot="progress-label"
      className={cn(
        'hidden',
        labelPosition === 'start-outside' && 'block text-foreground',
        labelPosition === 'follow' && cn(valueCommonClass, 'flex justify-end text-primary-foreground'),
        labelPosition === 'start' && cn(valueCommonClass, 'flex justify-start text-primary-foreground'),
        labelPosition === 'end' && cn(valueCommonClass, 'flex justify-end text-foreground'),
        labelPosition === 'end-outside' && 'block text-foreground',
        labelClassName,
        classNames?.label
      )}
    >
      {typeof label === 'function' ? label(value) : `${value}%`}
    </span>
  );

  // Function to render the status icon
  const StatusIcon = () => {
    if (!showStatusIcon || indeterminate) return null;
    
    if (percentage === 100 && status !== 'error') {
      return (
        <div 
          data-slot="progress-status-icon"
          className={cn(
            'absolute right-0 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-success-foreground',
            classNames?.statusIcon
          )}
        >
          <Check className="h-3 w-3" />
        </div>
      );
    }
    
    if (status === 'error') {
      return (
        <div 
          data-slot="progress-status-icon"
          className={cn(
            'absolute right-0 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground',
            classNames?.statusIcon
          )}
        >
          <CircleAlert className="h-3 w-3" />
        </div>
      );
    }
    
    return null;
  };

  // Render radial progress
  if (radial) {
    return (
      <div className="relative inline-flex flex-col items-center gap-2">
        <div
          data-slot="radial-progress"
          className={cn(
            radialProgressVariants({ size, variant }),
            className,
            classNames?.root
          )}
        >
          <div
            data-slot="radial-progress-indicator"
            className={cn(
              radialProgressIndicatorVariants({ thickness }),
              classNames?.indicator
            )}
            style={{
              background: indeterminate
                ? `conic-gradient(currentColor 0%, transparent 0%)`
                : `conic-gradient(currentColor ${percentage}%, transparent ${percentage}%)`,
            }}
          >
            <div className="absolute inset-[var(--thickness)] rounded-full bg-background"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            {labelPosition !== 'none' && (
              <span
                data-slot="radial-progress-label"
                className={cn(
                  'text-center font-medium',
                  size === 'sm' && 'text-sm',
                  size === 'md' && 'text-base',
                  size === 'lg' && 'text-lg',
                  size === 'xl' && 'text-xl',
                  labelClassName,
                  classNames?.label
                )}
              >
                {typeof label === 'function' ? label(value) : `${Math.round(percentage)}%`}
              </span>
            )}
          </div>
        </div>
        {labelPosition === 'end-outside' && (
          <span className={cn('text-sm font-medium', labelClassName, classNames?.label)}>
            {typeof label === 'function' ? label(value) : `${Math.round(percentage)}%`}
          </span>
        )}
      </div>
    );
  }

  // Render linear progress
  return (
    <div className="relative flex items-center gap-2">
      {labelPosition === 'start-outside' && <ProgressLabel />}
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        value={value}
        max={max}
        className={cn(
          progressVariants({ variant, shape, size }),
          className,
          classNames?.root
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            progressIndicatorVariants({ variant, indeterminate }),
            classNames?.indicator
          )}
          style={!indeterminate ? { transform: `translateX(-${100 - percentage}%)` } : undefined}
        >
          {labelPosition === 'follow' && <ProgressLabel />}
        </ProgressPrimitive.Indicator>
        {(labelPosition === 'start' || labelPosition === 'end') && <ProgressLabel />}
        {showStatusIcon && <StatusIcon />}
      </ProgressPrimitive.Root>
      {labelPosition === 'end-outside' && <ProgressLabel />}
    </div>
  );
});

EnhancedProgress.displayName = 'EnhancedProgress';

/* --------------------------------- Exports --------------------------------- */

export { EnhancedProgress };
