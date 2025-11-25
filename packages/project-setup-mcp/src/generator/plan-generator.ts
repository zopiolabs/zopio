/**
 * SPDX-License-Identifier: MIT
 */

import type { PlannedChange, SetupPlan } from '../schemas/plan.js';
import {
  ChangeCategory,
  ChangeType,
  createSetupPlan,
} from '../schemas/plan.js';
import type { ProjectProfile } from '../schemas/profile.js';
import {
  describePrismaSchema,
  generateAnalyticsProvider,
  generateDatabaseSeed,
  generateEnvTemplate,
  generateInstrumentation,
  generatePrismaSchema,
  generateRateLimitMiddleware,
  generateSetupSummaryDoc,
  generateStorageUtil,
} from '../templates/index.js';

/**
 * Generate a unique change ID
 */
function generateChangeId(category: string, target: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${category}-${target.replace(/[^a-z0-9]/gi, '-')}-${timestamp}-${random}`;
}

/**
 * Create a content hash for change tracking
 */
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate database schema changes
 */
function generateSchemaChanges(profile: ProjectProfile): PlannedChange[] {
  const changes: PlannedChange[] = [];

  const schemaContent = generatePrismaSchema(profile);
  const schemaDescription = describePrismaSchema(profile);

  changes.push({
    id: generateChangeId('schema', 'prisma'),
    category: ChangeCategory.SCHEMA,
    changeType: ChangeType.UPDATE,
    targetPath: 'packages/database/prisma/schema.prisma',
    description: `Update Prisma schema: ${schemaDescription}`,
    content: schemaContent,
    contentHash: hashContent(schemaContent),
    dependencies: [],
  });

  return changes;
}

/**
 * Generate environment configuration changes
 */
function generateEnvChanges(profile: ProjectProfile): PlannedChange[] {
  const changes: PlannedChange[] = [];
  const { selectedApps } = profile;

  // Database package env
  const dbEnvContent = generateEnvTemplate(profile, 'database');
  changes.push({
    id: generateChangeId('env', 'database'),
    category: ChangeCategory.ENV_CONFIG,
    changeType: ChangeType.UPDATE,
    targetPath: 'packages/database/.env.example',
    description: 'Update database package environment template',
    content: dbEnvContent,
    contentHash: hashContent(dbEnvContent),
    dependencies: [],
  });

  // App env files
  if (selectedApps.app) {
    const appEnvContent = generateEnvTemplate(profile, 'app');
    changes.push({
      id: generateChangeId('env', 'app'),
      category: ChangeCategory.ENV_CONFIG,
      changeType: ChangeType.UPDATE,
      targetPath: 'apps/app/.env.example',
      description: 'Update main app environment template',
      content: appEnvContent,
      contentHash: hashContent(appEnvContent),
      dependencies: [],
    });
  }

  if (selectedApps.api) {
    const apiEnvContent = generateEnvTemplate(profile, 'api');
    changes.push({
      id: generateChangeId('env', 'api'),
      category: ChangeCategory.ENV_CONFIG,
      changeType: ChangeType.UPDATE,
      targetPath: 'apps/api/.env.example',
      description: 'Update API app environment template',
      content: apiEnvContent,
      contentHash: hashContent(apiEnvContent),
      dependencies: [],
    });
  }

  if (selectedApps.web) {
    const webEnvContent = generateEnvTemplate(profile, 'web');
    changes.push({
      id: generateChangeId('env', 'web'),
      category: ChangeCategory.ENV_CONFIG,
      changeType: ChangeType.UPDATE,
      targetPath: 'apps/web/.env.example',
      description: 'Update web app environment template',
      content: webEnvContent,
      contentHash: hashContent(webEnvContent),
      dependencies: [],
    });
  }

  return changes;
}

/**
 * Generate wiring/integration code changes
 */
function generateWiringChanges(profile: ProjectProfile): PlannedChange[] {
  const changes: PlannedChange[] = [];
  const { crossCuttingConcerns, selectedApps } = profile;

  // Rate limiting middleware
  if (crossCuttingConcerns.rateLimit.enabled && selectedApps.api) {
    const rateLimitContent = generateRateLimitMiddleware();
    changes.push({
      id: generateChangeId('wiring', 'rate-limit'),
      category: ChangeCategory.WIRING,
      changeType: ChangeType.CREATE,
      targetPath: 'apps/api/lib/rate-limit.ts',
      description: 'Create rate limiting middleware for API routes',
      content: rateLimitContent,
      contentHash: hashContent(rateLimitContent),
      dependencies: [],
    });
  }

  // Storage utilities
  if (crossCuttingConcerns.storage.enabled && selectedApps.app) {
    const storageContent = generateStorageUtil();
    changes.push({
      id: generateChangeId('wiring', 'storage'),
      category: ChangeCategory.WIRING,
      changeType: ChangeType.CREATE,
      targetPath: 'apps/app/lib/storage.ts',
      description: 'Create storage utility helpers for file uploads',
      content: storageContent,
      contentHash: hashContent(storageContent),
      dependencies: [],
    });
  }

  // Analytics identifier (PostHog)
  if (crossCuttingConcerns.analytics.posthog && selectedApps.app) {
    const analyticsContent = generateAnalyticsProvider(profile);
    changes.push({
      id: generateChangeId('wiring', 'analytics'),
      category: ChangeCategory.WIRING,
      changeType: ChangeType.CREATE,
      targetPath:
        'apps/app/app/(authenticated)/components/posthog-identifier.tsx',
      description: 'Create PostHog analytics identifier component',
      content: analyticsContent,
      contentHash: hashContent(analyticsContent),
      dependencies: [],
    });
  }

  // Instrumentation for observability
  if (crossCuttingConcerns.observability.enabled && selectedApps.app) {
    const instrumentationContent = generateInstrumentation();
    changes.push({
      id: generateChangeId('wiring', 'instrumentation-app'),
      category: ChangeCategory.WIRING,
      changeType: ChangeType.CREATE,
      targetPath: 'apps/app/instrumentation.ts',
      description: 'Create instrumentation file for Sentry initialization',
      content: instrumentationContent,
      contentHash: hashContent(instrumentationContent),
      dependencies: [],
    });
  }

  if (crossCuttingConcerns.observability.enabled && selectedApps.api) {
    const instrumentationContent = generateInstrumentation();
    changes.push({
      id: generateChangeId('wiring', 'instrumentation-api'),
      category: ChangeCategory.WIRING,
      changeType: ChangeType.CREATE,
      targetPath: 'apps/api/instrumentation.ts',
      description: 'Create instrumentation file for Sentry initialization',
      content: instrumentationContent,
      contentHash: hashContent(instrumentationContent),
      dependencies: [],
    });
  }

  // Database seed script
  const seedContent = generateDatabaseSeed(profile);
  changes.push({
    id: generateChangeId('wiring', 'db-seed'),
    category: ChangeCategory.WIRING,
    changeType: ChangeType.CREATE,
    targetPath: 'packages/database/seed.ts',
    description: 'Create database seed script for development data',
    content: seedContent,
    contentHash: hashContent(seedContent),
    dependencies: [],
  });

  return changes;
}

/**
 * Generate documentation changes
 */
function generateDocChanges(profile: ProjectProfile): PlannedChange[] {
  const changes: PlannedChange[] = [];

  const summaryContent = generateSetupSummaryDoc(profile);
  changes.push({
    id: generateChangeId('docs', 'setup-summary'),
    category: ChangeCategory.DOCUMENTATION,
    changeType: ChangeType.CREATE,
    targetPath: 'PROJECT_SETUP.md',
    description: 'Create project setup summary documentation',
    content: summaryContent,
    contentHash: hashContent(summaryContent),
    dependencies: [],
  });

  return changes;
}

/**
 * Generate a complete setup plan from a project profile
 */
export function generateSetupPlan(
  planId: string,
  sessionId: string,
  profile: ProjectProfile
): SetupPlan {
  const allChanges: PlannedChange[] = [
    ...generateSchemaChanges(profile),
    ...generateEnvChanges(profile),
    ...generateWiringChanges(profile),
    ...generateDocChanges(profile),
  ];

  return createSetupPlan(planId, sessionId, profile.id, allChanges);
}

/**
 * Get a human-readable summary of the plan
 */
export function getPlanSummary(plan: SetupPlan): string {
  const lines: string[] = [
    `Setup Plan (${plan.id})`,
    `Total Changes: ${plan.summary.totalChanges}`,
    '',
    'Changes by Category:',
  ];

  for (const [category, count] of Object.entries(plan.summary.byCategory)) {
    lines.push(`  - ${category}: ${count}`);
  }

  lines.push('', 'Planned Files:');
  for (const change of plan.changes) {
    let icon = '-';
    if (change.changeType === ChangeType.CREATE) {
      icon = '+';
    } else if (change.changeType === ChangeType.UPDATE) {
      icon = '~';
    }
    lines.push(`  ${icon} ${change.targetPath}`);
  }

  return lines.join('\n');
}
