import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Zopio Addons',
  description: 'Manage and install libraries and tools for your app',
};

export default function AddonsLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
