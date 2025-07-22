/**
 * SPDX-License-Identifier: MIT
 */

import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';

import { cn } from '@repo/design-system/lib/utils';

const enhancedButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*="size-"])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      size: {
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        md: 'h-9 px-4 py-2 has-[>svg]:px-3',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
      },
      iconPosition: {
        left: 'flex-row',
        right: 'flex-row-reverse',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      iconPosition: 'left',
    },
  }
);

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant,
      size,
      iconPosition,
      asChild = false,
      isLoading = false,
      loadingText,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const displayText = isLoading && loadingText ? loadingText : children;

    return (
      <Comp
        ref={ref}
        data-slot="enhanced-button"
        className={cn(enhancedButtonVariants({ variant, size, iconPosition, className }))}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {displayText}
      </Comp>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export { EnhancedButton, enhancedButtonVariants };
