/**
 * SPDX-License-Identifier: MIT
 */

import { getAuth } from '@repo/auth/server';
import type { NextRequest } from 'next/server';
import type { UserContext } from '../types';

// Define the expected structure of auth.sessionClaims
interface SessionClaims {
  metadata?: {
    role?: string;
  };
}

// Define the expected structure of auth
interface Auth {
  userId?: string;
  orgId?: string;
  sessionClaims?: SessionClaims;
}

export async function getUserContext(req: NextRequest): Promise<UserContext> {
  // Use a direct type assertion to bypass the type checking
  // where the NextRequest type definition has changed
  const auth = (await getAuth(
    req as unknown as Parameters<typeof getAuth>[0]
  )) as Auth;

  if (!auth.userId || !auth.orgId || !auth.sessionClaims?.metadata?.role) {
    throw new Error('Unauthorized or incomplete session');
  }

  return {
    userId: auth.userId,
    role: auth.sessionClaims.metadata.role,
    tenantId: auth.orgId,
  };
}
