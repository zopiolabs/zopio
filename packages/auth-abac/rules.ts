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
import type { PermissionRule } from '@repo/auth-rbac';

// Define proper types for context and records
interface UserContext {
  region?: string;
  clearanceLevel?: number;
  [key: string]: unknown;
}

type Record = { [key: string]: unknown };

export const abacRules: PermissionRule[] = [
  {
    resource: 'invoices',
    action: 'read',
    condition: (ctx: UserContext, record?: Record | null) => {
      if (!record || !ctx.region || !record.region) {
        return false;
      }
      return ctx.region === record.region;
    },
  },
  {
    resource: 'payments',
    action: 'approve',
    condition: (ctx: UserContext, _record?: Record | null) => {
      return (ctx.clearanceLevel ?? 0) >= 3;
    },
  },
];
