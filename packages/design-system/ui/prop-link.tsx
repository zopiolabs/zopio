/**
 * SPDX-License-Identifier: MIT
 */

import * as React from 'react';

import { cn } from '@repo/design-system/lib/utils';

export interface PropLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

/**
 * A simple link component for documentation and examples
 */
const PropLink = React.forwardRef<HTMLAnchorElement, PropLinkProps>(
  ({ className, href, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

PropLink.displayName = 'PropLink';

export { PropLink };
