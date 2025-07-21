/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@repo/design-system/lib/utils';

const heroBadgeVariants = cva(
  'inline-flex items-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost:
          'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Base props shared by both button and link variants
interface HeroBadgeBaseProps {
  text: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  variant?: VariantProps<typeof heroBadgeVariants>['variant'];
  size?: VariantProps<typeof heroBadgeVariants>['size'];
}

// Button variant
interface HeroBadgeButtonProps extends 
  HeroBadgeBaseProps, 
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'size'> {
  asChild?: boolean;
}

const HeroBadgeButton = React.forwardRef<HTMLButtonElement, HeroBadgeButtonProps>(
  ({ className, variant, size, text, icon, endIcon, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(heroBadgeVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{text}</span>
        {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
      </Comp>
    );
  }
);

HeroBadgeButton.displayName = 'HeroBadgeButton';

// Link variant
interface HeroBadgeLinkProps extends 
  HeroBadgeBaseProps, 
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'size'> {
  asChild?: boolean;
}

const HeroBadgeLink = React.forwardRef<HTMLAnchorElement, HeroBadgeLinkProps>(
  ({ className, variant, size, text, icon, endIcon, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    
    return (
      <Comp
        className={cn(heroBadgeVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{text}</span>
        {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
      </Comp>
    );
  }
);

HeroBadgeLink.displayName = 'HeroBadgeLink';

// Main component that decides which variant to use
const HeroBadge = React.forwardRef<HTMLElement, HeroBadgeButtonProps | HeroBadgeLinkProps>((
  props, 
  ref
) => {
  const { href } = props as HeroBadgeLinkProps;
  
  if (href) {
    return <HeroBadgeLink {...props as HeroBadgeLinkProps} ref={ref as React.Ref<HTMLAnchorElement>} />;
  }
  
  return <HeroBadgeButton {...props as HeroBadgeButtonProps} ref={ref as React.Ref<HTMLButtonElement>} />;
});

HeroBadge.displayName = 'HeroBadge';

export { HeroBadge, heroBadgeVariants, HeroBadgeButton, HeroBadgeLink };
