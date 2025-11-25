/**
 * SPDX-License-Identifier: MIT
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  createProjectSetupServer,
  SessionStatus,
  TargetUserType,
  TenancyModel,
  ChangeType,
  ApplyResult,
} from '../index.js';

describe('Project Setup MCP Server', () => {
  let testDir: string;

  beforeEach(() => {
    // Create a temporary test directory
    testDir = join(tmpdir(), `zopio-test-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });

    // Create minimal directory structure
    mkdirSync(join(testDir, 'apps', 'app'), { recursive: true });
    mkdirSync(join(testDir, 'apps', 'api'), { recursive: true });
    mkdirSync(join(testDir, 'packages', 'database', 'prisma'), { recursive: true });
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Session Management', () => {
    it('should start a new session', () => {
      const server = createProjectSetupServer();
      const result = server.startSession();

      expect(result.session).toBeDefined();
      expect(result.session.id).toBeTruthy();
      expect(result.session.status).toBe(SessionStatus.IN_PROGRESS);
      expect(result.firstQuestion).toBeDefined();
      expect(result.firstQuestion.id).toBe('project_name');
    });

    it('should track session state', () => {
      const server = createProjectSetupServer();
      const { session } = server.startSession();

      const retrieved = server.getSession(session.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(session.id);
    });

    it('should list all sessions', () => {
      const server = createProjectSetupServer();
      server.startSession();
      server.startSession();

      const sessions = server.listSessions();
      expect(sessions.length).toBe(2);
    });

    it('should delete a session', () => {
      const server = createProjectSetupServer();
      const { session } = server.startSession();

      const deleted = server.deleteSession(session.id);
      expect(deleted).toBe(true);

      const retrieved = server.getSession(session.id);
      expect(retrieved).toBeNull();
    });
  });

  describe('Interview Flow', () => {
    it('should get the current question', () => {
      const server = createProjectSetupServer();
      const { session } = server.startSession();

      const question = server.getCurrentQuestion(session.id);
      expect(question).toBeDefined();
      expect(question?.id).toBe('project_name');
    });

    it('should accept valid answers', () => {
      const server = createProjectSetupServer();
      const { session } = server.startSession();

      const result = server.submitAnswer(session.id, {
        questionId: 'project_name',
        value: 'test-project',
      });

      expect(result.accepted).toBe(true);
      expect(result.nextQuestion).toBeDefined();
      expect(result.nextQuestion?.id).toBe('project_description');
    });

    it('should reject invalid answers', () => {
      const server = createProjectSetupServer();
      const { session } = server.startSession();

      const result = server.submitAnswer(session.id, {
        questionId: 'project_name',
        value: 'Invalid Name!', // Contains invalid characters
      });

      expect(result.accepted).toBe(false);
      expect(result.errorMessage).toBeDefined();
    });

    it('should complete the interview', () => {
      const server = createProjectSetupServer();
      const { session } = server.startSession();

      // Submit all required answers
      const answers: Record<string, unknown> = {
        project_name: 'test-project',
        project_description: 'A test project',
        target_users: TargetUserType.PUBLIC_SAAS,
        selected_apps: ['app', 'api'],
        tenancy_model: TenancyModel.MULTI_TENANT,
        primary_entity: 'organization',
        auth_enabled: true,
        auth_roles: false,
        observability_enabled: true,
        analytics_providers: [],
        storage_enabled: false,
        rate_limit_enabled: false,
      };

      let currentQuestion = server.getCurrentQuestion(session.id);
      while (currentQuestion !== null) {
        const answer = answers[currentQuestion.id] ?? currentQuestion.defaultValue;
        const result = server.submitAnswer(session.id, {
          questionId: currentQuestion.id,
          value: answer as string | string[] | boolean,
        });
        currentQuestion = result.nextQuestion ?? null;
      }

      const finalSession = server.getSession(session.id);
      expect(finalSession?.status).toBe(SessionStatus.INTERVIEW_COMPLETE);
    });
  });

  describe('Plan Generation', () => {
    it('should generate a plan after interview completion', () => {
      const server = createProjectSetupServer();
      const answers = {
        project_name: 'test-project',
        project_description: 'Test description',
        target_users: TargetUserType.PUBLIC_SAAS,
        selected_apps: ['app', 'api'],
        tenancy_model: TenancyModel.MULTI_TENANT,
        primary_entity: 'workspace',
        auth_enabled: true,
        auth_roles: true,
        observability_enabled: true,
        analytics_providers: ['posthog'],
        storage_enabled: true,
        rate_limit_enabled: true,
      };

      const result = server.runWithAnswers(answers, {
        rootDir: testDir,
        dryRun: true,
      });

      expect(result.plan).toBeDefined();
      expect(result.plan.changes.length).toBeGreaterThan(0);
      expect(result.profile.metadata.name).toBe('test-project');
      expect(result.profile.architecture.primaryEntity).toBe('workspace');
    });

    it('should include schema changes in the plan', () => {
      const server = createProjectSetupServer();
      const answers = {
        project_name: 'test-project',
        target_users: TargetUserType.PUBLIC_SAAS,
        selected_apps: ['app', 'api'],
        tenancy_model: TenancyModel.MULTI_TENANT,
        primary_entity: 'organization',
      };

      const result = server.runWithAnswers(answers, {
        rootDir: testDir,
        dryRun: true,
      });

      const schemaChange = result.plan.changes.find(
        (c) => c.targetPath.includes('schema.prisma')
      );
      expect(schemaChange).toBeDefined();
      expect(schemaChange?.content).toContain('model User');
      expect(schemaChange?.content).toContain('model Organization');
      expect(schemaChange?.content).toContain('model Membership');
    });
  });

  describe('Plan Application', () => {
    it('should apply plan in dry-run mode', () => {
      const server = createProjectSetupServer();
      const answers = {
        project_name: 'test-project',
        target_users: TargetUserType.INTERNAL_TOOL,
        selected_apps: ['app'],
        tenancy_model: TenancyModel.SINGLE_TENANT,
        primary_entity: 'user',
      };

      const result = server.runWithAnswers(answers, {
        rootDir: testDir,
        dryRun: true,
      });

      expect(result.changeset).toBeDefined();
      expect(result.changeset.notes).toContain(
        'This was a dry run - no actual changes were made'
      );
    });

    it('should apply plan and create files', () => {
      const server = createProjectSetupServer();
      const answers = {
        project_name: 'my-app',
        target_users: TargetUserType.B2B_PORTAL,
        selected_apps: ['app', 'api'],
        tenancy_model: TenancyModel.MULTI_TENANT,
        primary_entity: 'tenant',
        auth_enabled: true,
        observability_enabled: true,
        storage_enabled: false,
        rate_limit_enabled: false,
      };

      const result = server.runWithAnswers(answers, {
        rootDir: testDir,
        dryRun: false,
      });

      // Check that files were created
      expect(result.session.status).toBe(SessionStatus.COMPLETED);
      expect(result.changeset.summary.successful).toBeGreaterThan(0);

      // Check schema file
      const schemaPath = join(testDir, 'packages/database/prisma/schema.prisma');
      expect(existsSync(schemaPath)).toBe(true);

      const schemaContent = readFileSync(schemaPath, 'utf-8');
      expect(schemaContent).toContain('model Tenant');
      expect(schemaContent).toContain('model Membership');

      // Check PROJECT_SETUP.md
      const summaryPath = join(testDir, 'PROJECT_SETUP.md');
      expect(existsSync(summaryPath)).toBe(true);

      const summaryContent = readFileSync(summaryPath, 'utf-8');
      expect(summaryContent).toContain('my-app');
    });

    it('should be idempotent on re-run', () => {
      const server = createProjectSetupServer();
      const answers = {
        project_name: 'idempotent-test',
        target_users: TargetUserType.PUBLIC_SAAS,
        selected_apps: ['app'],
        tenancy_model: TenancyModel.SINGLE_TENANT,
        primary_entity: 'account',
      };

      // First run
      const result1 = server.runWithAnswers(answers, {
        rootDir: testDir,
        dryRun: false,
      });

      // Second run with same answers
      const server2 = createProjectSetupServer();
      const result2 = server2.runWithAnswers(answers, {
        rootDir: testDir,
        dryRun: false,
      });

      // Should skip already-existing identical files
      expect(result2.changeset.summary.skipped).toBeGreaterThan(0);
      expect(result2.changeset.summary.failed).toBe(0);
    });
  });

  describe('Profile Building', () => {
    it('should build profile with correct metadata', () => {
      const server = createProjectSetupServer();
      const answers = {
        project_name: 'profile-test',
        project_description: 'Testing profile generation',
        target_users: TargetUserType.B2B_PORTAL,
        selected_apps: ['app', 'api', 'web'],
        tenancy_model: TenancyModel.MULTI_TENANT,
        primary_entity: 'company',
        auth_enabled: true,
        auth_roles: true,
        observability_enabled: true,
        analytics_providers: ['posthog', 'google_analytics'],
        storage_enabled: true,
        rate_limit_enabled: true,
      };

      const result = server.runWithAnswers(answers, {
        rootDir: testDir,
        dryRun: true,
      });

      const { profile } = result;

      // Check metadata
      expect(profile.metadata.name).toBe('profile-test');
      expect(profile.metadata.description).toBe('Testing profile generation');
      expect(profile.metadata.targetUsers).toBe(TargetUserType.B2B_PORTAL);

      // Check selected apps
      expect(profile.selectedApps.app).toBe(true);
      expect(profile.selectedApps.api).toBe(true);
      expect(profile.selectedApps.web).toBe(true);
      expect(profile.selectedApps.docs).toBe(false);

      // Check architecture
      expect(profile.architecture.tenancyModel).toBe(TenancyModel.MULTI_TENANT);
      expect(profile.architecture.primaryEntity).toBe('company');

      // Check cross-cutting concerns
      expect(profile.crossCuttingConcerns.auth.enabled).toBe(true);
      expect(profile.crossCuttingConcerns.auth.requiresRoles).toBe(true);
      expect(profile.crossCuttingConcerns.analytics.posthog).toBe(true);
      expect(profile.crossCuttingConcerns.analytics.googleAnalytics).toBe(true);
      expect(profile.crossCuttingConcerns.storage.enabled).toBe(true);
      expect(profile.crossCuttingConcerns.rateLimit.enabled).toBe(true);
    });
  });
});
