/**
 * SPDX-License-Identifier: MIT
 */

import { z } from 'zod';
import { ChangeType } from './plan.js';

/**
 * Result status for applied changes
 */
export const ApplyResult = {
  SUCCESS: 'success',
  SKIPPED: 'skipped',
  FAILED: 'failed',
} as const;

export type ApplyResultValue = (typeof ApplyResult)[keyof typeof ApplyResult];

/**
 * Schema for a single applied change
 */
export const appliedChangeSchema = z.object({
  changeId: z.string(),
  targetPath: z.string(),
  changeType: z.enum([ChangeType.CREATE, ChangeType.UPDATE, ChangeType.DELETE]),
  result: z.enum([
    ApplyResult.SUCCESS,
    ApplyResult.SKIPPED,
    ApplyResult.FAILED,
  ]),
  message: z.string().optional(),
  previousContentHash: z.string().optional(),
  newContentHash: z.string().optional(),
  appliedAt: z.string().datetime(),
});

export type AppliedChange = z.infer<typeof appliedChangeSchema>;

/**
 * Schema for applied changeset resource
 */
export const appliedChangesetSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('applied_changeset'),
  sessionId: z.string().uuid(),
  planId: z.string().uuid(),
  changes: z.array(appliedChangeSchema),
  summary: z.object({
    totalChanges: z.number().int().min(0),
    successful: z.number().int().min(0),
    skipped: z.number().int().min(0),
    failed: z.number().int().min(0),
  }),
  notes: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  appliedAt: z.string().datetime(),
  durationMs: z.number().int().min(0),
});

export type AppliedChangeset = z.infer<typeof appliedChangesetSchema>;

/**
 * Creates a new applied changeset
 */
export function createAppliedChangeset(
  id: string,
  sessionId: string,
  planId: string,
  changes: AppliedChange[],
  durationMs: number,
  notes: string[] = [],
  warnings: string[] = []
): AppliedChangeset {
  let successful = 0;
  let skipped = 0;
  let failed = 0;

  for (const change of changes) {
    switch (change.result) {
      case ApplyResult.SUCCESS:
        successful++;
        break;
      case ApplyResult.SKIPPED:
        skipped++;
        break;
      case ApplyResult.FAILED:
        failed++;
        break;
      default:
        // Exhaustive check - all cases handled
        break;
    }
  }

  return {
    id,
    type: 'applied_changeset',
    sessionId,
    planId,
    changes,
    summary: {
      totalChanges: changes.length,
      successful,
      skipped,
      failed,
    },
    notes,
    warnings,
    appliedAt: new Date().toISOString(),
    durationMs,
  };
}
