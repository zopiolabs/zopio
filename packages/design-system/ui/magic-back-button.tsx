/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { ChevronLeft } from 'lucide-react';

import { cn } from '@repo/design-system/lib/utils';
import { useNavigation } from '@repo/design-system/lib/navigation'; 
import { Button, type ButtonProps } from '@repo/design-system/ui/button';

/**
 * A component that tracks if the user navigated to the current page from within the app
 * and either goes back in history or to a specified fallback route
 */
export interface MagicBackButtonProps extends ButtonProps {
  /**
   * The URL to navigate to when the user directly visits the page (not through navigation)
   * @default '/'
   */
  backLink?: string;
  /**
   * Optional state tracking function to determine if this is the first page in user's session
   * If not provided, the component will use localStorage to track navigation
   */
  isFirstPage?: boolean;
}

/**
 * Magic Back Button component that intelligently navigates back in history or to a fallback route
 *
 * When a user directly visits a page with this button (i.e., their first visit),
 * clicking the button will redirect them to the specified backLink (defaults to homepage).
 *
 * If they navigate to the page from another part of the site, the button behaves like
 * a normal back button, preserving the browser's history.
 */
export const MagicBackButton = React.forwardRef<HTMLButtonElement, MagicBackButtonProps>(
  ({ className, onClick, children, backLink = '/', isFirstPage: isFirstPageProp, ...props }, ref) => {
    const navigation = useNavigation();
    const [isFirstPageState, setIsFirstPageState] = React.useState<boolean | null>(null);

    React.useEffect(() => {
      // If isFirstPage is explicitly provided as a prop, use that
      if (isFirstPageProp !== undefined) {
        return;
      }

      // Otherwise, check localStorage to determine if this is the first page
      const hasNavigationHistory = localStorage.getItem('hasNavigationHistory') === 'true';
      setIsFirstPageState(!hasNavigationHistory);

      // Set navigation history flag
      if (!hasNavigationHistory) {
        localStorage.setItem('hasNavigationHistory', 'true');
      }

      // Cleanup function to handle component unmount
      return () => {
        // No cleanup needed for this component
      };
    }, [isFirstPageProp]);

    // Use the prop if provided, otherwise use the state
    const isFirstPage = isFirstPageProp !== undefined ? isFirstPageProp : isFirstPageState;

    // Handle button click
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isFirstPage) {
        navigation.push(backLink);
      } else {
        navigation.back();
      }

      // Call the original onClick handler if provided
      onClick?.(e);
    };

    return (
      <Button
        className={cn('rounded-full', className)}
        variant="outline"
        size="icon"
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {children ?? <ChevronLeft className="size-4" />}
      </Button>
    );
  }
);

MagicBackButton.displayName = 'MagicBackButton';
