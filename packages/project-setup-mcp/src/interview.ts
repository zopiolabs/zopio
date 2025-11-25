/**
 * SPDX-License-Identifier: MIT
 */

export type QuestionType = 'text' | 'single_choice' | 'multi_choice';

export interface QuestionOption {
  value: string;
  label: string;
  helpText?: string;
}

export interface InterviewQuestion {
  id: string;
  prompt: string;
  type: QuestionType;
  helpText?: string;
  placeholder?: string;
  options?: QuestionOption[];
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'project_name',
    prompt: 'What is your project named?',
    type: 'text',
    placeholder: 'acme-saas',
  },
  {
    id: 'project_description',
    prompt: 'Give a short description of the project.',
    type: 'text',
    placeholder: 'Multi-tenant SaaS for managing workspaces',
  },
  {
    id: 'target_users',
    prompt: 'Who are the primary target users?',
    type: 'single_choice',
    options: [
      { value: 'internal_tool', label: 'Internal tool' },
      { value: 'public_saas', label: 'Public SaaS' },
      { value: 'b2b_portal', label: 'B2B portal' },
      { value: 'consumer_app', label: 'Consumer-facing app' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'apps',
    prompt: 'Which Zopio apps are in scope for this project?',
    type: 'multi_choice',
    helpText: 'Select one or more apps to include in the initial setup.',
    options: [
      { value: 'app', label: 'apps/app (SaaS dashboard)' },
      { value: 'api', label: 'apps/api (backend API)' },
      { value: 'web', label: 'apps/web (marketing / frontend)' },
    ],
  },
  {
    id: 'architecture',
    prompt: 'Is the project single-tenant or multi-tenant?',
    type: 'single_choice',
    options: [
      { value: 'single_tenant', label: 'Single-tenant' },
      { value: 'multi_tenant', label: 'Multi-tenant (e.g. organizations)' },
    ],
  },
  {
    id: 'primary_entity',
    prompt:
      'What is the primary business entity or domain concept (e.g. workspace, organization, project, customer)?',
    type: 'text',
    placeholder: 'workspace',
  },
  {
    id: 'entity_relationships',
    prompt:
      'Describe any key relationships (e.g. each organization has many users, users can belong to multiple organizations).',
    type: 'text',
    placeholder: 'Each organization can have many members.',
  },
  {
    id: 'auth',
    prompt: 'What level of authentication do you need initially?',
    type: 'single_choice',
    options: [
      { value: 'none', label: 'None for now' },
      { value: 'basic', label: 'Basic sign-up / sign-in' },
      { value: 'roles', label: 'Auth with basic roles' },
    ],
  },
  {
    id: 'database_centrality',
    prompt: 'How central is the database to the product?',
    type: 'single_choice',
    options: [
      { value: 'core', label: 'Core to the product' },
      { value: 'supporting', label: 'Supporting but not central' },
    ],
  },
  {
    id: 'observability_level',
    prompt: 'What level of observability and logging do you need?',
    type: 'single_choice',
    options: [
      { value: 'minimal', label: 'Minimal (basic error tracking)' },
      { value: 'standard', label: 'Standard (errors + basic logs)' },
      {
        value: 'extended',
        label: 'Extended (more detailed observability from the start)',
      },
    ],
  },
  {
    id: 'analytics_level',
    prompt: 'What analytics do you want to start with?',
    type: 'single_choice',
    options: [
      { value: 'none', label: 'None for now' },
      { value: 'basic', label: 'Basic traffic tracking' },
      {
        value: 'product',
        label: 'Product usage analytics (events, funnels, etc.)',
      },
    ],
  },
  {
    id: 'storage_needs',
    prompt: 'Do you expect to need file or asset storage soon?',
    type: 'single_choice',
    options: [
      { value: 'none', label: 'No storage needs yet' },
      { value: 'basic', label: 'Basic uploads (e.g. avatars, assets)' },
    ],
  },
  {
    id: 'rate_limiting',
    prompt: 'Do you want basic API rate limiting configured?',
    type: 'single_choice',
    options: [
      { value: 'none', label: 'No rate limiting yet' },
      { value: 'basic', label: 'Basic protections for key routes' },
    ],
  },
];

export function getNextQuestionId(
  answers: Record<string, string | string[]>
): string | null {
  for (const q of INTERVIEW_QUESTIONS) {
    if (!(q.id in answers)) {
      return q.id;
    }
  }
  return null;
}

export function getQuestionById(id: string): InterviewQuestion | undefined {
  return INTERVIEW_QUESTIONS.find((q) => q.id === id);
}

export function normalizeAnswer(
  question: InterviewQuestion,
  answer: unknown
): string | string[] {
  if (question.type === 'text') {
    if (typeof answer !== 'string') {
      throw new Error('Answer must be a string.');
    }
    const value = answer.trim();
    if (!value) {
      throw new Error('Answer cannot be empty.');
    }
    return value;
  }

  if (question.type === 'single_choice') {
    if (typeof answer !== 'string') {
      throw new Error('Answer must be a string.');
    }
    const value = answer.trim();
    const valid = question.options?.some((o) => o.value === value);
    if (!valid) {
      throw new Error('Answer must be one of the provided options.');
    }
    return value;
  }

  // multi_choice
  if (!Array.isArray(answer)) {
    throw new Error('Answer must be an array.');
  }
  const options = new Set(question.options?.map((o) => o.value) ?? []);
  const values = Array.from(
    new Set(
      answer
        .filter((v: unknown): v is string => typeof v === 'string')
        .map((v) => v.trim())
        .filter((v) => v.length > 0 && options.has(v))
    )
  );
  if (values.length === 0) {
    throw new Error('At least one option must be selected.');
  }
  return values;
}
