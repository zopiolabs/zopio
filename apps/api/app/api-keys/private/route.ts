/**
 * SPDX-License-Identifier: MIT
 */

import { clerkAuthMiddleware } from '@repo/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const validatedReq = await clerkAuthMiddleware(req);
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
