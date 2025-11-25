/**
 * SPDX-License-Identifier: MIT
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { AppliedChangeset, SetupPlan } from './types.js';

export class PlanExecutor {
  async execute(
    plan: SetupPlan,
    workspaceRoot: string
  ): Promise<AppliedChangeset> {
    const changeset: AppliedChangeset = {
      id: crypto.randomUUID(),
      sessionId: plan.id,
      planId: plan.id,
      touchedFiles: [],
      notes: [],
      timestamp: new Date().toISOString(),
    };

    await this.applyEnvTemplates(plan.envTemplates, workspaceRoot, changeset);
    await this.applyPrismaSchema(plan.prismaSchema, workspaceRoot, changeset);

    return changeset;
  }

  private async applyEnvTemplates(
    templates: Record<string, string>,
    workspaceRoot: string,
    changeset: AppliedChangeset
  ) {
    for (const [relPath, content] of Object.entries(templates)) {
      const absPath = path.join(workspaceRoot, relPath);
      try {
        await this.ensureDirectory(path.dirname(absPath));
        await this.processEnvFile(absPath, relPath, content, changeset);
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        changeset.notes.push(`Failed to write ${relPath}: ${msg}`);
      }
    }
  }

  private async processEnvFile(
    absPath: string,
    relPath: string,
    content: string,
    changeset: AppliedChangeset
  ) {
    let existing = '';
    try {
      existing = await fs.readFile(absPath, 'utf-8');
    } catch (_) {
      // File doesn't exist
    }

    if (existing) {
      await this.mergeEnvFile(absPath, relPath, existing, content, changeset);
    } else {
      await fs.writeFile(absPath, content);
      changeset.touchedFiles.push({ path: relPath, type: 'created' });
    }
  }

  private async mergeEnvFile(
    absPath: string,
    relPath: string,
    existing: string,
    content: string,
    changeset: AppliedChangeset
  ) {
    let newContent = existing;
    if (!newContent.endsWith('\n')) {
      newContent += '\n';
    }

    const sections = content.split('\n\n');
    let updated = false;
    for (const section of sections) {
      if (!section.trim()) {
        continue;
      }
      const firstLine = section.split('\n')[0];
      if (!existing.includes(firstLine)) {
        newContent += `\n${section}\n`;
        updated = true;
      }
    }

    if (updated) {
      await fs.writeFile(absPath, newContent);
      changeset.touchedFiles.push({ path: relPath, type: 'updated' });
    }
  }

  private async applyPrismaSchema(
    schema: string,
    workspaceRoot: string,
    changeset: AppliedChangeset
  ) {
    if (!schema) {
      return;
    }

    const relPath = 'packages/database/prisma/schema.prisma';
    const absPath = path.join(workspaceRoot, relPath);
    try {
      await this.ensureDirectory(path.dirname(absPath));
      // Check if it's the stub
      let existing = '';
      try {
        existing = await fs.readFile(absPath, 'utf-8');
      } catch (_) {
        // File doesn't exist
      }

      const isStub = existing.includes('// This is a stub model.');
      if (isStub || !existing) {
        await fs.writeFile(absPath, schema);
        changeset.touchedFiles.push({
          path: relPath,
          type: existing ? 'updated' : 'created',
        });
      } else {
        changeset.notes.push(
          `Skipped overwriting ${relPath} as it appears to be customized already.`
        );
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      changeset.notes.push(`Failed to write ${relPath}: ${msg}`);
    }
  }

  private async ensureDirectory(dirPath: string) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (_) {
      // ignore if exists
    }
  }
}
