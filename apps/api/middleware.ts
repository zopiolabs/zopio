import { clerkAuthMiddleware } from '@repo/auth';
import * as Sentry from '@sentry/nextjs';
// SPDX-License-Identifier: MIT
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js middleware function to handle authentication for API routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicPaths = [
    '/',
    '/health',
    '/webhooks',
    '/_next/static',
    '/favicon.ico',
  ];

  // Check if the current path is public
  const isPublicPath = publicPaths.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  );

  // API key routes will handle their own authentication in their route handlers
  const isApiKeyPath = pathname.startsWith('/api-keys');

  // Allow public routes and API key routes without authentication
  if (isPublicPath || isApiKeyPath) {
    return NextResponse.next();
  }

  // For all other routes, apply our Clerk auth middleware
  try {
    const result = await clerkAuthMiddleware(request);

    // If the result is a Response, it means auth failed
    if (result instanceof Response) {
      return result;
    }

    // Auth succeeded, continue with the enhanced request
    return NextResponse.next();
  } catch (error) {
    // Handle any errors during authentication
    Sentry.captureException(error, {
      tags: { source: 'auth-middleware' },
      extra: { path: request.nextUrl.pathname },
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Authentication error',
        message: 'Failed to authenticate request',
      }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

// Configure which routes the middleware will run on
export const config = {
  matcher: [
    // Match all API routes except static files
    '/((?!_next/static|favicon.ico).*)',
  ],
};
