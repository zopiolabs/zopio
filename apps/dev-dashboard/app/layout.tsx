import type { Metadata } from 'next';
import './globals.css';

// Import React to fix type issues
import React from 'react';

export const metadata: Metadata = {
  title: 'Zopio Dev Dashboard',
  description: 'Developer tools for Zopio local development',
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>
        <div className="bg-gray-100 min-h-screen text-gray-900">
          <header className="bg-white border-b font-semibold p-4">Zopio Dev Dashboard</header>
          <main className="mx-auto max-w-4xl p-6 space-y-6">{children}</main>
        </div>
      </body>
    </html>
  );
}