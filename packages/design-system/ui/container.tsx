/**
 * SPDX-License-Identifier: MIT
 */

import type * as React from 'react';

import { cn } from '@repo/design-system/lib/utils';

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | 'full';

export interface ContainerProps extends React.ComponentProps<'div'> {
  /**
   * The maximum width of the container.
   * @default '8xl'
   */
  maxWidth?: ContainerSize;
  
  /**
   * If true, the container will take up the full width of its parent.
   * @default false
   */
  fluid?: boolean;
  
  /**
   * If true, the container will be centered horizontally.
   * @default true
   */
  centered?: boolean;
  
  /**
   * If true, the container will have padding on the left and right.
   * @default true
   */
  withPadding?: boolean;
}

/**
 * Container component that centers content horizontally with a maximum width.
 * It's the most basic layout element used to constrain content width.
 */
function Container({
  className,
  maxWidth = '8xl',
  fluid = false,
  centered = true,
  withPadding = true,
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        'w-full',
        // Horizontal centering
        centered && 'mx-auto',
        // Horizontal padding
        withPadding && 'px-4 sm:px-6 md:px-8',
        // Max width based on size
        !fluid && {
          'max-w-xs': maxWidth === 'xs',
          'max-w-sm': maxWidth === 'sm',
          'max-w-md': maxWidth === 'md',
          'max-w-lg': maxWidth === 'lg',
          'max-w-xl': maxWidth === 'xl',
          'max-w-2xl': maxWidth === '2xl',
          'max-w-3xl': maxWidth === '3xl',
          'max-w-4xl': maxWidth === '4xl',
          'max-w-5xl': maxWidth === '5xl',
          'max-w-6xl': maxWidth === '6xl',
          'max-w-7xl': maxWidth === '7xl',
          'max-w-[90rem]': maxWidth === '8xl', // 1440px
          'max-w-full': maxWidth === 'full',
        },
        className
      )}
      {...props}
    />
  );
}

export { Container };
