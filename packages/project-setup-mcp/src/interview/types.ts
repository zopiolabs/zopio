/**
 * SPDX-License-Identifier: MIT
 */

import { z } from 'zod';

/**
 * Question input types
 */
export const QuestionType = {
  TEXT: 'text',
  SELECT: 'select',
  MULTI_SELECT: 'multi_select',
  CONFIRM: 'confirm',
} as const;

export type QuestionTypeValue =
  (typeof QuestionType)[keyof typeof QuestionType];

/**
 * Schema for question option (for select/multi_select)
 */
export const questionOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

export type QuestionOption = z.infer<typeof questionOptionSchema>;

/**
 * Schema for an interview question
 */
export const interviewQuestionSchema = z.object({
  id: z.string(),
  stepIndex: z.number().int().min(0),
  type: z.enum([
    QuestionType.TEXT,
    QuestionType.SELECT,
    QuestionType.MULTI_SELECT,
    QuestionType.CONFIRM,
  ]),
  prompt: z.string(),
  helpText: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(questionOptionSchema).optional(),
  defaultValue: z
    .union([z.string(), z.array(z.string()), z.boolean()])
    .optional(),
  required: z.boolean().default(true),
  validationPattern: z.string().optional(),
  validationMessage: z.string().optional(),
});

export type InterviewQuestion = z.infer<typeof interviewQuestionSchema>;

/**
 * Schema for an answer submission
 */
export const answerSubmissionSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]),
});

export type AnswerSubmission = z.infer<typeof answerSubmissionSchema>;

/**
 * Interview state
 */
export interface InterviewState {
  currentStepIndex: number;
  answers: Map<string, AnswerSubmission['value']>;
  isComplete: boolean;
}

/**
 * Result from processing an answer
 */
export interface AnswerResult {
  accepted: boolean;
  errorMessage?: string;
  nextQuestion?: InterviewQuestion;
  isComplete: boolean;
}
