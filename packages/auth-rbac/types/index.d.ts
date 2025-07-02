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
export type UserContext = {
  userId: string;
  role: string;
  tenantId: string;
};
import type { DSLNode } from '../engine/evaluateDsl';
export type PermissionRule = {
  resource: string;
  action: string;
  condition?: (
    context: UserContext,
    record?: Record<string, unknown> | null
  ) => boolean;
  dsl?: DSLNode;
  fieldPermissions?: Record<string, 'read' | 'write' | 'none'>;
};
export type AccessEvaluationInput = {
  rules: PermissionRule[];
  context: UserContext;
  action: string;
  resource: string;
  record?: Record<string, unknown> | null;
  field?: string;
};
export type AccessEvaluationResult = {
  can: boolean;
  reason?: string;
};
//# sourceMappingURL=index.d.ts.map
