/**
 * SPDX-License-Identifier: MIT
 */

import "./global.css";
import { Analytics } from "@vercel/analytics/react";
import {
  JetBrains_Mono as createMono,
  Inter as createSans,
} from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { twMerge } from "tailwind-merge";
import { Header } from "./components/header";

const sans = createSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "variable",
});

const mono = createMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "variable",
});

type LayoutProps = {
  readonly children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <html
    className={twMerge(
      "touch-manipulation scroll-smooth font-sans antialiased",
      sans.variable,
      mono.variable
    )}
    lang="en"
    suppressHydrationWarning
  >
    <body className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      <main className="container mx-auto border-x">
        <Header />
        <div className="divide-y">{children}</div>
      </main>
      <Analytics />
      <Toaster />
    </body>
  </html>
);

export default Layout;
