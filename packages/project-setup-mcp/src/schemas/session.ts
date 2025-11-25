/**
 * SPDX-License-Identifier: MIT
 */

import { z } from 'zod';

/**
 * Session status enum
 */
export const SessionStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  INTERVIEW_COMPLETE: 'interview_complete',
  PLAN_GENERATED: 'plan_generated',
  APPLYING: 'applying',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type SessionStatusType =
  (typeof SessionStatus)[keyof typeof SessionStatus];

/**
 * Schema for setup session resource
 */
export const setupSessionSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('setup_session'),
  status: z.enum([
    SessionStatus.PENDING,
    SessionStatus.IN_PROGRESS,
    SessionStatus.INTERVIEW_COMPLETE,
    SessionStatus.PLAN_GENERATED,
    SessionStatus.APPLYING,
    SessionStatus.COMPLETED,
    SessionStatus.FAILED,
  ]),
  currentStep: z.number().int().min(0),
  totalSteps: z.number().int().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  error: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SetupSession = z.infer<typeof setupSessionSchema>;

/**
 * Creates a new setup session
 */
export function createSetupSession(
  id: string,
  totalSteps: number
): SetupSession {
  const now = new Date().toISOString();
  return {
    id,
    type: 'setup_session',
    status: SessionStatus.PENDING,
    currentStep: 0,
    totalSteps,
    createdAt: now,
    updatedAt: now,
  };
}
