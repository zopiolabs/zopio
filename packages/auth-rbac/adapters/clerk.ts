/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
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
  // This is necessary due to the version mismatch between Next.js 15.3.2 and 15.3.3
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
