/**
 * SPDX-License-Identifier: MIT
 */

import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

export interface RateLimitOptions {
  /**
   * Maximum number of tokens per interval
   * @default 500
   */
  uniqueTokenPerInterval?: number;
  
  /**
   * Time window in milliseconds
   * @default 60000 (1 minute)
   */
  interval?: number;
}

/**
 * Rate limiting utility for Next.js App Router
 * 
 * @example
 * ```ts
 * // In your API route
 * import { rateLimit } from '@repo/design-system/lib/rate-limit';
 * 
 * const limiter = rateLimit({
 *   interval: 60000, // 1 minute
 * });
 * 
 * export async function GET(request: NextRequest) {
 *   try {
 *     await limiter.check(request, 2); // 2 requests per minute
 *     return NextResponse.json({ message: 'Success!' });
 *   } catch (error) {
 *     return error as NextResponse;
 *   }
 * }
 * ```
 */
export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute default
  });

  return {
    /**
     * Check if the request is within rate limits
     * @param request The Next.js request object
     * @param limit Maximum number of requests allowed per interval
     * @returns A promise that resolves if within limits, rejects with a NextResponse if rate limited
     */
    check: (request: NextRequest, limit: number) => {
      return new Promise<void>((resolve, reject) => {
        const ip = 
          request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          // @ts-ignore ignore
          request?.socket?.remoteAddress;

        if (!ip) {
          reject(
            NextResponse.json(
              { error: 'Can not get IP.' }, 
              { status: 400 }
            )
          );
          return;
        }

        const tokenCount = (tokenCache.get(ip) as number[]) || [0];
        
        if (tokenCount[0] === 0) {
          tokenCache.set(ip, tokenCount);
        }
        
        tokenCount[0] += 1;
        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage > limit;

        if (isRateLimited) {
          const response = NextResponse.json(
            { error: 'Too many requests, please try again later.' },
            { status: 429 }
          );
          
          response.headers.set('X-RateLimit-Limit', limit.toString());
          response.headers.set('X-RateLimit-Remaining', '0');
          
          reject(response);
        } else {
          resolve();
        }
      });
    },
  };
}
