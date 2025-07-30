/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@repo/design-system/lib/utils';

/* ---------------------------------- Types ---------------------------------- */

export interface DividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'> {
  /**
   * The orientation of the divider.
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * The variant of the divider.
   * @default "default"
   */
  variant?: 'default' | 'inset' | 'middle';
  
  /**
   * The alignment of the text content.
   * @default "center"
   */
  textAlign?: 'center' | 'left' | 'right';
  
  /**
   * If true, the divider will adapt to a flex container.
   * @default false
   */
  flexItem?: boolean;
  
  /**
   * If true, the divider will have a dashed style.
   * @default false
   */
  dashed?: boolean;
  
  /**
   * If true, the divider will be rendered as a child component.
   * @default false
   */
  asChild?: boolean;
}

/* -------------------------------- Variants -------------------------------- */

const dividerVariants = cva(
  'shrink-0 bg-border',
  {
    variants: {
      orientation: {
        horizontal: 'w-full h-px',
        vertical: 'h-full w-px',
      },
      variant: {
        default: '',
        inset: 'mx-4',
        middle: 'mx-2',
      },
      textAlign: {
        center: 'flex items-center justify-center before:content-[""] before:flex-[1_1_0%] before:border-t before:border-border after:content-[""] after:flex-[1_1_0%] after:border-t after:border-border',
        left: 'flex items-center before:content-[""] before:flex-[0_1_5%] before:border-t before:border-border after:content-[""] after:flex-[1_1_0%] after:border-t after:border-border',
        right: 'flex items-center before:content-[""] before:flex-[1_1_0%] before:border-t before:border-border after:content-[""] after:flex-[0_1_5%] after:border-t after:border-border',
      },
      flexItem: {
        true: 'self-stretch',
        false: '',
      },
      dashed: {
        true: 'border-dashed',
        false: '',
      },
      withChildren: {
        true: 'border-0 h-auto',
        false: '',
      },
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        withChildren: true,
        class: 'flex',
      },
      {
        orientation: 'vertical',
        withChildren: true,
        class: 'flex flex-col',
      },
      {
        orientation: 'horizontal',
        dashed: true,
        class: 'border-t border-b-0 border-l-0 border-r-0 border-dashed border-border bg-transparent h-0',
      },
      {
        orientation: 'vertical',
        dashed: true,
        class: 'border-l border-t-0 border-b-0 border-r-0 border-dashed border-border bg-transparent w-0',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'default',
      textAlign: 'center',
      flexItem: false,
      dashed: false,
      withChildren: false,
    },
  }
);

/* -------------------------------- Component -------------------------------- */

type DividerElement = HTMLDivElement | HTMLHRElement;

const Divider = React.forwardRef<DividerElement, DividerProps & VariantProps<typeof dividerVariants>>(
  ({ 
    className, 
    orientation = 'horizontal', 
    variant = 'default', 
    textAlign = 'center',
    flexItem = false,
    dashed = false,
    asChild = false,
    children,
    ...props 
  }, ref) => {
    const withChildren = Boolean(children);
    // Use type assertion to help TypeScript understand the element type
    const Comp = asChild ? Slot : withChildren ? 'div' : orientation === 'horizontal' ? 'hr' : 'div';
    
    return (
      <Comp
        ref={ref as any}
        role={orientation === 'vertical' ? 'separator' : undefined}
        aria-orientation={orientation}
        data-orientation={orientation}
        data-slot="divider"
        className={cn(
          dividerVariants({ 
            orientation, 
            variant, 
            textAlign: withChildren ? textAlign : undefined, 
            flexItem, 
            dashed,
            withChildren,
          }),
          className
        )}
        {...props}
      >
        {withChildren && (
          <span className="px-2 text-xs text-muted-foreground">
            {children}
          </span>
        )}
      </Comp>
    );
  }
);

Divider.displayName = 'Divider';

/* --------------------------------- Exports --------------------------------- */

export { Divider };
