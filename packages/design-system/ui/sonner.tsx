/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';
// Import without types to avoid naming issues
import { Toaster as Sonner } from 'sonner';

// Define our own props interface to avoid external type dependencies
interface ToasterProps {
  theme?: 'light' | 'dark' | 'system';
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
  hotkey?: string;
  richColors?: boolean;
  expand?: boolean;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  closeButton?: boolean;
  offset?: string | number;
  dir?: 'ltr' | 'rtl';
  [key: string]: any;
}

// Using createElement to avoid React 19 JSX type errors with ForwardRefExoticComponent
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  // Using createElement to avoid React 19 JSX type errors
  return React.createElement(Sonner as any, {
    theme: theme,
    className: 'toaster group',
    style: {
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
    } as React.CSSProperties,
    ...props,
  });
};

export { Toaster };
