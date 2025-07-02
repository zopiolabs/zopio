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
