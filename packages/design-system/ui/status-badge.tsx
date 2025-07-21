/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      status: {
        'completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900',
        'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-900',
        'pending': 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900',
        'delayed': 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  }
);

const statusIconVariants = cva('h-2 w-2 rounded-full', {
  variants: {
    status: {
      'completed': 'bg-emerald-500',
      'in-progress': 'bg-blue-500',
      'pending': 'bg-amber-500',
      'delayed': 'bg-red-500',
    },
  },
  defaultVariants: {
    status: 'pending',
  },
});

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  animated?: boolean;
  label?: string;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, animated = false, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(statusBadgeVariants({ status }), className)}
        {...props}
      >
        <span className="relative flex h-2 w-2 items-center justify-center">
          {status === 'in-progress' && animated ? (
            <Loader2 className="h-3 w-3 animate-spin text-blue-600 dark:text-blue-400" />
          ) : (
            <>
              {animated && status === 'in-progress' && (
                <span
                  className={cn(
                    'absolute inline-flex h-full w-full animate-ping opacity-75',
                    statusIconVariants({ status })
                  )}
                />
              )}
              <span className={cn(statusIconVariants({ status }))} />
            </>
          )}
        </span>
        {label && <span>{label}</span>}
      </div>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };
