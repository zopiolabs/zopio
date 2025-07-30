/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@repo/design-system/lib/utils';

/* ---------------------------------- Types ---------------------------------- */

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, the grid will be a container with a max-width.
   * @default false
   */
  container?: boolean;

  /**
   * The number of columns the grid item uses.
   * It can be a number between 1-12, an object like { xs: 12, sm: 6, md: 4 },
   * or 'auto' to fill the available space.
   */
  size?: number | 'auto' | Record<string, number | 'auto'>;

  /**
   * The spacing between grid items.
   * @default 0
   */
  spacing?: number | Record<string, number>;

  /**
   * The spacing between rows.
   * @default 0
   */
  rowSpacing?: number | Record<string, number>;

  /**
   * The spacing between columns.
   * @default 0
   */
  columnSpacing?: number | Record<string, number>;

  /**
   * Defines the horizontal alignment of items.
   */
  justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

  /**
   * Defines the vertical alignment of items.
   */
  alignItems?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';

  /**
   * If true, the component will have the flex item behavior.
   * @default false
   */
  item?: boolean;

  /**
   * If true, the component will render as a child component.
   * @default false
   */
  asChild?: boolean;
}

/* -------------------------------- Variants -------------------------------- */

const gridVariants = cva(
  '',
  {
    variants: {
      container: {
        true: 'flex flex-wrap',
        false: '',
      },
      item: {
        true: 'flex-grow-0',
        false: '',
      },
      justifyContent: {
        start: 'justify-start',
        end: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      alignItems: {
        start: 'items-start',
        end: 'items-end',
        center: 'items-center',
        baseline: 'items-baseline',
        stretch: 'items-stretch',
      },
    },
    defaultVariants: {
      container: false,
      item: false,
    },
  }
);

/* -------------------------------- Utilities ------------------------------- */

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
type Breakpoint = typeof BREAKPOINTS[number];

const SPACING_CLASSES = {
  0: '',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
};

const ROW_SPACING_CLASSES = {
  0: '',
  1: 'gap-y-1',
  2: 'gap-y-2',
  3: 'gap-y-3',
  4: 'gap-y-4',
  5: 'gap-y-5',
  6: 'gap-y-6',
  8: 'gap-y-8',
  10: 'gap-y-10',
  12: 'gap-y-12',
  16: 'gap-y-16',
};

const COLUMN_SPACING_CLASSES = {
  0: '',
  1: 'gap-x-1',
  2: 'gap-x-2',
  3: 'gap-x-3',
  4: 'gap-x-4',
  5: 'gap-x-5',
  6: 'gap-x-6',
  8: 'gap-x-8',
  10: 'gap-x-10',
  12: 'gap-x-12',
  16: 'gap-x-16',
};

const SIZE_CLASSES: Record<string, Record<number | string, string>> = {
  xs: {
    1: 'w-1/12',
    2: 'w-2/12',
    3: 'w-3/12',
    4: 'w-4/12',
    5: 'w-5/12',
    6: 'w-6/12',
    7: 'w-7/12',
    8: 'w-8/12',
    9: 'w-9/12',
    10: 'w-10/12',
    11: 'w-11/12',
    12: 'w-full',
    'auto': 'w-auto',
  },
  sm: {
    1: 'sm:w-1/12',
    2: 'sm:w-2/12',
    3: 'sm:w-3/12',
    4: 'sm:w-4/12',
    5: 'sm:w-5/12',
    6: 'sm:w-6/12',
    7: 'sm:w-7/12',
    8: 'sm:w-8/12',
    9: 'sm:w-9/12',
    10: 'sm:w-10/12',
    11: 'sm:w-11/12',
    12: 'sm:w-full',
    'auto': 'sm:w-auto',
  },
  md: {
    1: 'md:w-1/12',
    2: 'md:w-2/12',
    3: 'md:w-3/12',
    4: 'md:w-4/12',
    5: 'md:w-5/12',
    6: 'md:w-6/12',
    7: 'md:w-7/12',
    8: 'md:w-8/12',
    9: 'md:w-9/12',
    10: 'md:w-10/12',
    11: 'md:w-11/12',
    12: 'md:w-full',
    'auto': 'md:w-auto',
  },
  lg: {
    1: 'lg:w-1/12',
    2: 'lg:w-2/12',
    3: 'lg:w-3/12',
    4: 'lg:w-4/12',
    5: 'lg:w-5/12',
    6: 'lg:w-6/12',
    7: 'lg:w-7/12',
    8: 'lg:w-8/12',
    9: 'lg:w-9/12',
    10: 'lg:w-10/12',
    11: 'lg:w-11/12',
    12: 'lg:w-full',
    'auto': 'lg:w-auto',
  },
  xl: {
    1: 'xl:w-1/12',
    2: 'xl:w-2/12',
    3: 'xl:w-3/12',
    4: 'xl:w-4/12',
    5: 'xl:w-5/12',
    6: 'xl:w-6/12',
    7: 'xl:w-7/12',
    8: 'xl:w-8/12',
    9: 'xl:w-9/12',
    10: 'xl:w-10/12',
    11: 'xl:w-11/12',
    12: 'xl:w-full',
    'auto': 'xl:w-auto',
  },
};

/**
 * Generates size classes based on the size prop
 */
const generateSizeClasses = (size: GridProps['size']): string => {
  if (!size) return '';
  
  if (typeof size === 'number' || size === 'auto') {
    return SIZE_CLASSES.xs[size] || '';
  }
  
  return Object.entries(size)
    .map(([breakpoint, value]) => {
      if (BREAKPOINTS.includes(breakpoint as Breakpoint) && value) {
        return SIZE_CLASSES[breakpoint][value] || '';
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
};

/**
 * Generates spacing classes based on the spacing props
 */
const generateSpacingClasses = (
  spacing?: number | Record<string, number>,
  rowSpacing?: number | Record<string, number>,
  columnSpacing?: number | Record<string, number>,
): string => {
  const classes: string[] = [];

  // Handle general spacing
  if (typeof spacing === 'number') {
    const spacingClass = SPACING_CLASSES[spacing as keyof typeof SPACING_CLASSES];
    if (spacingClass) classes.push(spacingClass);
  } else if (spacing && typeof spacing === 'object') {
    Object.entries(spacing).forEach(([breakpoint, value]) => {
      if (BREAKPOINTS.includes(breakpoint as Breakpoint) && typeof value === 'number') {
        const spacingClass = SPACING_CLASSES[value as keyof typeof SPACING_CLASSES];
        if (spacingClass) {
          if (breakpoint === 'xs') {
            classes.push(spacingClass);
          } else {
            classes.push(`${breakpoint}:${spacingClass}`);
          }
        }
      }
    });
  }

  // Handle row spacing
  if (typeof rowSpacing === 'number') {
    const rowSpacingClass = ROW_SPACING_CLASSES[rowSpacing as keyof typeof ROW_SPACING_CLASSES];
    if (rowSpacingClass) classes.push(rowSpacingClass);
  } else if (rowSpacing && typeof rowSpacing === 'object') {
    Object.entries(rowSpacing).forEach(([breakpoint, value]) => {
      if (BREAKPOINTS.includes(breakpoint as Breakpoint) && typeof value === 'number') {
        const rowSpacingClass = ROW_SPACING_CLASSES[value as keyof typeof ROW_SPACING_CLASSES];
        if (rowSpacingClass) {
          if (breakpoint === 'xs') {
            classes.push(rowSpacingClass);
          } else {
            classes.push(`${breakpoint}:${rowSpacingClass}`);
          }
        }
      }
    });
  }

  // Handle column spacing
  if (typeof columnSpacing === 'number') {
    const columnSpacingClass = COLUMN_SPACING_CLASSES[columnSpacing as keyof typeof COLUMN_SPACING_CLASSES];
    if (columnSpacingClass) classes.push(columnSpacingClass);
  } else if (columnSpacing && typeof columnSpacing === 'object') {
    Object.entries(columnSpacing).forEach(([breakpoint, value]) => {
      if (BREAKPOINTS.includes(breakpoint as Breakpoint) && typeof value === 'number') {
        const columnSpacingClass = COLUMN_SPACING_CLASSES[value as keyof typeof COLUMN_SPACING_CLASSES];
        if (columnSpacingClass) {
          if (breakpoint === 'xs') {
            classes.push(columnSpacingClass);
          } else {
            classes.push(`${breakpoint}:${columnSpacingClass}`);
          }
        }
      }
    });
  }

  return classes.join(' ');
};

/* -------------------------------- Component -------------------------------- */

const Grid = React.forwardRef<HTMLDivElement, GridProps & VariantProps<typeof gridVariants>>(
  ({ 
    className, 
    container = false,
    item = false,
    size,
    spacing = 0,
    rowSpacing,
    columnSpacing,
    justifyContent,
    alignItems,
    asChild = false,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'div';
    
    const sizeClasses = generateSizeClasses(size);
    const spacingClasses = generateSpacingClasses(spacing, rowSpacing, columnSpacing);
    
    return (
      <Comp
        ref={ref}
        data-slot="grid"
        className={cn(
          gridVariants({ 
            container,
            item,
            justifyContent,
            alignItems,
          }),
          sizeClasses,
          spacingClasses,
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Grid.displayName = 'Grid';

/* --------------------------------- Exports --------------------------------- */

export { Grid };
