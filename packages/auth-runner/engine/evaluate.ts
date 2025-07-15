/**
 * SPDX-License-Identifier: MIT
 */

import { logAccessAttempt } from '@repo/auth-log';
import { evaluateAccess as baseEvaluate } from '@repo/auth-rbac/engine/evaluate';
import type { UserContext } from '@repo/auth-rbac/types';
import { combinedRules } from '../rules/combined-rules';

export function evaluateAccess(ctx: {
  context: UserContext;
  resource: string;
  action: string;
  record?: Record<string, unknown>;
  field?: string;
}) {
  const result = baseEvaluate({
    rules: combinedRules,
    ...ctx,
  });

  logAccessAttempt({
    ...ctx,
    timestamp: new Date().toISOString(),
    can: result.can,
    reason: result.reason,
  });

  return result;
}
