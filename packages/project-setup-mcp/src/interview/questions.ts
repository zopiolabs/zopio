/**
 * SPDX-License-Identifier: MIT
 */

import { TargetUserType, TenancyModel } from '../schemas/profile.js';
import type { InterviewQuestion } from './types.js';
import { QuestionType } from './types.js';

/**
 * Define all interview questions in order
 */
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // Step 0: Project Name
  {
    id: 'project_name',
    stepIndex: 0,
    type: QuestionType.TEXT,
    prompt: 'What is your project name?',
    helpText:
      'A short, descriptive name for your project (e.g., "acme-platform")',
    placeholder: 'my-project',
    required: true,
    validationPattern: '^[a-z][a-z0-9-]*[a-z0-9]$',
    validationMessage:
      'Project name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens',
  },

  // Step 1: Project Description
  {
    id: 'project_description',
    stepIndex: 1,
    type: QuestionType.TEXT,
    prompt: 'Briefly describe your project (optional)',
    helpText: 'A short description of what your project does',
    placeholder: 'A platform for managing...',
    required: false,
  },

  // Step 2: Target Users
  {
    id: 'target_users',
    stepIndex: 2,
    type: QuestionType.SELECT,
    prompt: 'Who are the target users for this project?',
    helpText: 'This helps determine the appropriate configuration and features',
    options: [
      {
        value: TargetUserType.INTERNAL_TOOL,
        label: 'Internal Tool',
        description: 'Used by your team or organization internally',
      },
      {
        value: TargetUserType.PUBLIC_SAAS,
        label: 'Public SaaS',
        description: 'A software-as-a-service product for external customers',
      },
      {
        value: TargetUserType.B2B_PORTAL,
        label: 'B2B Portal',
        description: 'A business-to-business application or portal',
      },
      {
        value: TargetUserType.OTHER,
        label: 'Other',
        description: 'Something else',
      },
    ],
    defaultValue: TargetUserType.PUBLIC_SAAS,
    required: true,
  },

  // Step 3: App Selection
  {
    id: 'selected_apps',
    stepIndex: 3,
    type: QuestionType.MULTI_SELECT,
    prompt: 'Which Zopio apps should be included in your project?',
    helpText:
      'Select the apps you want to configure. You can always add more later.',
    options: [
      {
        value: 'app',
        label: 'Main App (apps/app)',
        description: 'SaaS dashboard application',
      },
      {
        value: 'api',
        label: 'API (apps/api)',
        description: 'Backend API service',
      },
      {
        value: 'web',
        label: 'Marketing Site (apps/web)',
        description: 'Public marketing website',
      },
      {
        value: 'docs',
        label: 'Documentation (apps/docs)',
        description: 'Documentation site',
      },
    ],
    defaultValue: ['app', 'api'],
    required: true,
  },

  // Step 4: Tenancy Model
  {
    id: 'tenancy_model',
    stepIndex: 4,
    type: QuestionType.SELECT,
    prompt: 'What tenancy model does your project need?',
    helpText: 'This affects the database schema and data isolation approach',
    options: [
      {
        value: TenancyModel.MULTI_TENANT,
        label: 'Multi-Tenant',
        description:
          'Multiple organizations share the same infrastructure with data isolation',
      },
      {
        value: TenancyModel.SINGLE_TENANT,
        label: 'Single-Tenant',
        description: 'Single organization or simpler user model',
      },
    ],
    defaultValue: TenancyModel.MULTI_TENANT,
    required: true,
  },

  // Step 5: Primary Entity Name
  {
    id: 'primary_entity',
    stepIndex: 5,
    type: QuestionType.TEXT,
    prompt: 'What is the name of your primary business entity?',
    helpText:
      'The main entity that groups users (e.g., "organization", "workspace", "team", "company")',
    placeholder: 'organization',
    defaultValue: 'organization',
    required: true,
    validationPattern: '^[a-z][a-z0-9_]*$',
    validationMessage:
      'Entity name must be lowercase, start with a letter, and contain only letters, numbers, and underscores',
  },

  // Step 6: Authentication Setup
  {
    id: 'auth_enabled',
    stepIndex: 6,
    type: QuestionType.CONFIRM,
    prompt: 'Enable authentication (Clerk)?',
    helpText: 'Set up user authentication with Clerk',
    defaultValue: true,
    required: true,
  },

  // Step 7: Role-based Access
  {
    id: 'auth_roles',
    stepIndex: 7,
    type: QuestionType.CONFIRM,
    prompt: 'Do you need role-based access control?',
    helpText: 'Enables user roles within organizations (e.g., admin, member)',
    defaultValue: false,
    required: true,
  },

  // Step 8: Observability
  {
    id: 'observability_enabled',
    stepIndex: 8,
    type: QuestionType.CONFIRM,
    prompt: 'Enable observability (Sentry/Logtail)?',
    helpText: 'Set up error tracking and logging',
    defaultValue: true,
    required: true,
  },

  // Step 9: Analytics Selection
  {
    id: 'analytics_providers',
    stepIndex: 9,
    type: QuestionType.MULTI_SELECT,
    prompt: 'Which analytics providers do you want to enable?',
    helpText:
      'Select the analytics tools to integrate. Leave empty to skip analytics.',
    options: [
      {
        value: 'posthog',
        label: 'PostHog',
        description: 'Product analytics and feature flags',
      },
      {
        value: 'google_analytics',
        label: 'Google Analytics',
        description: 'Web traffic analytics',
      },
      {
        value: 'vercel_analytics',
        label: 'Vercel Analytics',
        description: 'Web vitals and performance',
      },
    ],
    defaultValue: [],
    required: false,
  },

  // Step 10: Storage
  {
    id: 'storage_enabled',
    stepIndex: 10,
    type: QuestionType.CONFIRM,
    prompt: 'Enable file storage (Vercel Blob)?',
    helpText: 'Set up file upload and storage capabilities',
    defaultValue: false,
    required: true,
  },

  // Step 11: Rate Limiting
  {
    id: 'rate_limit_enabled',
    stepIndex: 11,
    type: QuestionType.CONFIRM,
    prompt: 'Enable rate limiting (Upstash Redis)?',
    helpText: 'Add API rate limiting for protection',
    defaultValue: false,
    required: true,
  },
];

/**
 * Get total number of interview steps
 */
export function getTotalSteps(): number {
  return INTERVIEW_QUESTIONS.length;
}

/**
 * Get question by step index
 */
export function getQuestionByStep(
  stepIndex: number
): InterviewQuestion | undefined {
  return INTERVIEW_QUESTIONS.find((q) => q.stepIndex === stepIndex);
}

/**
 * Get question by ID
 */
export function getQuestionById(id: string): InterviewQuestion | undefined {
  return INTERVIEW_QUESTIONS.find((q) => q.id === id);
}
