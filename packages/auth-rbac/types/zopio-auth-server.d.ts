/**
 * SPDX-License-Identifier: MIT
 */

declare module '@zopio/auth/server' {
  import type { NextRequest } from 'next/server';

  export interface AuthSession {
    userId: string;
    orgId: string;
    sessionClaims?: {
      metadata?: {
        role?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  export function getAuth(req: NextRequest): AuthSession;
}
