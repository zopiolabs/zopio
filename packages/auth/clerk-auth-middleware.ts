// SPDX-License-Identifier: MIT
import { verifyClerkToken } from './lib/verify-clerk-token';

// Extend the Request type to include user property
declare global {
  interface Request {
    user?: { id: string };
  }
}

/**
 * Middleware to verify Clerk authentication tokens
 * @param req The incoming request
 * @returns The request with user data attached or an error response
 */
export async function clerkAuthMiddleware(
  req: Request
): Promise<Request | Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      'Unauthorized: Missing or invalid authorization header',
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using our utility function
    const userId = await verifyClerkToken(token);

    // Attach the user ID to the request
    req.user = { id: userId };

    return req;
  } catch (_error) {
    // Handle errors safely without exposing details
    return new Response('Invalid authentication token', { status: 403 });
  }
}
