/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@repo/design-system/components/ui/button';
import { MainNav } from '@/components/main-nav';
import { FeaturedPlugins } from '@/components/featured-plugins';
import { PluginCategories } from '@/components/plugin-categories';
import { SearchBar } from '@/components/search-bar';

export const metadata: Metadata = {
  title: 'Zopio Marketplace',
  description: 'Discover and install plugins for your Zopio environment',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-40 border-b"
        style={{ backgroundColor: 'hsl(var(--background))' }}
      >
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <SearchBar />
            <Button variant="outline" asChild>
              <Link href="/submit-plugin">Submit Plugin</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-10">
          <div className="mx-auto max-w-[980px] flex flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              Zopio Marketplace
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Discover and install plugins to enhance your Zopio experience
            </p>
          </div>
        </section>

        <section className="container py-8">
          <h2 className="mb-6 font-bold text-2xl tracking-tight">
            Featured Plugins
          </h2>
          <FeaturedPlugins />
        </section>

        <section className="container py-8">
          <h2 className="mb-6 font-bold text-2xl tracking-tight">
            Browse Categories
          </h2>
          <PluginCategories />
        </section>
      </main>
      <footer className="border-t">
        <div className="container py-10 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
          <div className="text-center text-muted-foreground text-sm md:text-left">
            &copy; {new Date().getFullYear()} Zopio. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
