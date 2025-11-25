/**
 * SPDX-License-Identifier: MIT
 */

import { resourceSchema } from '@repo/mcp';
import { z } from 'zod';

export const setupSessionStatusSchema = z.enum([
  'pending',
  'interview_in_progress',
  'interview_completed',
  'plan_generated',
  'applied',
  'failed',
]);

export const projectAppsSchema = z.array(z.enum(['app', 'api', 'web']));

export const envVarSpecSchema = z.object({
  name: z.string(),
  value: z.string().optional(),
  comment: z.string().optional(),
});

export const plannedFileChangeSchema = z.object({
  path: z.string(),
  type: z.enum(['create', 'update']),
  description: z.string(),
  operation: z.enum(['overwrite', 'merge_env', 'create_if_missing']),
  content: z.string().optional(),
  envVars: z.array(envVarSpecSchema).optional(),
});

export const appliedFileChangeSchema = z.object({
  path: z.string(),
  changeType: z.enum(['created', 'updated', 'unchanged', 'skipped']),
  notes: z.string().optional(),
});

export const setupSessionSchema = resourceSchema.extend({
  type: z.literal('project-setup-session'),
  attributes: z
    .object({
      status: setupSessionStatusSchema,
      createdAt: z.string(),
      updatedAt: z.string(),
      currentQuestionId: z.string().nullable(),
      answers: z.record(z.union([z.string(), z.array(z.string())])),
      profileId: z.string().nullable(),
      planId: z.string().nullable(),
    })
    .optional(),
});

export const projectProfileSchema = resourceSchema.extend({
  type: z.literal('project-profile'),
  attributes: z
    .object({
      projectName: z.string(),
      description: z.string(),
      targetUsers: z.string(),
      apps: projectAppsSchema,
      architecture: z.enum(['single_tenant', 'multi_tenant']),
      primaryEntity: z.string(),
      entityRelationships: z.string().optional(),
      authMode: z.enum(['none', 'basic', 'roles']),
      databaseCentrality: z.enum(['core', 'supporting']),
      observabilityLevel: z.enum(['minimal', 'standard', 'extended']),
      analyticsLevel: z.enum(['none', 'basic', 'product']),
      storageLevel: z.enum(['none', 'basic']),
      rateLimitingLevel: z.enum(['none', 'basic']),
    })
    .optional(),
});

export const setupPlanSchema = resourceSchema.extend({
  type: z.literal('project-setup-plan'),
  attributes: z
    .object({
      sessionId: z.string(),
      profileId: z.string(),
      summary: z.string(),
      apps: projectAppsSchema,
      prisma: z.object({
        schemaPath: z.string(),
        template: z.enum(['single_tenant', 'multi_tenant']),
        primaryEntity: z.string(),
      }),
      fileChanges: z.array(plannedFileChangeSchema),
    })
    .optional(),
});

export const changesetSchema = resourceSchema.extend({
  type: z.literal('project-setup-changeset'),
  attributes: z
    .object({
      sessionId: z.string(),
      planId: z.string(),
      summary: z.string(),
      createdAt: z.string(),
      fileChanges: z.array(appliedFileChangeSchema),
      warnings: z.array(z.string()).optional(),
    })
    .optional(),
});

export type SetupSessionResource = z.infer<typeof setupSessionSchema>;
export type ProjectProfileResource = z.infer<typeof projectProfileSchema>;
export type SetupPlanResource = z.infer<typeof setupPlanSchema>;
export type ChangesetResource = z.infer<typeof changesetSchema>;

export type SetupSessionAttributes = NonNullable<
  SetupSessionResource['attributes']
>;
export type ProjectProfileAttributes = NonNullable<
  ProjectProfileResource['attributes']
>;
export type SetupPlanAttributes = NonNullable<SetupPlanResource['attributes']>;
export type ChangesetAttributes = NonNullable<ChangesetResource['attributes']>;

export type EnvVarSpec = z.infer<typeof envVarSpecSchema>;
export type PlannedFileChange = z.infer<typeof plannedFileChangeSchema>;
export type AppliedFileChange = z.infer<typeof appliedFileChangeSchema>;
