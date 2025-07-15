/**
 * SPDX-License-Identifier: MIT
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
