/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@repo/design-system/lib/utils';

/* ---------------------------------- Types ---------------------------------- */

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The variant of the navbar
   */
  variant?: 'default' | 'bordered' | 'transparent';
  /**
   * The size of the navbar
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether the navbar should hide on scroll
   */
  hideOnScroll?: boolean;
  /**
   * Whether the navbar should be fixed at the top
   */
  fixed?: boolean;
  /**
   * Whether the navbar should have a blur effect
   */
  blurred?: boolean;
  /**
   * Whether the component should be rendered as a child
   */
  asChild?: boolean;
}

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the component should be rendered as a child
   */
  asChild?: boolean;
}

export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The justification of the content
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /**
   * Whether the component should be rendered as a child
   */
  asChild?: boolean;
}

export interface NavbarItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /**
   * Whether the item is active
   */
  active?: boolean;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Whether the component should be rendered as a child
   */
  asChild?: boolean;
}

export interface NavbarMenuToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether the menu is open
   */
  isOpen?: boolean;
  /**
   * Whether the component should be rendered as a child
   */
  asChild?: boolean;
}

export interface NavbarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the menu is open
   */
  isOpen?: boolean;
  /**
   * Whether the component should be rendered as a child
   */
  asChild?: boolean;
}

export interface NavbarMenuItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /**
   * Whether the item is active
   */
  active?: boolean;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Whether the component should be rendered as a child
   */
  asChild?: boolean;
}

/* -------------------------------- Variants -------------------------------- */

const navbarVariants = cva(
  'w-full flex flex-wrap items-center justify-between relative',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        bordered: 'bg-background text-foreground border-b border-border',
        transparent: 'bg-transparent text-foreground',
      },
      size: {
        sm: 'px-3 py-2',
        md: 'px-4 py-3',
        lg: 'px-6 py-4',
      },
      fixed: {
        true: 'fixed top-0 left-0 right-0 z-50',
        false: 'relative',
      },
      blurred: {
        true: 'backdrop-blur-md bg-background/80',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fixed: false,
      blurred: false,
    },
  }
);

const navbarContentVariants = cva(
  'flex flex-wrap items-center',
  {
    variants: {
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
    },
    defaultVariants: {
      justify: 'between',
    },
  }
);

const navbarItemVariants = cva(
  'relative flex items-center px-3 py-2 text-sm font-medium transition-colors',
  {
    variants: {
      active: {
        true: 'text-primary',
        false: 'text-foreground/70 hover:text-foreground',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  }
);

const navbarMenuItemVariants = cva(
  'flex w-full items-center px-4 py-2 text-sm transition-colors',
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
        false: 'hover:bg-accent/50 hover:text-accent-foreground',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
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

const Navbar = React.forwardRef<HTMLElement, NavbarProps & VariantProps<typeof navbarVariants>>(
  ({ className, variant, size, fixed, blurred, hideOnScroll, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'nav';
    const [hidden, setHidden] = React.useState(false);
    const lastScrollY = React.useRef(0);

    React.useEffect(() => {
      if (!hideOnScroll) return;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current) {
          setHidden(true);
        } else {
          setHidden(false);
        }
        lastScrollY.current = currentScrollY;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, [hideOnScroll]);

    return (
      <Comp
        ref={ref}
        data-slot="navbar"
        data-hidden={hideOnScroll ? hidden : undefined}
        className={cn(
          navbarVariants({ variant, size, fixed, blurred }),
          hideOnScroll && 'transition-transform duration-300',
          hideOnScroll && hidden && 'transform -translate-y-full',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Navbar.displayName = 'Navbar';

const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        data-slot="navbar-brand"
        className={cn('flex items-center', className)}
        {...props}
      />
    );
  }
);
NavbarBrand.displayName = 'NavbarBrand';

const NavbarContent = React.forwardRef<HTMLDivElement, NavbarContentProps & VariantProps<typeof navbarContentVariants>>(
  ({ className, justify, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        data-slot="navbar-content"
        data-justify={justify}
        className={cn(
          navbarContentVariants({ justify }),
          className
        )}
        {...props}
      />
    );
  }
);
NavbarContent.displayName = 'NavbarContent';

const NavbarItems = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        data-slot="navbar-items"
        className={cn(
          'flex items-center gap-1 list-none p-0 m-0',
          className
        )}
        {...props}
      />
    );
  }
);
NavbarItems.displayName = 'NavbarItems';

const NavbarItem = React.forwardRef<HTMLLIElement, NavbarItemProps & VariantProps<typeof navbarItemVariants>>(
  ({ className, active, disabled, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'li';
    return (
      <Comp
        ref={ref}
        data-slot="navbar-item"
        data-active={active}
        data-disabled={disabled}
        className={cn(
          navbarItemVariants({ active, disabled }),
          className
        )}
        {...props}
      />
    );
  }
);
NavbarItem.displayName = 'NavbarItem';

const NavbarMenuToggle = React.forwardRef<HTMLButtonElement, NavbarMenuToggleProps>(
  ({ className, isOpen, onClick, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        data-slot="navbar-menu-toggle"
        data-open={isOpen}
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className={cn(
          'inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary',
          className
        )}
        onClick={onClick}
        {...props}
      >
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
          aria-hidden="true"
          className={cn(
            'h-6 w-6 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        >
          {isOpen ? (
            <path d="M18 6 6 18M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </Comp>
    );
  }
);
NavbarMenuToggle.displayName = 'NavbarMenuToggle';

const NavbarMenu = React.forwardRef<HTMLDivElement, NavbarMenuProps>(
  ({ className, isOpen, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        data-slot="navbar-menu"
        data-open={isOpen}
        className={cn(
          'w-full md:hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden',
          className
        )}
        {...props}
      />
    );
  }
);
NavbarMenu.displayName = 'NavbarMenu';

const NavbarMenuItem = React.forwardRef<HTMLAnchorElement, NavbarMenuItemProps & VariantProps<typeof navbarMenuItemVariants>>(
  ({ className, active, disabled, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        data-slot="navbar-menu-item"
        data-active={active}
        data-disabled={disabled}
        className={cn(
          navbarMenuItemVariants({ active, disabled }),
          className
        )}
        {...props}
      />
    );
  }
);
NavbarMenuItem.displayName = 'NavbarMenuItem';

/* --------------------------------- Exports --------------------------------- */

export {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItems,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
};
