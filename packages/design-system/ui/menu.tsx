/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@repo/design-system/lib/utils';

/* ---------------------------------- Types ---------------------------------- */

export interface MenuProps extends React.HTMLAttributes<HTMLUListElement> {
  variant?: 'default' | 'vertical' | 'horizontal' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  rounded?: boolean;
  asChild?: boolean;
}

export interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  asChild?: boolean;
}

export interface MenuTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export interface MenuSectionProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'title'> {
  title?: React.ReactNode;
  asChild?: boolean;
}

export interface MenuDividerProps extends React.HTMLAttributes<HTMLLIElement> {
  asChild?: boolean;
}

/* -------------------------------- Variants -------------------------------- */

const menuVariants = cva(
  'list-none p-0 flex gap-1 text-sm',
  {
    variants: {
      variant: {
        default: 'flex-col',
        vertical: 'flex-col',
        horizontal: 'flex-row items-center',
        compact: 'flex-col gap-0.5',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      bordered: {
        true: 'border border-border',
        false: '',
      },
      rounded: {
        true: 'rounded-md',
        false: '',
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        variant: ['default', 'vertical', 'compact'],
        class: 'w-48',
      },
      {
        size: 'md',
        variant: ['default', 'vertical', 'compact'],
        class: 'w-56',
      },
      {
        size: 'lg',
        variant: ['default', 'vertical', 'compact'],
        class: 'w-64',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      bordered: false,
      rounded: true,
    },
  }
);

const menuItemVariants = cva(
  'relative flex items-center gap-2 px-3 py-2 cursor-pointer select-none outline-none transition-colors',
  {
    variants: {
      variant: {
        default: 'rounded-sm hover:bg-accent hover:text-accent-foreground',
        vertical: 'rounded-sm hover:bg-accent hover:text-accent-foreground',
        horizontal: 'rounded-sm hover:bg-accent hover:text-accent-foreground',
        compact: 'px-2 py-1.5 hover:bg-accent hover:text-accent-foreground',
      },
      active: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      active: false,
      disabled: false,
    },
  }
);

/* -------------------------------- Components -------------------------------- */

const Menu = React.forwardRef<HTMLUListElement, MenuProps>(
  ({ className, variant, size, bordered, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'ul';
    return (
      <Comp
        ref={ref}
        data-slot="menu"
        className={cn(
          menuVariants({ variant, size, bordered, rounded }),
          className
        )}
        {...props}
      />
    );
  }
);
Menu.displayName = 'Menu';

const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps & VariantProps<typeof menuItemVariants>>(
  ({ className, variant, active, disabled, icon, suffix, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'li';
    return (
      <Comp
        ref={ref}
        data-slot="menu-item"
        data-active={active}
        data-disabled={disabled}
        className={cn(
          menuItemVariants({ variant, active, disabled }),
          className
        )}
        {...props}
      >
        {icon && (
          <span className="flex items-center justify-center shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-grow">{children}</span>
        {suffix && (
          <span className="flex items-center justify-center ml-auto shrink-0">
            {suffix}
          </span>
        )}
      </Comp>
    );
  }
);
MenuItem.displayName = 'MenuItem';

const MenuTitle = React.forwardRef<HTMLHeadingElement, MenuTitleProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'h3';
    return (
      <Comp
        ref={ref}
        data-slot="menu-title"
        className={cn(
          'px-3 py-1.5 text-sm font-medium text-foreground/70',
          className
        )}
        {...props}
      />
    );
  }
);
MenuTitle.displayName = 'MenuTitle';

const MenuSection = React.forwardRef<HTMLLIElement, MenuSectionProps>(
  ({ className, title, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'li';
    return (
      <Comp
        ref={ref}
        data-slot="menu-section"
        className={cn('flex flex-col', className)}
        {...props}
      >
        {title && (
          <MenuTitle>{title}</MenuTitle>
        )}
        <ul className="list-none p-0 m-0">
          {children}
        </ul>
      </Comp>
    );
  }
);
MenuSection.displayName = 'MenuSection';

const MenuDivider = React.forwardRef<HTMLLIElement, MenuDividerProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'li';
    return (
      <Comp
        ref={ref}
        data-slot="menu-divider"
        className={cn('h-px my-1 -mx-1 bg-border', className)}
        {...props}
      />
    );
  }
);
MenuDivider.displayName = 'MenuDivider';

/* --------------------------------- Exports --------------------------------- */

export {
  Menu,
  MenuItem,
  MenuTitle,
  MenuSection,
  MenuDivider,
};
