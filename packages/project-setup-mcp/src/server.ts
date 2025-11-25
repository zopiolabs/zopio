/**
 * SPDX-License-Identifier: MIT
 */

import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';
import { MCPServer, type ResourceDefinition } from '@repo/mcp';
import {
  type InterviewQuestion,
  getNextQuestionId,
  getQuestionById,
  normalizeAnswer,
} from './interview.js';
import { generateSetupPlanAttributes, resolvePath } from './plan.js';
import {
  type AppliedFileChange,
  type ChangesetAttributes,
  type ChangesetResource,
  type EnvVarSpec,
  type ProjectProfileAttributes,
  type ProjectProfileResource,
  type SetupPlanAttributes,
  type SetupPlanResource,
  type SetupSessionAttributes,
  type SetupSessionResource,
  changesetSchema,
  envVarSpecSchema,
  projectAppsSchema,
  projectProfileSchema,
  setupPlanSchema,
  setupSessionSchema,
} from './schemas.js';

type SessionWithAttrs = SetupSessionResource & {
  attributes: SetupSessionAttributes;
};

type ProfileWithAttrs = ProjectProfileResource & {
  attributes: ProjectProfileAttributes;
};

type PlanWithAttrs = SetupPlanResource & {
  attributes: SetupPlanAttributes;
};

interface NodeError {
  code?: string;
}

const NEWLINE_PATTERN = /\r?\n/;
const ENV_VAR_PATTERN = /^\s*([A-Z0-9_]+)\s*=/;

function isEnoentError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as NodeError).code === 'ENOENT'
  );
}

export interface ProjectSetupMCPOptions {
  rootDir: string;
}

export interface NextQuestionResult {
  done: boolean;
  question?: InterviewQuestion;
}

export class ProjectSetupMCP {
  private readonly server: MCPServer;
  private readonly rootDir: string;

  constructor(options: ProjectSetupMCPOptions) {
    this.rootDir = options.rootDir;

    const resources: Record<string, ResourceDefinition> = {
      'project-setup-session': MCPServer.createResourceDefinition(
        setupSessionSchema,
        {
          description:
            'Tracks the state of an interactive project-setup interview session.',
        }
      ),
      'project-profile': MCPServer.createResourceDefinition(
        projectProfileSchema,
        {
          description:
            'Summarizes the technical and domain profile of a Zopio project.',
        }
      ),
      'project-setup-plan': MCPServer.createResourceDefinition(
        setupPlanSchema,
        {
          description:
            'Describes the planned changes for bootstrapping a Zopio-based project.',
        }
      ),
      'project-setup-changeset': MCPServer.createResourceDefinition(
        changesetSchema,
        {
          description:
            'Records the concrete filesystem changes applied for a project-setup plan.',
        }
      ),
    };

    this.server = new MCPServer({
      name: 'project-setup-mcp',
      description:
        'Monorepo-aware project setup MCP for bootstrapping new Zopio-based projects.',
      resources,
    });
  }

  private nowISO(): string {
    return new Date().toISOString();
  }

  private getSession(id: string): SessionWithAttrs {
    const resource = this.server.getResource(
      'project-setup-session',
      id
    ) as SetupSessionResource | null;
    if (!resource || resource.type !== 'project-setup-session') {
      throw new Error(`Setup session '${id}' not found.`);
    }
    if (!resource.attributes) {
      throw new Error(`Setup session '${id}' is missing attributes.`);
    }
    return resource as SessionWithAttrs;
  }

  private updateSessionAttributes(
    session: SessionWithAttrs,
    updates: Partial<SetupSessionAttributes>
  ): SetupSessionResource {
    const merged: SetupSessionAttributes = {
      ...session.attributes,
      ...updates,
      updatedAt: this.nowISO(),
    };
    const updated: SessionWithAttrs = {
      ...session,
      attributes: merged,
    };
    this.server.registerResource(updated);
    return updated;
  }

  private getProfile(id: string): ProfileWithAttrs {
    const resource = this.server.getResource(
      'project-profile',
      id
    ) as ProjectProfileResource | null;
    if (!resource || resource.type !== 'project-profile') {
      throw new Error(`Project profile '${id}' not found.`);
    }
    if (!resource.attributes) {
      throw new Error(`Project profile '${id}' is missing attributes.`);
    }
    return resource as ProfileWithAttrs;
  }

  private getPlan(id: string): PlanWithAttrs {
    const resource = this.server.getResource(
      'project-setup-plan',
      id
    ) as SetupPlanResource | null;
    if (!resource || resource.type !== 'project-setup-plan') {
      throw new Error(`Setup plan '${id}' not found.`);
    }
    if (!resource.attributes) {
      throw new Error(`Setup plan '${id}' is missing attributes.`);
    }
    return resource as PlanWithAttrs;
  }

  startSession(): SetupSessionResource {
    const id = randomUUID();
    const now = this.nowISO();
    const attributes: SetupSessionAttributes = {
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      currentQuestionId: null,
      answers: {},
      profileId: null,
      planId: null,
    };

    const resource: SetupSessionResource = {
      id,
      type: 'project-setup-session',
      attributes,
    };

    this.server.registerResource(resource);
    return resource;
  }

  getNextQuestion(sessionId: string): NextQuestionResult {
    const session = this.getSession(sessionId);
    const attrs = session.attributes;

    const nextId = getNextQuestionId(attrs.answers);

    if (!nextId) {
      if (
        attrs.status === 'pending' ||
        attrs.status === 'interview_in_progress'
      ) {
        this.updateSessionAttributes(session, {
          status: 'interview_completed',
          currentQuestionId: null,
        });
      }
      return { done: true };
    }

    const question = getQuestionById(nextId);
    if (!question) {
      throw new Error(`Unknown question id '${nextId}'.`);
    }

    if (attrs.status === 'pending') {
      this.updateSessionAttributes(session, {
        status: 'interview_in_progress',
        currentQuestionId: question.id,
      });
    } else if (attrs.currentQuestionId !== question.id) {
      this.updateSessionAttributes(session, {
        currentQuestionId: question.id,
      });
    }

    return {
      done: false,
      question,
    };
  }

  submitAnswer(
    sessionId: string,
    questionId: string,
    answer: unknown
  ): SetupSessionResource {
    const session = this.getSession(sessionId);
    const attrs = session.attributes;

    const question = getQuestionById(questionId);
    if (!question) {
      throw new Error(`Unknown question id '${questionId}'.`);
    }

    const normalized = normalizeAnswer(question, answer);
    const updatedAnswers: SetupSessionAttributes['answers'] = {
      ...attrs.answers,
      [questionId]: normalized,
    };

    const nextId = getNextQuestionId(updatedAnswers);
    const nextStatus =
      nextId === null ? 'interview_completed' : 'interview_in_progress';

    return this.updateSessionAttributes(session, {
      answers: updatedAnswers,
      status: nextStatus,
      currentQuestionId: nextId,
    });
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: mapping interview answers into a project profile is intentionally centralized
  private buildProjectProfileAttributes(
    session: SessionWithAttrs
  ): ProjectProfileAttributes {
    const answers = session.attributes.answers;

    const projectName =
      (answers.project_name as string | undefined) ?? 'zopio-project';
    const description =
      (answers.project_description as string | undefined) ??
      'Zopio-based project';
    const targetUsers =
      (answers.target_users as string | undefined) ?? 'public_saas';

    const appsAnswer = answers.apps as string[] | undefined;
    const apps =
      appsAnswer && appsAnswer.length > 0 ? appsAnswer : ['app', 'api'];
    const appsValid = projectAppsSchema.parse(apps);

    const architecture =
      (answers.architecture as string | undefined) ?? 'multi_tenant';

    const primaryEntity =
      (answers.primary_entity as string | undefined) ?? 'workspace';
    const entityRelationships =
      (answers.entity_relationships as string | undefined) ?? '';

    const authRaw = (answers.auth as string | undefined) ?? 'basic';
    const authMode =
      authRaw === 'none' || authRaw === 'roles' ? authRaw : 'basic';

    const dbRaw = (answers.database_centrality as string | undefined) ?? 'core';
    const databaseCentrality = dbRaw === 'supporting' ? 'supporting' : 'core';

    const obsRaw =
      (answers.observability_level as string | undefined) ?? 'standard';
    const observabilityLevel =
      obsRaw === 'minimal' || obsRaw === 'extended' ? obsRaw : 'standard';

    const analyticsRaw =
      (answers.analytics_level as string | undefined) ?? 'basic';
    const analyticsLevel =
      analyticsRaw === 'none' || analyticsRaw === 'product'
        ? analyticsRaw
        : 'basic';

    const storageRaw = (answers.storage_needs as string | undefined) ?? 'basic';
    const storageLevel = storageRaw === 'none' ? 'none' : 'basic';

    const rateRaw = (answers.rate_limiting as string | undefined) ?? 'basic';
    const rateLimitingLevel = rateRaw === 'none' ? 'none' : 'basic';

    return {
      projectName,
      description,
      targetUsers,
      apps: appsValid,
      architecture:
        architecture === 'single_tenant' ? 'single_tenant' : 'multi_tenant',
      primaryEntity,
      entityRelationships,
      authMode,
      databaseCentrality,
      observabilityLevel,
      analyticsLevel,
      storageLevel,
      rateLimitingLevel,
    };
  }

  getProjectProfile(sessionId: string): ProjectProfileResource {
    const session = this.getSession(sessionId);
    const attrs = session.attributes;
    if (
      attrs.status === 'pending' ||
      attrs.status === 'interview_in_progress'
    ) {
      throw new Error(
        'Interview is not complete. Finish answering questions before generating a profile.'
      );
    }

    if (attrs.profileId) {
      return this.getProfile(attrs.profileId);
    }

    const profileId = randomUUID();
    const profileAttrs = this.buildProjectProfileAttributes(session);

    const profile: ProjectProfileResource = {
      id: profileId,
      type: 'project-profile',
      attributes: profileAttrs,
      relationships: {
        session: {
          data: {
            id: session.id,
            type: 'project-setup-session',
          },
        },
      },
    };

    this.server.registerResource(profile);
    this.updateSessionAttributes(session, {
      profileId: profileId,
    });

    return profile;
  }

  generateSetupPlan(sessionId: string): SetupPlanResource {
    const session = this.getSession(sessionId);
    const attrs = session.attributes;

    if (!attrs.profileId) {
      this.getProjectProfile(sessionId);
    }

    const sessionWithProfile = this.getSession(sessionId);
    const attrsWithProfile = sessionWithProfile.attributes;

    if (!attrsWithProfile.profileId) {
      throw new Error('Failed to generate project profile for session.');
    }

    const profile = this.getProfile(attrsWithProfile.profileId);
    const planId = attrsWithProfile.planId ?? randomUUID();

    const planAttrs: SetupPlanAttributes = generateSetupPlanAttributes({
      rootDir: this.rootDir,
      sessionId,
      profileId: profile.id,
      profile: profile.attributes,
    });

    const plan: SetupPlanResource = {
      id: planId,
      type: 'project-setup-plan',
      attributes: planAttrs,
      relationships: {
        session: {
          data: {
            id: session.id,
            type: 'project-setup-session',
          },
        },
        profile: {
          data: {
            id: profile.id,
            type: 'project-profile',
          },
        },
      },
    };

    this.server.registerResource(plan);
    this.updateSessionAttributes(sessionWithProfile, {
      planId: planId,
      status: 'plan_generated',
    });

    return plan;
  }

  private async ensureDir(path: string): Promise<void> {
    const dir = dirname(path);
    await fs.mkdir(dir, { recursive: true });
  }

  private async applyOverwrite(
    absolutePath: string,
    content: string
  ): Promise<AppliedFileChange> {
    await this.ensureDir(absolutePath);

    let existing: string | null = null;
    try {
      existing = await fs.readFile(absolutePath, 'utf8');
    } catch (error: unknown) {
      if (!isEnoentError(error)) {
        throw error;
      }
    }

    if (existing === null) {
      await fs.writeFile(absolutePath, content, 'utf8');
      return {
        path: absolutePath,
        changeType: 'created',
      };
    }

    if (existing === content) {
      return {
        path: absolutePath,
        changeType: 'unchanged',
      };
    }

    await fs.writeFile(absolutePath, content, 'utf8');
    return {
      path: absolutePath,
      changeType: 'updated',
    };
  }

  private mergeEnvContent(
    existingContent: string,
    envVars: EnvVarSpec[]
  ): { content: string; changed: boolean } {
    const lines = existingContent.split(NEWLINE_PATTERN);
    const present = new Set<string>();
    const varPattern = ENV_VAR_PATTERN;

    for (const line of lines) {
      if (line.trimStart().startsWith('#')) {
        continue;
      }
      const match = line.match(varPattern);
      if (match) {
        present.add(match[1]);
      }
    }

    let changed = false;
    for (const spec of envVars) {
      if (present.has(spec.name)) {
        continue;
      }
      const lastLine = lines.at(-1);
      if (!changed && lastLine && lastLine.trim() !== '') {
        lines.push('');
      }
      if (spec.comment && spec.comment.trim().length > 0) {
        lines.push(`# ${spec.comment.trim()}`);
      }
      const value = spec.value ?? '""';
      lines.push(`${spec.name}=${value}`);
      present.add(spec.name);
      changed = true;
    }

    const content = lines.join('\n');
    return { content, changed };
  }

  private async applyMergeEnv(
    absolutePath: string,
    envVars: EnvVarSpec[]
  ): Promise<AppliedFileChange> {
    await this.ensureDir(absolutePath);

    let existing: string | null = null;
    try {
      existing = await fs.readFile(absolutePath, 'utf8');
    } catch (error: unknown) {
      if (!isEnoentError(error)) {
        throw error;
      }
    }

    if (existing === null) {
      const header =
        '# Environment template generated by Zopio project setup MCP';
      const lines = [header, ''];
      for (const spec of envVars) {
        if (spec.comment && spec.comment.trim().length > 0) {
          lines.push(`# ${spec.comment.trim()}`);
        }
        const value = spec.value ?? '""';
        lines.push(`${spec.name}=${value}`);
      }
      const content = lines.join('\n');
      await fs.writeFile(absolutePath, content, 'utf8');
      return {
        path: absolutePath,
        changeType: 'created',
      };
    }

    const { content, changed } = this.mergeEnvContent(existing, envVars);
    if (!changed) {
      return {
        path: absolutePath,
        changeType: 'unchanged',
      };
    }

    await fs.writeFile(absolutePath, content, 'utf8');
    return {
      path: absolutePath,
      changeType: 'updated',
    };
  }

  private async applyCreateIfMissing(
    absolutePath: string,
    content: string
  ): Promise<AppliedFileChange> {
    try {
      await fs.access(absolutePath);
      return {
        path: absolutePath,
        changeType: 'skipped',
        notes: 'File already exists; leaving unchanged.',
      };
    } catch (error: unknown) {
      if (!isEnoentError(error)) {
        throw error;
      }
    }

    await this.ensureDir(absolutePath);
    await fs.writeFile(absolutePath, content, 'utf8');
    return {
      path: absolutePath,
      changeType: 'created',
    };
  }

  async applySetupPlan(planId: string): Promise<ChangesetResource> {
    const plan = this.getPlan(planId);
    const planAttrs = plan.attributes;
    const sessionId = planAttrs.sessionId;
    const session = this.getSession(sessionId);

    const applied: AppliedFileChange[] = [];

    for (const change of planAttrs.fileChanges) {
      const absolutePath = resolvePath(this.rootDir, change.path);

      if (change.operation === 'overwrite') {
        const content = change.content ?? '';
        const result = await this.applyOverwrite(absolutePath, content);
        applied.push({ ...result, path: change.path });
      } else if (change.operation === 'merge_env') {
        const envVars = (change.envVars ?? []).map((v: unknown) =>
          envVarSpecSchema.parse(v)
        );
        const result = await this.applyMergeEnv(absolutePath, envVars);
        applied.push({ ...result, path: change.path });
      } else if (change.operation === 'create_if_missing') {
        const content = change.content ?? '';
        const result = await this.applyCreateIfMissing(absolutePath, content);
        applied.push({ ...result, path: change.path });
      }
    }

    const created = applied.filter((c) => c.changeType === 'created').length;
    const updated = applied.filter((c) => c.changeType === 'updated').length;
    const unchanged = applied.filter(
      (c) => c.changeType === 'unchanged'
    ).length;
    const skipped = applied.filter((c) => c.changeType === 'skipped').length;

    const summary = `Applied setup plan '${plan.id}' touching ${applied.length} files (created: ${created}, updated: ${updated}, unchanged: ${unchanged}, skipped: ${skipped}).`;

    const changesetId = randomUUID();
    const changesetAttrs: ChangesetAttributes = {
      sessionId,
      planId: plan.id,
      summary,
      createdAt: this.nowISO(),
      fileChanges: applied,
    };

    const changeset: ChangesetResource = {
      id: changesetId,
      type: 'project-setup-changeset',
      attributes: changesetAttrs,
      relationships: {
        session: {
          data: {
            id: session.id,
            type: 'project-setup-session',
          },
        },
        plan: {
          data: {
            id: plan.id,
            type: 'project-setup-plan',
          },
        },
      },
    };

    this.server.registerResource(changeset);
    this.updateSessionAttributes(session, {
      status: 'applied',
    });

    return changeset;
  }
}
