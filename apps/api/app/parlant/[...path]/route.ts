/**
 * SPDX-License-Identifier: MIT
 */

import { env } from '@/env';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type RouteParams = {
  readonly params: {
    readonly path?: string[];
  };
};

const ALLOWED_FORWARD_HEADERS = new Set(['authorization', 'content-type']);
const TRAILING_SLASH_REGEX = /\/$/;

async function handle(
  request: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  if (!env.PARLANT_SERVER_URL) {
    return new Response('PARLANT_SERVER_URL is not configured', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  const url = new URL(request.url);
  const pathSegments = params.path ?? [];
  const upstreamBase = env.PARLANT_SERVER_URL.replace(TRAILING_SLASH_REGEX, '');
  const pathSuffix =
    pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '';

  const upstreamUrl = new URL(`${upstreamBase}${pathSuffix}${url.search}`);

  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    if (ALLOWED_FORWARD_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  const method = request.method.toUpperCase();
  const hasBody = !['GET', 'HEAD'].includes(method);

  const init: RequestInit = {
    method,
    headers,
  };

  if (hasBody && request.body) {
    init.body = request.body as unknown as BodyInit;
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, init);

    const responseHeaders = new Headers();
    for (const [key, value] of upstreamResponse.headers.entries()) {
      const lowerKey = key.toLowerCase();
      if (lowerKey === 'content-length' || lowerKey === 'connection') {
        continue;
      }
      responseHeaders.set(key, value);
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch {
    return new Response('Unable to reach Parlant server', {
      status: 502,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

export { handle as GET };
export { handle as POST };
export { handle as PUT };
export { handle as PATCH };
export { handle as DELETE };
export { handle as OPTIONS };
