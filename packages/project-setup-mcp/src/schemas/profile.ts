/**
 * SPDX-License-Identifier: MIT
 */

import { z } from 'zod';

/**
 * Target user types
 */
export const TargetUserType = {
  INTERNAL_TOOL: 'internal_tool',
  PUBLIC_SAAS: 'public_saas',
  B2B_PORTAL: 'b2b_portal',
  OTHER: 'other',
} as const;

export type TargetUserTypeValue =
  (typeof TargetUserType)[keyof typeof TargetUserType];

/**
 * Tenancy model types
 */
export const TenancyModel = {
  SINGLE_TENANT: 'single_tenant',
  MULTI_TENANT: 'multi_tenant',
} as const;

export type TenancyModelValue =
  (typeof TenancyModel)[keyof typeof TenancyModel];

/**
 * Schema for project metadata
 */
export const projectMetadataSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  targetUsers: z.enum([
    TargetUserType.INTERNAL_TOOL,
    TargetUserType.PUBLIC_SAAS,
    TargetUserType.B2B_PORTAL,
    TargetUserType.OTHER,
  ]),
});

/**
 * Schema for selected apps
 */
export const selectedAppsSchema = z.object({
  app: z.boolean().default(true),
  api: z.boolean().default(true),
  web: z.boolean().default(false),
  docs: z.boolean().default(false),
});

/**
 * Schema for architecture choices
 */
export const architectureSchema = z.object({
  tenancyModel: z.enum([TenancyModel.SINGLE_TENANT, TenancyModel.MULTI_TENANT]),
  primaryEntity: z.string().min(1).max(50).default('organization'),
  entityRelationships: z.array(z.string()).default([]),
});

/**
 * Schema for cross-cutting concerns configuration
 */
export const crossCuttingConcernsSchema = z.object({
  auth: z.object({
    enabled: z.boolean().default(true),
    provider: z.literal('clerk').default('clerk'),
    requiresRoles: z.boolean().default(false),
  }),
  database: z.object({
    enabled: z.boolean().default(true),
    provider: z.literal('neon').default('neon'),
  }),
  observability: z.object({
    enabled: z.boolean().default(true),
    errorTracking: z.boolean().default(true),
    logging: z.boolean().default(true),
  }),
  analytics: z.object({
    enabled: z.boolean().default(false),
    posthog: z.boolean().default(false),
    googleAnalytics: z.boolean().default(false),
    vercelAnalytics: z.boolean().default(false),
  }),
  storage: z.object({
    enabled: z.boolean().default(false),
    provider: z.literal('vercel_blob').default('vercel_blob'),
  }),
  rateLimit: z.object({
    enabled: z.boolean().default(false),
    provider: z.literal('upstash').default('upstash'),
  }),
});

/**
 * Full project profile schema
 */
export const projectProfileSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('project_profile'),
  sessionId: z.string().uuid(),
  metadata: projectMetadataSchema,
  selectedApps: selectedAppsSchema,
  architecture: architectureSchema,
  crossCuttingConcerns: crossCuttingConcernsSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ProjectMetadata = z.infer<typeof projectMetadataSchema>;
export type SelectedApps = z.infer<typeof selectedAppsSchema>;
export type Architecture = z.infer<typeof architectureSchema>;
export type CrossCuttingConcerns = z.infer<typeof crossCuttingConcernsSchema>;
export type ProjectProfile = z.infer<typeof projectProfileSchema>;

/**
 * Creates a default project profile
 */
export function createDefaultProfile(
  id: string,
  sessionId: string
): Omit<ProjectProfile, 'metadata'> & { metadata: Partial<ProjectMetadata> } {
  const now = new Date().toISOString();
  return {
    id,
    type: 'project_profile',
    sessionId,
    metadata: {},
    selectedApps: {
      app: true,
      api: true,
      web: false,
      docs: false,
    },
    architecture: {
      tenancyModel: TenancyModel.MULTI_TENANT,
      primaryEntity: 'organization',
      entityRelationships: [],
    },
    crossCuttingConcerns: {
      auth: { enabled: true, provider: 'clerk', requiresRoles: false },
      database: { enabled: true, provider: 'neon' },
      observability: { enabled: true, errorTracking: true, logging: true },
      analytics: {
        enabled: false,
        posthog: false,
        googleAnalytics: false,
        vercelAnalytics: false,
      },
      storage: { enabled: false, provider: 'vercel_blob' },
      rateLimit: { enabled: false, provider: 'upstash' },
    },
    createdAt: now,
    updatedAt: now,
  };
}
