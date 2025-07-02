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
import { apiKeyAuthMiddleware } from '@repo/auth/api-key-auth-middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const validatedReq = await apiKeyAuthMiddleware(req);
  if (validatedReq instanceof Response) {
    return validatedReq;
  }

  const userId =
    (validatedReq as { user?: { id: string } }).user?.id || 'unknown';

  return NextResponse.json({
    message: 'Private API key-protected endpoint',
    user: userId,
    timestamp: new Date().toISOString(),
  });
}
