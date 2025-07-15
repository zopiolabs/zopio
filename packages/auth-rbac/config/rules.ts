/**
 * SPDX-License-Identifier: MIT
 */

import type { PermissionRule } from '../types';

interface UserContext {
  tenantId?: string;
  userId?: string;
  role?: string;
  [key: string]: unknown;
}

type Record = { [key: string]: unknown };

export const rules: PermissionRule[] = [
  {
    resource: 'orders',
    action: 'read',
    condition: (ctx: UserContext, record?: Record | null) => {
      if (!record || !ctx.tenantId) {
        return false;
      }
      return record.tenantId === ctx.tenantId;
    },
    fieldPermissions: {
      id: 'read',
      total: 'read',
      cost: 'none',
    },
  },
  {
    resource: 'orders',
    action: 'update',
    condition: (ctx: UserContext, record?: Record | null) => {
      if (!record || !ctx.userId) {
        return false;
      }
      return record.createdBy === ctx.userId;
    },
    fieldPermissions: {
      status: 'write',
      total: 'none',
    },
  },
  {
    resource: 'users',
    action: 'invite',
    condition: (ctx: UserContext) => {
      return ctx.role === 'admin';
    },
  },
];
