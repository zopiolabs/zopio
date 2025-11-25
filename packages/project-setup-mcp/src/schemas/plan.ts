/**
 * SPDX-License-Identifier: MIT
 */

import { z } from 'zod';

/**
 * Change types for plan items
 */
export const ChangeType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

export type ChangeTypeValue = (typeof ChangeType)[keyof typeof ChangeType];

/**
 * Categories of planned changes
 */
export const ChangeCategory = {
  SCHEMA: 'schema',
  ENV_CONFIG: 'env_config',
  APP_CONFIG: 'app_config',
  WIRING: 'wiring',
  DOCUMENTATION: 'documentation',
} as const;

export type ChangeCategoryValue =
  (typeof ChangeCategory)[keyof typeof ChangeCategory];

/**
 * Schema for a single planned change
 */
export const plannedChangeSchema = z.object({
  id: z.string(),
  category: z.enum([
    ChangeCategory.SCHEMA,
    ChangeCategory.ENV_CONFIG,
    ChangeCategory.APP_CONFIG,
    ChangeCategory.WIRING,
    ChangeCategory.DOCUMENTATION,
  ]),
  changeType: z.enum([ChangeType.CREATE, ChangeType.UPDATE, ChangeType.DELETE]),
  targetPath: z.string(),
  description: z.string(),
  content: z.string().optional(),
  contentHash: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type PlannedChange = z.infer<typeof plannedChangeSchema>;

/**
 * Schema for setup plan resource
 */
export const setupPlanSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('setup_plan'),
  sessionId: z.string().uuid(),
  profileId: z.string().uuid(),
  changes: z.array(plannedChangeSchema),
  summary: z.object({
    totalChanges: z.number().int().min(0),
    byCategory: z.record(z.string(), z.number().int()),
    byChangeType: z.record(z.string(), z.number().int()),
  }),
  createdAt: z.string().datetime(),
  isApplied: z.boolean().default(false),
});

export type SetupPlan = z.infer<typeof setupPlanSchema>;

/**
 * Creates a new setup plan
 */
export function createSetupPlan(
  id: string,
  sessionId: string,
  profileId: string,
  changes: PlannedChange[]
): SetupPlan {
  const byCategory: Record<string, number> = {};
  const byChangeType: Record<string, number> = {};

  for (const change of changes) {
    byCategory[change.category] = (byCategory[change.category] || 0) + 1;
    byChangeType[change.changeType] =
      (byChangeType[change.changeType] || 0) + 1;
  }

  return {
    id,
    type: 'setup_plan',
    sessionId,
    profileId,
    changes,
    summary: {
      totalChanges: changes.length,
      byCategory,
      byChangeType,
    },
    createdAt: new Date().toISOString(),
    isApplied: false,
  };
}
