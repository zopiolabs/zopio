/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@repo/design-system/lib/utils';
import { Button, type ButtonProps } from './button';

export interface ActionButtonProps extends ButtonProps {
  /**
   * Whether the button is in a loading/pending state
   */
  isPending?: boolean;
  /**
   * Custom spinner component to show during loading state
   */
  spinner?: React.ReactNode;
  /**
   * Whether to maintain the button width during loading state
   */
  maintainWidth?: boolean;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ 
    children, 
    className, 
    isPending = false, 
    spinner, 
    disabled, 
    maintainWidth = true,
    ...props 
  }, ref) => {
    // Store the button's width when it's not in a loading state
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [width, setWidth] = React.useState<number | null>(null);

    // Update width when the button mounts and when children change
    React.useEffect(() => {
      if (buttonRef.current && maintainWidth && !isPending) {
        setWidth(buttonRef.current.getBoundingClientRect().width);
      }
    }, [children, maintainWidth, isPending]);

    // Merge refs
    const mergedRef = React.useMemo(() => {
      return (node: HTMLButtonElement | null) => {
        buttonRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      };
    }, [ref]);

    return (
      <Button
        ref={mergedRef}
        className={cn(
          'relative',
          isPending && 'text-transparent',
          className
        )}
        style={maintainWidth && width ? { width: `${width}px` } : undefined}
        disabled={isPending || disabled}
        aria-disabled={isPending || disabled}
        data-pending={isPending}
        {...props}
      >
        {children}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            {spinner || (
              <Loader2 
                className="animate-spin" 
                style={{ 
                  width: 'var(--spinner-size, 1rem)',
                  height: 'var(--spinner-size, 1rem)'
                }} 
              />
            )}
          </div>
        )}
      </Button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export { ActionButton };
