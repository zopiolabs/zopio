#!/usr/bin/env npx tsx
/**
 * SPDX-License-Identifier: MIT
 *
 * Validation script for Project Setup MCP
 *
 * Runs a complete setup flow with predefined answers to verify
 * that the MCP server works correctly.
 *
 * Usage:
 *   npx tsx scripts/validate-setup.ts
 *   npx tsx scripts/validate-setup.ts --dry-run
 */

import { existsSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  createProjectSetupServer,
  SessionStatus,
  TargetUserType,
  TenancyModel,
} from '../src/index.js';

const isDryRun = process.argv.includes('--dry-run');

console.log('🚀 Project Setup MCP Validation Script');
console.log('======================================\n');

// Create temp directory
const testDir = join(tmpdir(), `zopio-validate-${Date.now()}`);
console.log(`📁 Test directory: ${testDir}`);

try {
  // Setup test directory structure
  mkdirSync(testDir, { recursive: true });
  mkdirSync(join(testDir, 'apps', 'app', 'app', '(authenticated)', 'components'), { recursive: true });
  mkdirSync(join(testDir, 'apps', 'api', 'lib'), { recursive: true });
  mkdirSync(join(testDir, 'packages', 'database', 'prisma'), { recursive: true });

  console.log('✅ Test directory structure created\n');

  // Create server and run setup
  const server = createProjectSetupServer();

  const answers = {
    project_name: 'validation-test',
    project_description: 'A test project for validating the setup flow',
    target_users: TargetUserType.PUBLIC_SAAS,
    selected_apps: ['app', 'api'],
    tenancy_model: TenancyModel.MULTI_TENANT,
    primary_entity: 'organization',
    auth_enabled: true,
    auth_roles: true,
    observability_enabled: true,
    analytics_providers: ['posthog'],
    storage_enabled: true,
    rate_limit_enabled: true,
  };

  console.log('📝 Running setup with test answers:');
  console.log(JSON.stringify(answers, null, 2));
  console.log('');

  const result = server.runWithAnswers(answers, {
    rootDir: testDir,
    dryRun: isDryRun,
  });

  // Verify results
  console.log('\n📊 Results:');
  console.log(`   Session Status: ${result.session.status}`);
  console.log(`   Profile ID: ${result.profile.id.substring(0, 8)}...`);
  console.log(`   Plan Changes: ${result.plan.changes.length}`);
  console.log(`   Changeset Summary:`);
  console.log(`     - Successful: ${result.changeset.summary.successful}`);
  console.log(`     - Skipped: ${result.changeset.summary.skipped}`);
  console.log(`     - Failed: ${result.changeset.summary.failed}`);

  // Verify assertions
  const failures: string[] = [];

  if (result.session.status !== SessionStatus.COMPLETED) {
    failures.push(`Expected session status COMPLETED, got ${result.session.status}`);
  }

  if (result.profile.metadata.name !== 'validation-test') {
    failures.push(`Expected project name 'validation-test', got '${result.profile.metadata.name}'`);
  }

  if (result.profile.architecture.primaryEntity !== 'organization') {
    failures.push(`Expected primary entity 'organization', got '${result.profile.architecture.primaryEntity}'`);
  }

  if (!isDryRun) {
    // Check files were created
    const expectedFiles = [
      'packages/database/prisma/schema.prisma',
      'packages/database/seed.ts',
      'apps/app/.env.example',
      'apps/api/.env.example',
      'apps/api/lib/rate-limit.ts',
      'apps/app/lib/storage.ts',
      'apps/app/app/(authenticated)/components/posthog-identifier.tsx',
      'apps/app/instrumentation.ts',
      'apps/api/instrumentation.ts',
      'PROJECT_SETUP.md',
    ];

    for (const file of expectedFiles) {
      const fullPath = join(testDir, file);
      if (!existsSync(fullPath)) {
        failures.push(`Expected file not created: ${file}`);
      }
    }

    // Verify schema content
    const schemaPath = join(testDir, 'packages/database/prisma/schema.prisma');
    if (existsSync(schemaPath)) {
      const schemaContent = readFileSync(schemaPath, 'utf-8');
      if (!schemaContent.includes('model User')) {
        failures.push('Schema missing User model');
      }
      if (!schemaContent.includes('model Organization')) {
        failures.push('Schema missing Organization model');
      }
      if (!schemaContent.includes('model Membership')) {
        failures.push('Schema missing Membership model');
      }
      if (!schemaContent.includes('role')) {
        failures.push('Schema missing role field (auth_roles was enabled)');
      }
    }
  }

  if (result.changeset.summary.failed > 0) {
    failures.push(`${result.changeset.summary.failed} changes failed to apply`);
  }

  // Report results
  console.log('\n');
  if (failures.length > 0) {
    console.log('❌ Validation FAILED:');
    for (const failure of failures) {
      console.log(`   - ${failure}`);
    }
    process.exit(1);
  } else {
    console.log('✅ Validation PASSED!');
    if (isDryRun) {
      console.log('   (Dry run mode - no files were actually created)');
    }
  }

} catch (error) {
  console.error('\n❌ Error during validation:');
  console.error(error);
  process.exit(1);
} finally {
  // Cleanup
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true, force: true });
    console.log(`\n🧹 Cleaned up test directory`);
  }
}
