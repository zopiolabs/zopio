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
