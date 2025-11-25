/**
 * SPDX-License-Identifier: MIT
 */

import type {
  Architecture,
  CrossCuttingConcerns,
  ProjectMetadata,
  ProjectProfile,
  SelectedApps,
} from '../schemas/profile.js';
import {
  TargetUserType,
  TenancyModel,
  createDefaultProfile,
} from '../schemas/profile.js';
import { getQuestionByStep, getTotalSteps } from './questions.js';
import type {
  AnswerResult,
  AnswerSubmission,
  InterviewQuestion,
  InterviewState,
} from './types.js';
import { QuestionType } from './types.js';

/**
 * Interview state machine manages the interview flow and answer collection
 */
export class InterviewStateMachine {
  private state: InterviewState;
  private profileId: string;
  private sessionId: string;

  constructor(profileId: string, sessionId: string) {
    this.profileId = profileId;
    this.sessionId = sessionId;
    this.state = {
      currentStepIndex: 0,
      answers: new Map(),
      isComplete: false,
    };
  }

  /**
   * Get the current question
   */
  getCurrentQuestion(): InterviewQuestion | undefined {
    if (this.state.isComplete) {
      return undefined;
    }
    return getQuestionByStep(this.state.currentStepIndex);
  }

  /**
   * Get current step index
   */
  getCurrentStepIndex(): number {
    return this.state.currentStepIndex;
  }

  /**
   * Get total steps
   */
  getTotalSteps(): number {
    return getTotalSteps();
  }

  /**
   * Check if interview is complete
   */
  isComplete(): boolean {
    return this.state.isComplete;
  }

  /**
   * Get all collected answers
   */
  getAnswers(): Map<string, AnswerSubmission['value']> {
    return new Map(this.state.answers);
  }

  /**
   * Check if a required field has a valid value
   */
  private checkRequired(value: AnswerSubmission['value']): string | null {
    if (value === undefined || value === null) {
      return 'This field is required';
    }
    if (typeof value === 'string' && value.trim() === '') {
      return 'This field is required';
    }
    if (Array.isArray(value) && value.length === 0) {
      return 'Please select at least one option';
    }
    return null;
  }

  /**
   * Validate text input
   */
  private validateText(
    value: AnswerSubmission['value'],
    pattern?: string,
    message?: string
  ): string | null {
    if (typeof value !== 'string') {
      return 'Expected text input';
    }
    if (pattern && value) {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        return message || 'Invalid format';
      }
    }
    return null;
  }

  /**
   * Validate select input
   */
  private validateSelect(
    value: AnswerSubmission['value'],
    options?: { value: string }[]
  ): string | null {
    if (typeof value !== 'string') {
      return 'Expected single selection';
    }
    if (options && !options.some((o) => o.value === value)) {
      return 'Invalid selection';
    }
    return null;
  }

  /**
   * Validate multi-select input
   */
  private validateMultiSelect(
    value: AnswerSubmission['value'],
    options?: { value: string }[]
  ): string | null {
    if (!Array.isArray(value)) {
      return 'Expected multiple selections';
    }
    if (options) {
      const validValues = options.map((o) => o.value);
      for (const v of value) {
        if (!validValues.includes(v)) {
          return `Invalid selection: ${v}`;
        }
      }
    }
    return null;
  }

  /**
   * Validate an answer
   */
  private validateAnswer(
    question: InterviewQuestion,
    value: AnswerSubmission['value']
  ): { valid: boolean; error?: string } {
    // Check required
    if (question.required) {
      const requiredError = this.checkRequired(value);
      if (requiredError) {
        return { valid: false, error: requiredError };
      }
    }

    // Type-specific validation
    let error: string | null = null;

    switch (question.type) {
      case QuestionType.TEXT:
        error = this.validateText(
          value,
          question.validationPattern,
          question.validationMessage
        );
        break;
      case QuestionType.SELECT:
        error = this.validateSelect(value, question.options);
        break;
      case QuestionType.MULTI_SELECT:
        error = this.validateMultiSelect(value, question.options);
        break;
      case QuestionType.CONFIRM:
        error = typeof value !== 'boolean' ? 'Expected yes/no answer' : null;
        break;
      default:
        break;
    }

    if (error) {
      return { valid: false, error };
    }

    return { valid: true };
  }

  /**
   * Submit an answer and advance to the next question
   */
  submitAnswer(answer: AnswerSubmission): AnswerResult {
    const currentQuestion = this.getCurrentQuestion();

    if (!currentQuestion) {
      return {
        accepted: false,
        errorMessage: 'Interview is already complete',
        isComplete: true,
      };
    }

    if (answer.questionId !== currentQuestion.id) {
      return {
        accepted: false,
        errorMessage: `Expected answer for question '${currentQuestion.id}', got '${answer.questionId}'`,
        isComplete: false,
        nextQuestion: currentQuestion,
      };
    }

    // Validate answer
    const validation = this.validateAnswer(currentQuestion, answer.value);
    if (!validation.valid) {
      return {
        accepted: false,
        errorMessage: validation.error,
        isComplete: false,
        nextQuestion: currentQuestion,
      };
    }

    // Store answer
    this.state.answers.set(answer.questionId, answer.value);

    // Move to next step
    this.state.currentStepIndex++;

    // Check if complete
    if (this.state.currentStepIndex >= getTotalSteps()) {
      this.state.isComplete = true;
      return {
        accepted: true,
        isComplete: true,
      };
    }

    // Get next question
    const nextQuestion = this.getCurrentQuestion();
    return {
      accepted: true,
      isComplete: false,
      nextQuestion,
    };
  }

  /**
   * Build a project profile from collected answers
   */
  buildProfile(): ProjectProfile {
    const baseProfile = createDefaultProfile(this.profileId, this.sessionId);
    const answers = this.state.answers;

    // Build metadata
    const metadata: ProjectMetadata = {
      name: (answers.get('project_name') as string) || 'my-project',
      description: (answers.get('project_description') as string) || undefined,
      targetUsers:
        (answers.get('target_users') as ProjectMetadata['targetUsers']) ||
        TargetUserType.PUBLIC_SAAS,
    };

    // Build selected apps
    const selectedAppsList = (answers.get('selected_apps') as string[]) || [
      'app',
      'api',
    ];
    const selectedApps: SelectedApps = {
      app: selectedAppsList.includes('app'),
      api: selectedAppsList.includes('api'),
      web: selectedAppsList.includes('web'),
      docs: selectedAppsList.includes('docs'),
    };

    // Build architecture
    const architecture: Architecture = {
      tenancyModel:
        (answers.get('tenancy_model') as Architecture['tenancyModel']) ||
        TenancyModel.MULTI_TENANT,
      primaryEntity:
        (answers.get('primary_entity') as string) || 'organization',
      entityRelationships: [],
    };

    // Build cross-cutting concerns
    const analyticsProviders =
      (answers.get('analytics_providers') as string[]) || [];
    const crossCuttingConcerns: CrossCuttingConcerns = {
      auth: {
        enabled: (answers.get('auth_enabled') as boolean) ?? true,
        provider: 'clerk',
        requiresRoles: (answers.get('auth_roles') as boolean) ?? false,
      },
      database: {
        enabled: true,
        provider: 'neon',
      },
      observability: {
        enabled: (answers.get('observability_enabled') as boolean) ?? true,
        errorTracking: true,
        logging: true,
      },
      analytics: {
        enabled: analyticsProviders.length > 0,
        posthog: analyticsProviders.includes('posthog'),
        googleAnalytics: analyticsProviders.includes('google_analytics'),
        vercelAnalytics: analyticsProviders.includes('vercel_analytics'),
      },
      storage: {
        enabled: (answers.get('storage_enabled') as boolean) ?? false,
        provider: 'vercel_blob',
      },
      rateLimit: {
        enabled: (answers.get('rate_limit_enabled') as boolean) ?? false,
        provider: 'upstash',
      },
    };

    const now = new Date().toISOString();

    return {
      ...baseProfile,
      metadata,
      selectedApps,
      architecture,
      crossCuttingConcerns,
      updatedAt: now,
    };
  }

  /**
   * Serialize state for persistence
   */
  serializeState(): {
    currentStepIndex: number;
    answers: Record<string, AnswerSubmission['value']>;
    isComplete: boolean;
  } {
    return {
      currentStepIndex: this.state.currentStepIndex,
      answers: Object.fromEntries(this.state.answers),
      isComplete: this.state.isComplete,
    };
  }

  /**
   * Restore state from serialized form
   */
  restoreState(serialized: {
    currentStepIndex: number;
    answers: Record<string, AnswerSubmission['value']>;
    isComplete: boolean;
  }): void {
    this.state = {
      currentStepIndex: serialized.currentStepIndex,
      answers: new Map(Object.entries(serialized.answers)),
      isComplete: serialized.isComplete,
    };
  }
}
