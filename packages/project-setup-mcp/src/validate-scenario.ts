/**
 * SPDX-License-Identifier: MIT
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProjectSetupMCP } from './server.js';

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rootDir = join(__dirname, '..', '..', '..');

  const mcp = new ProjectSetupMCP({ rootDir });

  const session = mcp.startSession();

  const cannedAnswers: Record<string, string | string[]> = {
    project_name: 'zopio-sample',
    project_description: 'Sample multi-tenant Zopio project',
    target_users: 'public_saas',
    apps: ['app', 'api', 'web'],
    architecture: 'multi_tenant',
    primary_entity: 'organization',
    entity_relationships:
      'Each organization can have many users via memberships.',
    auth: 'basic',
    database_centrality: 'core',
    observability_level: 'standard',
    analytics_level: 'basic',
    storage_needs: 'basic',
    rate_limiting: 'basic',
  };

  for (const [id, answer] of Object.entries(cannedAnswers)) {
    mcp.submitAnswer(session.id, id, answer);
  }

  mcp.getProjectProfile(session.id);
  const plan = mcp.generateSetupPlan(session.id);
  await mcp.applySetupPlan(plan.id);

  // Basic validations
  const prismaSchemaPath = join(
    rootDir,
    'packages',
    'database',
    'prisma',
    'schema.prisma'
  );
  const prismaSchema = await readFile(prismaSchemaPath, 'utf8');

  if (!prismaSchema.includes('model User')) {
    throw new Error(
      'Validation failed: Prisma schema does not contain a User model.'
    );
  }

  if (prismaSchema.includes('model Page')) {
    throw new Error(
      'Validation failed: Prisma schema still contains the stub Page model.'
    );
  }

  const storageEnvPath = join(rootDir, 'packages', 'storage', '.env.example');
  const storageEnv = await readFile(storageEnvPath, 'utf8');
  if (!storageEnv.includes('BLOB_READ_WRITE_TOKEN')) {
    throw new Error(
      'Validation failed: storage .env.example does not contain BLOB_READ_WRITE_TOKEN.'
    );
  }

  const apiEnvPath = join(rootDir, 'apps', 'api', '.env.example');
  const apiEnv = await readFile(apiEnvPath, 'utf8');
  if (!apiEnv.includes('UPSTASH_REDIS_REST_URL')) {
    throw new Error(
      'Validation failed: apps/api .env.example does not contain UPSTASH_REDIS_REST_URL.'
    );
  }

  const rateLimitedRoutePath = join(
    rootDir,
    'apps',
    'api',
    'app',
    'rate-limited',
    'ping',
    'route.ts'
  );
  const rateLimitedRoute = await readFile(rateLimitedRoutePath, 'utf8');
  if (!rateLimitedRoute.includes('createRateLimiter')) {
    throw new Error(
      'Validation failed: rate-limited ping route does not use createRateLimiter.'
    );
  }

  const storageRoutePath = join(
    rootDir,
    'apps',
    'api',
    'app',
    'storage',
    'example-upload',
    'route.ts'
  );
  const storageRoute = await readFile(storageRoutePath, 'utf8');
  if (!storageRoute.includes('@repo/storage')) {
    throw new Error(
      'Validation failed: storage example route does not import @repo/storage.'
    );
  }
}

main().catch((error: unknown) => {
  process.exitCode = 1;
  throw error;
});
