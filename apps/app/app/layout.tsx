/**
 * SPDX-License-Identifier: MIT
 */

import { env } from '@/env';
import './styles.css';
import { DesignSystemProvider } from '@repo/design-system/design-system-provider';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={cn(fonts)} suppressHydrationWarning>
    <body className="min-h-screen bg-background font-sans antialiased">
      <DesignSystemProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        privacyUrl={new URL(
          '/legal/privacy',
          env.NEXT_PUBLIC_WEB_URL
        ).toString()}
        termsUrl={new URL('/legal/terms', env.NEXT_PUBLIC_WEB_URL).toString()}
        helpUrl={env.NEXT_PUBLIC_DOCS_URL}
      >
        {children}
      </DesignSystemProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
