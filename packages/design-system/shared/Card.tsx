/**
 * SPDX-License-Identifier: MIT
 */

import type React from 'react';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as ShadcnCard,
} from '../ui/card';

// Utility function for class name merging
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface CardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

/**
 * Card component
 *
 * A reusable card component that combines header, content, and footer sections.
 * Can be used in both crud/ui and view-builder modules for consistent styling.
 */
export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  titleClassName,
  descriptionClassName,
}) => {
  const hasHeader = title || description;

  return (
    <ShadcnCard className={cn('border shadow-sm', className)}>
      {hasHeader && (
        <CardHeader className={headerClassName}>
          {title && (
            <CardTitle className={cn('font-semibold text-lg', titleClassName)}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription
              className={cn(
                'text-muted-foreground text-sm',
                descriptionClassName
              )}
            >
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      <CardContent className={cn('p-4', contentClassName)}>
        {children}
      </CardContent>

      {footer && (
        <CardFooter
          className={cn('flex justify-end gap-2 p-4 pt-0', footerClassName)}
        >
          {footer}
        </CardFooter>
      )}
    </ShadcnCard>
  );
};

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
