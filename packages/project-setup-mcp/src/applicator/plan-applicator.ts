/**
 * SPDX-License-Identifier: MIT
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { AppliedChange, AppliedChangeset } from '../schemas/changeset.js';
import { ApplyResult, createAppliedChangeset } from '../schemas/changeset.js';
import type { PlannedChange, SetupPlan } from '../schemas/plan.js';
import { ChangeType } from '../schemas/plan.js';

/**
 * Options for applying a plan
 */
export interface ApplyOptions {
  /** Root directory of the monorepo */
  rootDir: string;
  /** Whether to perform a dry run (no actual changes) */
  dryRun?: boolean;
  /** Whether to force overwrite existing files */
  forceOverwrite?: boolean;
}

/**
 * Create a content hash for comparison
 */
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Ensure directory exists for a file path
 */
function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Check if a file exists and get its content hash
 */
function getExistingFileInfo(filePath: string): {
  exists: boolean;
  contentHash?: string;
  content?: string;
} {
  if (!existsSync(filePath)) {
    return { exists: false };
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    return {
      exists: true,
      content,
      contentHash: hashContent(content),
    };
  } catch {
    return { exists: true };
  }
}

/**
 * Create a result object for an applied change
 */
function createResult(
  change: PlannedChange,
  result: (typeof ApplyResult)[keyof typeof ApplyResult],
  message: string,
  previousHash?: string,
  newHash?: string
): AppliedChange {
  return {
    changeId: change.id,
    targetPath: change.targetPath,
    changeType: change.changeType,
    result,
    message,
    previousContentHash: previousHash,
    newContentHash: newHash,
    appliedAt: new Date().toISOString(),
  };
}

/**
 * Handle CREATE change type
 */
function handleCreate(
  change: PlannedChange,
  fullPath: string,
  existingInfo: ReturnType<typeof getExistingFileInfo>,
  forceOverwrite?: boolean
): AppliedChange {
  // Skip if file exists and not forcing
  if (existingInfo.exists && !forceOverwrite) {
    const isSameContent = existingInfo.contentHash === change.contentHash;
    const message = isSameContent
      ? 'File already exists with identical content'
      : 'File already exists (use forceOverwrite to replace)';
    return createResult(
      change,
      ApplyResult.SKIPPED,
      message,
      existingInfo.contentHash
    );
  }

  ensureDir(fullPath);
  writeFileSync(fullPath, change.content || '', 'utf-8');

  const message = existingInfo.exists ? 'File replaced' : 'File created';
  return createResult(
    change,
    ApplyResult.SUCCESS,
    message,
    existingInfo.contentHash,
    change.contentHash
  );
}

/**
 * Handle UPDATE change type
 */
function handleUpdate(
  change: PlannedChange,
  fullPath: string,
  existingInfo: ReturnType<typeof getExistingFileInfo>
): AppliedChange {
  ensureDir(fullPath);

  // File doesn't exist - create it
  if (!existingInfo.exists) {
    writeFileSync(fullPath, change.content || '', 'utf-8');
    return createResult(
      change,
      ApplyResult.SUCCESS,
      'File created (did not exist)',
      undefined,
      change.contentHash
    );
  }

  // Content is the same - skip
  if (existingInfo.contentHash === change.contentHash) {
    return createResult(
      change,
      ApplyResult.SKIPPED,
      'File already has the expected content',
      existingInfo.contentHash
    );
  }

  // Write updated content
  writeFileSync(fullPath, change.content || '', 'utf-8');
  return createResult(
    change,
    ApplyResult.SUCCESS,
    'File updated',
    existingInfo.contentHash,
    change.contentHash
  );
}

/**
 * Handle DELETE change type
 */
function handleDelete(
  change: PlannedChange,
  existingInfo: ReturnType<typeof getExistingFileInfo>
): AppliedChange {
  if (!existingInfo.exists) {
    return createResult(change, ApplyResult.SKIPPED, 'File does not exist');
  }
  // For safety, we don't actually delete in setup
  return createResult(
    change,
    ApplyResult.SKIPPED,
    'Delete operations are not executed by setup (manual removal required)',
    existingInfo.contentHash
  );
}

/**
 * Apply a single change
 */
function applyChange(
  change: PlannedChange,
  options: ApplyOptions
): AppliedChange {
  const fullPath = join(options.rootDir, change.targetPath);
  const existingInfo = getExistingFileInfo(fullPath);

  // Dry run - just report what would happen
  if (options.dryRun) {
    return createResult(
      change,
      ApplyResult.SUCCESS,
      `[DRY RUN] Would ${change.changeType} file`,
      existingInfo.contentHash,
      change.contentHash
    );
  }

  try {
    switch (change.changeType) {
      case ChangeType.CREATE:
        return handleCreate(
          change,
          fullPath,
          existingInfo,
          options.forceOverwrite
        );
      case ChangeType.UPDATE:
        return handleUpdate(change, fullPath, existingInfo);
      case ChangeType.DELETE:
        return handleDelete(change, existingInfo);
      default:
        return createResult(
          change,
          ApplyResult.FAILED,
          `Unknown change type: ${change.changeType}`
        );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return createResult(
      change,
      ApplyResult.FAILED,
      `Failed to apply change: ${errorMessage}`
    );
  }
}

/**
 * Apply a setup plan to the filesystem
 */
export function applySetupPlan(
  changesetId: string,
  plan: SetupPlan,
  options: ApplyOptions
): AppliedChangeset {
  const startTime = Date.now();
  const appliedChanges: AppliedChange[] = [];
  const notes: string[] = [];
  const warnings: string[] = [];

  // Sort changes by dependencies (simple topological sort)
  const sortedChanges = [...plan.changes].sort((a, b) => {
    if (a.dependencies.includes(b.id)) {
      return 1;
    }
    if (b.dependencies.includes(a.id)) {
      return -1;
    }
    return 0;
  });

  // Apply each change
  for (const change of sortedChanges) {
    const result = applyChange(change, options);
    appliedChanges.push(result);

    // Collect notes and warnings
    if (result.result === ApplyResult.SKIPPED) {
      notes.push(`Skipped ${change.targetPath}: ${result.message}`);
    } else if (result.result === ApplyResult.FAILED) {
      warnings.push(`Failed ${change.targetPath}: ${result.message}`);
    }
  }

  const durationMs = Date.now() - startTime;

  // Add summary notes
  if (options.dryRun) {
    notes.unshift('This was a dry run - no actual changes were made');
  }

  return createAppliedChangeset(
    changesetId,
    plan.sessionId,
    plan.id,
    appliedChanges,
    durationMs,
    notes,
    warnings
  );
}

/**
 * Get a human-readable summary of the applied changeset
 */
export function getChangesetSummary(changeset: AppliedChangeset): string {
  const lines: string[] = [
    `Applied Changeset (${changeset.id})`,
    `Duration: ${changeset.durationMs}ms`,
    '',
    'Summary:',
    `  - Successful: ${changeset.summary.successful}`,
    `  - Skipped: ${changeset.summary.skipped}`,
    `  - Failed: ${changeset.summary.failed}`,
    '',
  ];

  if (changeset.notes.length > 0) {
    lines.push('Notes:');
    for (const note of changeset.notes) {
      lines.push(`  - ${note}`);
    }
    lines.push('');
  }

  if (changeset.warnings.length > 0) {
    lines.push('Warnings:');
    for (const warning of changeset.warnings) {
      lines.push(`  ⚠ ${warning}`);
    }
    lines.push('');
  }

  lines.push('Changed Files:');
  for (const change of changeset.changes) {
    let icon = '✗';
    if (change.result === ApplyResult.SUCCESS) {
      icon = '✓';
    } else if (change.result === ApplyResult.SKIPPED) {
      icon = '○';
    }
    lines.push(`  ${icon} ${change.targetPath}`);
  }

  return lines.join('\n');
}
