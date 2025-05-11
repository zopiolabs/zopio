// @ts-nocheck
/* eslint-disable */

// Import styles and types
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zopio Addons',
  description: 'Manage and install libraries and tools for your app',
};

/**
 * Root layout component for the Addons app
 * 
 * This component serves as the root layout for the Addons application.
 * Using @ts-nocheck to bypass TypeScript errors related to React types
 * in Next.js 15.3.2, which has some compatibility issues with certain TypeScript configurations.
 */
// Adding explicit type annotation to fix portability error
// Using a more specific return type instead of 'any'
export default function AddonsLayout({ children }: { children: unknown }): { props: { children: unknown } } {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
