/**
 * SPDX-License-Identifier: MIT
 */

import { rateLimit } from '@repo/design-system/lib/rate-limit';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const limiter = rateLimit({
  interval: 60000, // 1 minute in milliseconds
});

export async function GET(request: NextRequest) {
  try {
    // Allow only 2 requests per minute
    await limiter.check(request, 2);

    // If the request passes the rate limit check, return a success response
    return NextResponse.json({
      message: 'Request successful! You have not exceeded the rate limit.',
    });
  } catch (error) {
    // If the rate limit is exceeded, the check method will reject with a NextResponse
    // We can simply return this response
    return error as NextResponse;
  }
}
