import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function withSecurityHeaders(handler: (req: NextRequest) => NextResponse | Promise<NextResponse>) {
  return async function middleware(req: NextRequest) {
    const res = await handler(req);

    res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    res.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    res.headers.set('Origin-Agent-Cluster', '?1');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-DNS-Prefetch-Control', 'off');
    res.headers.set('X-Download-Options', 'noopen');
    res.headers.set('X-Frame-Options', 'SAMEORIGIN');
    res.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    res.headers.set('X-XSS-Protection', '1; mode=block');

    return res;
  };
}