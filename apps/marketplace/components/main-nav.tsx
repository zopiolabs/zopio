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
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/design-system/lib/utils";
import { ModeToggle } from "./mode-toggle";

export function MainNav() {
  const pathname = usePathname();
  
  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/plugins",
      label: "All Plugins",
      active: pathname === "/plugins",
    },
    {
      href: "/categories",
      label: "Categories",
      active: pathname === "/categories",
    },
    {
      href: "/trending",
      label: "Trending",
      active: pathname === "/trending",
    },
  ];

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold inline-block">Zopio Marketplace</span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
              route.active ? "text-foreground" : "text-foreground/60"
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </div>
  );
}
