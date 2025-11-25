/**
 * SPDX-License-Identifier: MIT
 */

import { createRateLimiter, slidingWindow } from '@repo/rate-limit';

export async function GET(): Promise<Response> {
  const hasUpstashConfig =
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!hasUpstashConfig) {
    return new Response(
      JSON.stringify({
        ok: true,
        rateLimited: false,
        message:
          'Rate limiting example route. Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable real limiting.',
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  const limiter = createRateLimiter({
    limiter: slidingWindow(10, '10 s'),
    prefix: 'zopio_rate_example',
  });

  const ip = 'anonymous';
  const { success, limit, remaining, reset } = await limiter.limit(
    `ping_${ip}`
  );

  if (!success) {
    return new Response(
      JSON.stringify({
        ok: false,
        rateLimited: true,
        message: 'Too many requests. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'content-type': 'application/json',
          'retry-after': reset.toString(),
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      rateLimited: false,
      limit,
      remaining,
      reset,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}
