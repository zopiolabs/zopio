/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Project Setup MCP for Zopio
 *
 * This package provides an MCP server for interactive project setup
 * and bootstrapping of new Zopio-based projects in the monorepo.
 */

// Core server
export {
  ProjectSetupMCPServer,
  createProjectSetupServer,
  type StartSessionResult,
  type SubmitAnswerResult,
  type GeneratePlanResult,
  type ApplyPlanResult,
} from './server/index.js';

// Schemas
export {
  // Session
  type SetupSession,
  SessionStatus,
  createSetupSession,
  setupSessionSchema,
  // Profile
  type ProjectProfile,
  type ProjectMetadata,
  type SelectedApps,
  type Architecture,
  type CrossCuttingConcerns,
  TargetUserType,
  TenancyModel,
  createDefaultProfile,
  projectProfileSchema,
  // Plan
  type SetupPlan,
  type PlannedChange,
  ChangeType,
  ChangeCategory,
  createSetupPlan,
  setupPlanSchema,
  // Changeset
  type AppliedChangeset,
  type AppliedChange,
  ApplyResult,
  createAppliedChangeset,
  appliedChangesetSchema,
} from './schemas/index.js';

// Interview
export {
  type InterviewQuestion,
  type AnswerSubmission,
  type AnswerResult,
  type QuestionOption,
  type InterviewState,
  QuestionType,
  InterviewStateMachine,
  INTERVIEW_QUESTIONS,
  getTotalSteps,
  getQuestionByStep,
  getQuestionById,
  // Schemas for custom validation
  interviewQuestionSchema,
  answerSubmissionSchema,
} from './interview/index.js';

// Generator
export { generateSetupPlan, getPlanSummary } from './generator/index.js';

// Applicator
export {
  applySetupPlan,
  getChangesetSummary,
  type ApplyOptions,
} from './applicator/index.js';

// Templates
export {
  generatePrismaSchema,
  describePrismaSchema,
  generateEnvTemplate,
  getRequiredEnvVars,
  generateRateLimitMiddleware,
  generateStorageUtil,
  generateAnalyticsProvider,
  generateInstrumentation,
  generateDatabaseSeed,
  generateSetupSummaryDoc,
} from './templates/index.js';
