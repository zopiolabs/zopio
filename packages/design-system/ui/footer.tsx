/**
 * SPDX-License-Identifier: MIT
 */

import type * as React from 'react';

import { cn } from '@repo/design-system/lib/utils';

export type FooterVariant = 'simple' | 'multi-column' | 'centered' | 'minimal';
export type FooterColorScheme = 'light' | 'dark' | 'neutral' | 'brand';

export interface FooterProps extends React.ComponentProps<'footer'> {
  /**
   * The layout variant of the footer.
   * @default 'simple'
   */
  variant?: FooterVariant;

  /**
   * The color scheme of the footer.
   * @default 'light'
   */
  colorScheme?: FooterColorScheme;

  /**
   * If true, the footer will be sticky at the bottom of the page.
   * @default false
   */
  sticky?: boolean;

  /**
   * If true, the footer will have a border at the top.
   * @default true
   */
  withBorder?: boolean;

  /**
   * If true, the footer will have padding.
   * @default true
   */
  withPadding?: boolean;

  /**
   * If true, the footer will have a container to constrain the width.
   * @default true
   */
  withContainer?: boolean;

  /**
   * The maximum width of the container.
   * @default '8xl'
   */
  containerWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | 'full';
}

export interface FooterSectionProps extends React.ComponentProps<'div'> {
  /**
   * The title of the section.
   */
  title?: string;
}

export interface FooterLinkProps extends React.ComponentProps<'a'> {
  /**
   * If true, the link will have hover effects.
   * @default true
   */
  withHoverEffect?: boolean;
}

export interface FooterCopyrightProps extends React.ComponentProps<'div'> {
  /**
   * The copyright text.
   */
  text?: string;
}

export interface FooterLogoProps extends React.ComponentProps<'div'> {
  /**
   * The logo component or image.
   */
  logo?: React.ReactNode;

  /**
   * The text to display next to the logo.
   */
  text?: string;
}

/**
 * Footer component for website layout.
 * Can be used with different variants and color schemes.
 */
function Footer({
  className,
  variant = 'simple',
  colorScheme = 'light',
  sticky = false,
  withBorder = true,
  withPadding = true,
  withContainer = true,
  containerWidth = '8xl',
  children,
  ...props
}: FooterProps) {
  const colorClasses = {
    light: 'bg-white text-gray-600',
    dark: 'bg-gray-900 text-gray-200',
    neutral: 'bg-gray-100 text-gray-700',
    brand: 'bg-primary-50 text-primary-900',
  };

  return (
    <footer
      data-slot="footer"
      data-variant={variant}
      data-color-scheme={colorScheme}
      className={cn(
        'w-full',
        colorClasses[colorScheme],
        withBorder && 'border-t border-gray-200',
        withPadding && 'py-8 md:py-12',
        sticky && 'sticky bottom-0 left-0 right-0',
        className
      )}
      {...props}
    >
      {withContainer ? (
        <div
          className={cn('mx-auto w-full px-4 sm:px-6 md:px-8', {
            'max-w-xs': containerWidth === 'xs',
            'max-w-sm': containerWidth === 'sm',
            'max-w-md': containerWidth === 'md',
            'max-w-lg': containerWidth === 'lg',
            'max-w-xl': containerWidth === 'xl',
            'max-w-2xl': containerWidth === '2xl',
            'max-w-3xl': containerWidth === '3xl',
            'max-w-4xl': containerWidth === '4xl',
            'max-w-5xl': containerWidth === '5xl',
            'max-w-6xl': containerWidth === '6xl',
            'max-w-7xl': containerWidth === '7xl',
            'max-w-[90rem]': containerWidth === '8xl', // 1440px
            'max-w-full': containerWidth === 'full',
          })}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </footer>
  );
}

/**
 * FooterSection component for grouping links in the footer.
 */
function FooterSection({ className, title, children, ...props }: FooterSectionProps) {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {title && (
        <h6 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
          {title}
        </h6>
      )}
      <div className="flex flex-col space-y-2">{children}</div>
    </div>
  );
}

/**
 * FooterLink component for links in the footer.
 */
function FooterLink({ className, withHoverEffect = true, children, ...props }: FooterLinkProps) {
  return (
    <a
      className={cn(
        'text-sm',
        withHoverEffect && 'transition-colors hover:text-primary-600 hover:underline',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * FooterCopyright component for displaying copyright information.
 */
function FooterCopyright({ className, text, children, ...props }: FooterCopyrightProps) {
  const year = new Date().getFullYear();
  const defaultText = `© ${year} All rights reserved.`;

  return (
    <div className={cn('text-sm text-gray-500', className)} {...props}>
      {text || children || defaultText}
    </div>
  );
}

/**
 * FooterLogo component for displaying a logo in the footer.
 */
function FooterLogo({ className, logo, text, children, ...props }: FooterLogoProps) {
  return (
    <div className={cn('flex items-center', className)} {...props}>
      {logo && <div className="mr-3">{logo}</div>}
      {text && <div className="text-lg font-semibold">{text}</div>}
      {children}
    </div>
  );
}

/**
 * FooterSocialLinks component for displaying social media links.
 */
function FooterSocialLinks({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex space-x-4', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * FooterDivider component for separating sections in the footer.
 */
function FooterDivider({ className, ...props }: React.ComponentProps<'hr'>) {
  return <hr className={cn('my-6 border-gray-200 dark:border-gray-700', className)} {...props} />;
}

/**
 * FooterGrid component for creating a grid layout in the footer.
 */
function FooterGrid({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Footer,
  FooterSection,
  FooterLink,
  FooterCopyright,
  FooterLogo,
  FooterSocialLinks,
  FooterDivider,
  FooterGrid,
};
