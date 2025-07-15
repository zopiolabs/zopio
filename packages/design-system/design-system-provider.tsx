/**
 * SPDX-License-Identifier: MIT
 */

/**
 * DesignSystemProvider
 *
 * A comprehensive provider that wraps all necessary context providers
 * for the design system, including theme, auth, analytics, and UI components.
 */

import { AnalyticsProvider } from '@repo/analytics';
import { AuthProvider } from '@repo/auth/provider';
import type { ThemeProviderProps } from 'next-themes';
import type { ReactNode } from 'react';
import { ThemeProvider } from './providers/theme';
import { Toaster } from './ui/sonner';
import { TooltipProvider } from './ui/tooltip';

interface DesignSystemProviderProps {
  children?: ReactNode;
  /** Theme attribute - must match ThemeProvider's Attribute type */
  attribute?: ThemeProviderProps['attribute'];
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  forcedTheme?: string;
  themes?: string[];
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
  [key: string]: unknown;
}

export function DesignSystemProvider({
  children,
  privacyUrl,
  termsUrl,
  helpUrl,
  attribute,
  defaultTheme,
  enableSystem,
  disableTransitionOnChange,
  storageKey,
  forcedTheme,
  themes,
}: DesignSystemProviderProps) {
  // Extract only the properties that ThemeProvider expects
  const themeProps: ThemeProviderProps = {
    attribute,
    defaultTheme,
    enableSystem,
    disableTransitionOnChange,
    storageKey,
    forcedTheme,
    themes,
  };

  return (
    <ThemeProvider {...themeProps}>
      <AuthProvider
        privacyUrl={privacyUrl}
        termsUrl={termsUrl}
        helpUrl={helpUrl}
      >
        <AnalyticsProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AnalyticsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
