/**
 * SPDX-License-Identifier: MIT
 */

import { ProjectSetupServer } from '@repo/project-setup-mcp';
import path from 'node:path';
import fs from 'node:fs/promises';

async function validate() {
  console.log('Starting validation...');
  const server = new ProjectSetupServer();
  const session = server.startSession();
  const sessionId = session.id;

  console.log('Session started:', sessionId);

  // Canned answers
  const answers = {
    project_name: 'Test Project',
    project_description: 'A test project for validation',
    target_users: 'internal',
    selected_apps: ['app', 'api'],
    architecture_type: 'multi_tenant',
    domain_entity: 'Team',
    confirm_features: ['auth', 'database', 'observability']
  };

  // Drive interview
  let q = server.getNextQuestion(sessionId);
  while (q) {
    const ans = (answers as any)[q.id];
    if (ans === undefined && q.required) {
        // Skip optional questions if no answer provided
        if (!q.required) {
            server.submitAnswer(sessionId, null);
        } else {
             throw new Error(`Missing answer for ${q.id}`);
        }
    } else {
        console.log(`Answering ${q.id} with ${JSON.stringify(ans)}`);
        server.submitAnswer(sessionId, ans);
    }
    q = server.getNextQuestion(sessionId);
  }

  console.log('Generating plan...');
  const plan = server.generatePlan(sessionId);

  console.log('Plan targets:', plan.targetFiles);

  if (!plan.prismaSchema.includes('model Team')) {
    throw new Error('Plan missing expected Team model in Prisma schema');
  }
  if (!plan.envTemplates['apps/app/.env.example']) {
    throw new Error('Plan missing app/.env.example');
  }

  console.log('Applying plan to temp directory...');
  const tempDir = path.join(process.cwd(), 'temp-validation-' + Date.now());
  await fs.mkdir(tempDir, { recursive: true });

  try {
      const changeset = await server.applyPlan(sessionId, tempDir);
      console.log('Changeset:', changeset.touchedFiles.map(f => f.path));

      // Verify file existence in tempDir
      const schemaPath = path.join(tempDir, 'packages/database/prisma/schema.prisma');
      const envPath = path.join(tempDir, 'apps/app/.env.example');

      try {
        await fs.access(schemaPath);
        console.log('Verified: Schema file exists');
      } catch {
          throw new Error('Schema file not found');
      }

      try {
        await fs.access(envPath);
        console.log('Verified: Env file exists');
      } catch {
          throw new Error('Env file not found');
      }

      console.log('Validation SUCCESS');
  } finally {
      // Cleanup
      await fs.rm(tempDir, { recursive: true, force: true });
  }
}

validate().catch(e => {
  console.error(e);
  process.exit(1);
});
