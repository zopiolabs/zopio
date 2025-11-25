/**
 * SPDX-License-Identifier: MIT
 */

import { randomUUID } from 'node:crypto';
import {
  type ApplyOptions,
  applySetupPlan,
  getChangesetSummary,
} from '../applicator/index.js';
import { generateSetupPlan, getPlanSummary } from '../generator/index.js';
import { InterviewStateMachine, getTotalSteps } from '../interview/index.js';
import type {
  AnswerSubmission,
  InterviewQuestion,
} from '../interview/types.js';
import type { AppliedChangeset } from '../schemas/changeset.js';
import type { SetupPlan } from '../schemas/plan.js';
import type { ProjectProfile } from '../schemas/profile.js';
import type { SetupSession } from '../schemas/session.js';
import { SessionStatus, createSetupSession } from '../schemas/session.js';

/**
 * Session data stored in memory
 */
interface SessionData {
  session: SetupSession;
  interview: InterviewStateMachine;
  profile?: ProjectProfile;
  plan?: SetupPlan;
  changeset?: AppliedChangeset;
}

/**
 * Result of starting a new session
 */
export interface StartSessionResult {
  session: SetupSession;
  firstQuestion: InterviewQuestion;
}

/**
 * Result of submitting an answer
 */
export interface SubmitAnswerResult {
  accepted: boolean;
  errorMessage?: string;
  session: SetupSession;
  nextQuestion?: InterviewQuestion;
  isInterviewComplete: boolean;
}

/**
 * Result of generating a plan
 */
export interface GeneratePlanResult {
  session: SetupSession;
  profile: ProjectProfile;
  plan: SetupPlan;
  summary: string;
}

/**
 * Result of applying a plan
 */
export interface ApplyPlanResult {
  session: SetupSession;
  changeset: AppliedChangeset;
  summary: string;
}

/**
 * Project Setup MCP Server
 *
 * Manages setup sessions and orchestrates the interview, plan generation,
 * and plan application workflow.
 */
export class ProjectSetupMCPServer {
  private sessions: Map<string, SessionData> = new Map();

  /**
   * Start a new setup session
   */
  startSession(): StartSessionResult {
    const sessionId = randomUUID();
    const profileId = randomUUID();
    const totalSteps = getTotalSteps();

    const session = createSetupSession(sessionId, totalSteps);
    session.status = SessionStatus.IN_PROGRESS;

    const interview = new InterviewStateMachine(profileId, sessionId);
    const firstQuestion = interview.getCurrentQuestion();

    if (!firstQuestion) {
      throw new Error('Failed to get first interview question');
    }

    this.sessions.set(sessionId, {
      session,
      interview,
    });

    return {
      session: { ...session },
      firstQuestion,
    };
  }

  /**
   * Get a session by ID
   */
  getSession(sessionId: string): SetupSession | null {
    const data = this.sessions.get(sessionId);
    return data ? { ...data.session } : null;
  }

  /**
   * Get the current question for a session
   */
  getCurrentQuestion(sessionId: string): InterviewQuestion | null {
    const data = this.sessions.get(sessionId);
    if (!data) {
      return null;
    }
    return data.interview.getCurrentQuestion() || null;
  }

  /**
   * Submit an answer to the current question
   */
  submitAnswer(
    sessionId: string,
    answer: AnswerSubmission
  ): SubmitAnswerResult {
    const data = this.sessions.get(sessionId);

    if (!data) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    if (data.session.status !== SessionStatus.IN_PROGRESS) {
      throw new Error(`Session is not in progress: ${data.session.status}`);
    }

    const result = data.interview.submitAnswer(answer);

    // Update session state
    data.session.currentStep = data.interview.getCurrentStepIndex();
    data.session.updatedAt = new Date().toISOString();

    if (result.isComplete) {
      data.session.status = SessionStatus.INTERVIEW_COMPLETE;
    }

    return {
      accepted: result.accepted,
      errorMessage: result.errorMessage,
      session: { ...data.session },
      nextQuestion: result.nextQuestion,
      isInterviewComplete: result.isComplete,
    };
  }

  /**
   * Generate a setup plan from the completed interview
   */
  generatePlan(sessionId: string): GeneratePlanResult {
    const data = this.sessions.get(sessionId);

    if (!data) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    if (data.session.status !== SessionStatus.INTERVIEW_COMPLETE) {
      throw new Error(
        `Cannot generate plan: interview not complete (status: ${data.session.status})`
      );
    }

    // Build profile from interview answers
    const profile = data.interview.buildProfile();
    data.profile = profile;

    // Generate plan
    const planId = randomUUID();
    const plan = generateSetupPlan(planId, sessionId, profile);
    data.plan = plan;

    // Update session status
    data.session.status = SessionStatus.PLAN_GENERATED;
    data.session.updatedAt = new Date().toISOString();

    return {
      session: { ...data.session },
      profile,
      plan,
      summary: getPlanSummary(plan),
    };
  }

  /**
   * Apply the generated plan
   */
  applyPlan(sessionId: string, options: ApplyOptions): ApplyPlanResult {
    const data = this.sessions.get(sessionId);

    if (!data) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    if (data.session.status !== SessionStatus.PLAN_GENERATED) {
      throw new Error(
        `Cannot apply plan: plan not generated (status: ${data.session.status})`
      );
    }

    if (!data.plan) {
      throw new Error('No plan available to apply');
    }

    // Update status to applying
    data.session.status = SessionStatus.APPLYING;
    data.session.updatedAt = new Date().toISOString();

    try {
      // Apply the plan
      const changesetId = randomUUID();
      const changeset = applySetupPlan(changesetId, data.plan, options);
      data.changeset = changeset;

      // Update session to completed
      data.session.status = SessionStatus.COMPLETED;
      data.session.completedAt = new Date().toISOString();
      data.session.updatedAt = data.session.completedAt;

      // Mark plan as applied
      data.plan.isApplied = true;

      return {
        session: { ...data.session },
        changeset,
        summary: getChangesetSummary(changeset),
      };
    } catch (error) {
      // Mark session as failed
      data.session.status = SessionStatus.FAILED;
      data.session.error =
        error instanceof Error ? error.message : String(error);
      data.session.updatedAt = new Date().toISOString();

      throw error;
    }
  }

  /**
   * Get the profile for a session
   */
  getProfile(sessionId: string): ProjectProfile | null {
    const data = this.sessions.get(sessionId);
    return data?.profile || null;
  }

  /**
   * Get the plan for a session
   */
  getPlan(sessionId: string): SetupPlan | null {
    const data = this.sessions.get(sessionId);
    return data?.plan || null;
  }

  /**
   * Get the changeset for a session
   */
  getChangeset(sessionId: string): AppliedChangeset | null {
    const data = this.sessions.get(sessionId);
    return data?.changeset || null;
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * List all active sessions
   */
  listSessions(): SetupSession[] {
    return Array.from(this.sessions.values()).map((data) => ({
      ...data.session,
    }));
  }

  /**
   * Run a complete setup flow with predefined answers (for testing)
   */
  runWithAnswers(
    answers: Record<string, AnswerSubmission['value']>,
    options: ApplyOptions
  ): {
    session: SetupSession;
    profile: ProjectProfile;
    plan: SetupPlan;
    changeset: AppliedChangeset;
  } {
    // Start session
    const { session, firstQuestion } = this.startSession();
    let currentQuestion: InterviewQuestion | undefined = firstQuestion;

    // Submit all answers
    while (currentQuestion) {
      const answer = answers[currentQuestion.id];
      let valueToSubmit: AnswerSubmission['value'];

      if (answer !== undefined) {
        // Use provided answer
        valueToSubmit = answer;
      } else if (currentQuestion.defaultValue !== undefined) {
        // Use default value if no answer provided
        valueToSubmit = currentQuestion.defaultValue;
      } else if (currentQuestion.required) {
        throw new Error(
          `No answer provided for required question: ${currentQuestion.id}`
        );
      } else {
        // For optional questions without default, use empty value based on type
        valueToSubmit = currentQuestion.type === 'multi_select' ? [] : '';
      }

      const result = this.submitAnswer(session.id, {
        questionId: currentQuestion.id,
        value: valueToSubmit,
      });
      currentQuestion = result.nextQuestion;
    }

    // Generate and apply plan
    const planResult = this.generatePlan(session.id);
    const applyResult = this.applyPlan(session.id, options);

    return {
      session: applyResult.session,
      profile: planResult.profile,
      plan: planResult.plan,
      changeset: applyResult.changeset,
    };
  }
}

/**
 * Create a new Project Setup MCP Server instance
 */
export function createProjectSetupServer(): ProjectSetupMCPServer {
  return new ProjectSetupMCPServer();
}
