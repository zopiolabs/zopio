/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@repo/design-system/lib/utils';

/* ---------------------------------- Types ---------------------------------- */

export interface MegaMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to render the component as a child of another component
   */
  asChild?: boolean;
  /**
   * The variant of the mega menu
   */
  variant?: 'default' | 'bordered' | 'floating';
  /**
   * The size of the mega menu
   */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /**
   * Whether the mega menu is open
   */
  open?: boolean;
  /**
   * Callback when the open state changes
   */
  onOpenChange?: (open: boolean) => void;
}

export interface MegaMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether to render the component as a child of another component
   */
  asChild?: boolean;
  /**
   * Whether the trigger is active
   */
  active?: boolean;
}

export interface MegaMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to render the component as a child of another component
   */
  asChild?: boolean;
  /**
   * Whether to align the content to the left, center, or right
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Whether to add a backdrop when the mega menu is open
   */
  withBackdrop?: boolean;
  /**
   * Whether the mega menu content is open
   */
  open?: boolean;
  /**
   * Callback when the open state changes
   */
  onOpenChange?: (open: boolean) => void;
}

export interface MegaMenuColumnProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Whether to render the component as a child of another component
   */
  asChild?: boolean;
  /**
   * Title of the column
   */
  title?: React.ReactNode;
  /**
   * Width of the column
   */
  width?: 'auto' | 'full' | '1/2' | '1/3' | '1/4' | '2/3' | '3/4';
}

export interface MegaMenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /**
   * Whether to render the component as a child of another component
   */
  asChild?: boolean;
  /**
   * Whether the item is active
   */
  active?: boolean;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Icon to display before the item content
   */
  icon?: React.ReactNode;
  /**
   * Description to display below the item content
   */
  description?: React.ReactNode;
}

export interface MegaMenuSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Whether to render the component as a child of another component
   */
  asChild?: boolean;
  /**
   * Title of the section
   */
  title?: React.ReactNode;
}

export interface MegaMenuDividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /**
   * Whether to render the component as a child of another component
   */
  asChild?: boolean;
  /**
   * Whether the divider is vertical
   */
  vertical?: boolean;
}

export interface MegaMenuFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to render the component as a child of another component
   */
  asChild?: boolean;
}

/* -------------------------------- Variants -------------------------------- */

const megaMenuVariants = cva(
  'relative',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border border-border',
        floating: 'shadow-lg',
      },
      size: {
        sm: 'w-64',
        md: 'w-80',
        lg: 'w-96',
        full: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'full',
    },
  }
);

const megaMenuTriggerVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
        false: 'hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

const megaMenuContentVariants = cva(
  'z-50 bg-background p-4 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border border-border',
        floating: 'shadow-lg',
      },
      align: {
        left: 'origin-top-left',
        center: 'origin-top',
        right: 'origin-top-right',
      },
    },
    defaultVariants: {
      variant: 'default',
      align: 'left',
    },
  }
);

const megaMenuColumnVariants = cva(
  'flex flex-col gap-2',
  {
    variants: {
      width: {
        auto: '',
        full: 'w-full',
        '1/2': 'w-1/2',
        '1/3': 'w-1/3',
        '1/4': 'w-1/4',
        '2/3': 'w-2/3',
        '3/4': 'w-3/4',
      },
    },
    defaultVariants: {
      width: 'auto',
    },
  }
);

const megaMenuItemVariants = cva(
  'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors',
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
        false: 'hover:bg-accent hover:text-accent-foreground',
      },
      disabled: {
        true: 'pointer-events-none opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  }
);

/* -------------------------------- Components -------------------------------- */

const MegaMenu = React.forwardRef<HTMLDivElement, MegaMenuProps>(
  ({ className, variant, size, open, onOpenChange, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    const [isOpen, setIsOpen] = React.useState(open || false);

    React.useEffect(() => {
      if (open !== undefined) {
        setIsOpen(open);
      }
    }, [open]);

    const handleOpenChange = (value: boolean) => {
      setIsOpen(value);
      onOpenChange?.(value);
    };

    return (
      <Comp
        ref={ref}
        data-slot="mega-menu"
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(megaMenuVariants({ variant, size }), className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onOpenChange: handleOpenChange,
              open: isOpen,
            });
          }
          return child;
        })}
      </Comp>
    );
  }
);
MegaMenu.displayName = 'MegaMenu';

const MegaMenuTrigger = React.forwardRef<HTMLButtonElement, MegaMenuTriggerProps>(
  ({ className, active, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        data-slot="mega-menu-trigger"
        data-active={active}
        className={cn(megaMenuTriggerVariants({ active }), className)}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Comp>
    );
  }
);
MegaMenuTrigger.displayName = 'MegaMenuTrigger';

const MegaMenuContent = React.forwardRef<HTMLDivElement, MegaMenuContentProps>(
  ({ className, align = 'left', withBackdrop = false, asChild = false, open, onOpenChange, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    const [isOpen, setIsOpen] = React.useState(open || false);

    React.useEffect(() => {
      if (open !== undefined) {
        setIsOpen(open);
      }
    }, [open]);

    const handleClickOutside = React.useCallback((event: MouseEvent) => {
      const target = event.target as Node;
      // Check if ref is a RefObject (has current property) and not a callback function
      if (!ref || typeof ref === 'function') return;
      
      const content = ref.current;
      if (content && !content.contains(target)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    }, [onOpenChange, ref]);

    React.useEffect(() => {
      if (isOpen) {
        document.addEventListener('click', handleClickOutside);
      } else {
        document.removeEventListener('click', handleClickOutside);
      }
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [isOpen, handleClickOutside]);

    if (!isOpen) return null;

    return (
      <>
        {withBackdrop && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => {
              setIsOpen(false);
              onOpenChange?.(false);
            }}
          />
        )}
        <Comp
          ref={ref}
          data-slot="mega-menu-content"
          data-state={isOpen ? 'open' : 'closed'}
          data-align={align}
          className={cn(
            megaMenuContentVariants({ align }),
            'absolute left-0 top-full w-full',
            className
          )}
          {...props}
        >
          {children}
        </Comp>
      </>
    );
  }
);
MegaMenuContent.displayName = 'MegaMenuContent';

const MegaMenuColumn = React.forwardRef<HTMLDivElement, MegaMenuColumnProps>(
  ({ className, title, width, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        data-slot="mega-menu-column"
        className={cn(megaMenuColumnVariants({ width }), className)}
        {...props}
      >
        {title && (
          <h3 className="mb-2 text-sm font-medium text-foreground">{title}</h3>
        )}
        <ul className="space-y-1">
          {children}
        </ul>
      </Comp>
    );
  }
);
MegaMenuColumn.displayName = 'MegaMenuColumn';

const MegaMenuItem = React.forwardRef<HTMLLIElement, MegaMenuItemProps>(
  ({ className, active, disabled, icon, description, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'li';
    return (
      <Comp
        ref={ref}
        data-slot="mega-menu-item"
        data-active={active}
        data-disabled={disabled}
        className={cn(megaMenuItemVariants({ active, disabled }), className)}
        {...props}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="flex h-5 w-5 items-center justify-center text-muted-foreground">
                {icon}
              </span>
            )}
            <span>{children}</span>
          </div>
          {description && (
            <span className="mt-1 text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </Comp>
    );
  }
);
MegaMenuItem.displayName = 'MegaMenuItem';

const MegaMenuSection = React.forwardRef<HTMLDivElement, MegaMenuSectionProps>(
  ({ className, title, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        data-slot="mega-menu-section"
        className={cn('py-2', className)}
        {...props}
      >
        {title && (
          <h3 className="mb-2 px-3 text-sm font-medium text-foreground">{title}</h3>
        )}
        {children}
      </Comp>
    );
  }
);
MegaMenuSection.displayName = 'MegaMenuSection';

const MegaMenuDivider = React.forwardRef<HTMLHRElement, MegaMenuDividerProps>(
  ({ className, vertical = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'hr';
    return (
      <Comp
        ref={ref}
        data-slot="mega-menu-divider"
        data-orientation={vertical ? 'vertical' : 'horizontal'}
        className={cn(
          'shrink-0 bg-border',
          vertical ? 'h-full w-[1px]' : 'h-[1px] w-full',
          className
        )}
        {...props}
      />
    );
  }
);
MegaMenuDivider.displayName = 'MegaMenuDivider';

const MegaMenuFooter = React.forwardRef<HTMLDivElement, MegaMenuFooterProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        data-slot="mega-menu-footer"
        className={cn('mt-4 flex items-center justify-between border-t border-border pt-4', className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
MegaMenuFooter.displayName = 'MegaMenuFooter';

/* --------------------------------- Exports --------------------------------- */

export {
  MegaMenu,
  MegaMenuTrigger,
  MegaMenuContent,
  MegaMenuColumn,
  MegaMenuItem,
  MegaMenuSection,
  MegaMenuDivider,
  MegaMenuFooter,
};
