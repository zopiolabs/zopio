/**
 * SPDX-License-Identifier: MIT
 */

import type { ProjectProfile, Question, SetupSession } from './types.js';

export class SessionManager {
  private session: SetupSession;

  private static questions: Question[] = [
    {
      id: 'project_name',
      type: 'text',
      text: 'What is the name of your new project?',
      required: true,
    },
    {
      id: 'project_description',
      type: 'text',
      text: 'Describe your project in a few words:',
      required: false,
    },
    {
      id: 'target_users',
      type: 'select',
      text: 'Who are the target users?',
      options: [
        { label: 'Internal Team (Tooling)', value: 'internal' },
        { label: 'Public SaaS (B2C/Prosumer)', value: 'public_saas' },
        { label: 'B2B Enterprise', value: 'b2b_portal' },
      ],
      required: true,
    },
    {
      id: 'selected_apps',
      type: 'multi_select',
      text: 'Which apps should be included?',
      options: [
        { label: 'Main App (Dashboard/SaaS)', value: 'app' },
        { label: 'API Server', value: 'api' },
        { label: 'Marketing Website', value: 'web' },
      ],
      required: true,
    },
    {
      id: 'architecture_type',
      type: 'select',
      text: 'Is this a single-tenant or multi-tenant application?',
      options: [
        { label: 'Single Tenant (Simple)', value: 'single_tenant' },
        {
          label: 'Multi Tenant (Organizations/Workspaces)',
          value: 'multi_tenant',
        },
      ],
      required: true,
    },
    {
      id: 'domain_entity',
      type: 'text',
      text: 'What is the primary grouping entity? (e.g. Workspace, Team, Organization)',
      required: true,
    },
    {
      id: 'confirm_features',
      type: 'multi_select',
      text: 'Which features do you need stubbed out?',
      options: [
        { label: 'Authentication (Clerk)', value: 'auth' },
        { label: 'Database (Prisma + Neon)', value: 'database' },
        { label: 'Observability (Sentry)', value: 'observability' },
        { label: 'Analytics (PostHog)', value: 'analytics' },
        { label: 'File Storage (Vercel Blob)', value: 'storage' },
        { label: 'Rate Limiting (Upstash)', value: 'rateLimit' },
      ],
      required: false,
    },
  ];

  constructor() {
    this.session = {
      id: crypto.randomUUID(),
      status: 'pending',
      currentStepId: SessionManager.questions[0].id,
      answers: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  getSession(): SetupSession {
    return this.session;
  }

  getNextQuestion(): Question | null {
    if (this.session.status === 'completed') {
      return null;
    }
    const q = SessionManager.questions.find(
      (q) => q.id === this.session.currentStepId
    );
    return q || null;
  }

  submitAnswer(answer: unknown): void {
    if (!this.session.currentStepId) {
      return;
    }

    this.session.answers[this.session.currentStepId] = answer;
    this.session.updatedAt = new Date().toISOString();

    // Move to next step
    const currentIndex = SessionManager.questions.findIndex(
      (q) => q.id === this.session.currentStepId
    );
    if (currentIndex < SessionManager.questions.length - 1) {
      this.session.currentStepId =
        SessionManager.questions[currentIndex + 1].id;
      this.session.status = 'in_progress';
    } else {
      this.session.currentStepId = null;
      this.session.status = 'completed';
    }
  }

  generateProfile(): ProjectProfile {
    if (this.session.status !== 'completed') {
      throw new Error('Session not complete');
    }
    const a = this.session.answers;
    // Helper to safely check array inclusion
    const hasFeature = (feat: string) => {
      if (!Array.isArray(a.confirm_features)) {
        return true;
      } // Default to all true if something weird happens, or check requirements. Assuming selection means opt-in. Actually let's assume default true if null, or user selected.
      // Actually better to trust the input.
      return a.confirm_features.includes(feat);
    };

    return {
      name: a.project_name as string,
      description: a.project_description as string,
      targetUsers: a.target_users as ProjectProfile['targetUsers'],
      apps: a.selected_apps as string[],
      architecture: {
        type: a.architecture_type as ProjectProfile['architecture']['type'],
        domainEntity: a.domain_entity as string,
      },
      features: {
        auth: hasFeature('auth'),
        database: hasFeature('database'),
        observability: hasFeature('observability'),
        analytics: hasFeature('analytics'),
        storage: hasFeature('storage'),
        rateLimit: hasFeature('rateLimit'),
      },
    };
  }
}
