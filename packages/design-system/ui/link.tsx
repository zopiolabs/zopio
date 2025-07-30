/**
 * SPDX-License-Identifier: MIT
 */

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { ExternalLink } from 'lucide-react';
import * as React from 'react';

import { cn } from '@repo/design-system/lib/utils';

const linkVariants = cva(
  'inline-flex items-center gap-1.5 font-medium outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-primary hover:text-primary/80',
        destructive: 'text-destructive hover:text-destructive/80',
        muted: 'text-muted-foreground hover:text-foreground',
        accent: 'text-accent-foreground hover:text-accent-foreground/80',
      },
      underline: {
        always: 'underline underline-offset-4',
        hover: 'no-underline hover:underline hover:underline-offset-4',
        none: 'no-underline',
      },
      size: {
        default: 'text-base',
        sm: 'text-sm',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      underline: 'hover',
      size: 'default',
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
  external?: boolean;
  hideExternalIcon?: boolean;
  disabled?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      underline,
      size,
      asChild = false,
      external = false,
      hideExternalIcon = false,
      children,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'a';
    const externalProps = external
      ? {
          target: target || '_blank',
          rel: rel || 'noopener noreferrer',
        }
      : {};

    return (
      <Comp
        ref={ref}
        data-slot="link"
        className={cn(linkVariants({ variant, underline, size, className }))}
        {...externalProps}
        {...props}
      >
        {children}
        {external && !hideExternalIcon && (
          <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
        )}
      </Comp>
    );
  }
);

Link.displayName = 'Link';

export { Link, linkVariants };
