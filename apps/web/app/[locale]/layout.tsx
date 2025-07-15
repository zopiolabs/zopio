/**
 * SPDX-License-Identifier: MIT
 */

import './styles.css';
// Import the custom Toolbar component we created to replace basehub's
import { Toolbar as CMSToolbar } from '@repo/cms/components/toolbar';
import { DesignSystemProvider } from '@repo/design-system/design-system-provider';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import { getDictionary } from '@repo/internationalization';
import type { ReactNode } from 'react';
import { Footer } from './components/footer';
import { Header } from './components/header';

type RootLayoutProperties = {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
};

const RootLayout = async ({ children, params }: RootLayoutProperties) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <html
      lang="en"
      className={cn(fonts, 'scroll-smooth')}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <DesignSystemProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header dictionary={dictionary} />
          {children}
          <Footer />
        </DesignSystemProvider>
        <Toolbar />
        <CMSToolbar />
      </body>
    </html>
  );
};

export default RootLayout;
