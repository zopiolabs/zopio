/**
 * SPDX-License-Identifier: MIT
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
