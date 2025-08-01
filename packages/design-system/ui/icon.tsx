/**
 * SPDX-License-Identifier: MIT
 */

import * as React from 'react';
import { type LucideProps } from 'lucide-react';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@repo/design-system/lib/utils';

const iconVariants = cva('inline-block shrink-0', {
  variants: {
    size: {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-8',
      '2xl': 'size-10',
      '3xl': 'size-12',
      '4xl': 'size-16',
      custom: '', // For custom sizes via className
    },
    color: {
      current: 'text-current',
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted-foreground',
      accent: 'text-accent-foreground',
      destructive: 'text-destructive',
      success: 'text-green-600 dark:text-green-500',
      warning: 'text-amber-600 dark:text-amber-500',
      info: 'text-blue-600 dark:text-blue-500',
    },
    variant: {
      default: '',
      solid: '',
      outline: 'stroke-[1.5]',
      bold: 'stroke-[2]',
      thin: 'stroke-[0.5]',
    },
    animation: {
      none: '',
      spin: 'animate-spin',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'current',
    variant: 'default',
    animation: 'none',
  },
});

export interface IconProps
  extends Omit<React.SVGAttributes<SVGElement>, 'color' | 'size'>,
    VariantProps<typeof iconVariants> {
  /**
   * The icon component to render
   */
  as?: React.FC<LucideProps> | React.ComponentType<React.SVGAttributes<SVGElement>>;
  /**
   * Label for accessibility
   */
  label?: string;
  /**
   * Whether the icon is decorative only (no semantic meaning)
   */
  decorative?: boolean;
}

/**
 * Icon component that provides a consistent way to display icons
 * with various sizes, colors, and animations.
 */
const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      as: IconComponent,
      className,
      size,
      color,
      variant,
      animation,
      label,
      decorative = false,
      ...props
    },
    ref
  ) => {
    // If no IconComponent is provided, render a placeholder or nothing
    if (!IconComponent) {
      return null;
    }

    const ariaProps = decorative
      ? { 'aria-hidden': true }
      : { 'aria-label': label || 'icon' };

    return (
      <IconComponent
        ref={ref}
        className={cn(iconVariants({ size, color, variant, animation }), className)}
        data-slot="icon"
        {...ariaProps}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export { Icon, iconVariants };
