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

import type { ReactNode } from "react";
import { DesignSystemProvider } from "@repo/design-system";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DesignSystemProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </DesignSystemProvider>
  );
}
