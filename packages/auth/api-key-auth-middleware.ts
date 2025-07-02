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
// api-key-auth-middleware.ts
import { validateApiKey } from '@repo/api-key/lib/validate';

// Extend the Request type to include user property
declare global {
  interface Request {
    user?: { id: string };
  }
}

export async function apiKeyAuthMiddleware(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  try {
    const userId = await validateApiKey(token);
    // Inject user id
    req.user = { id: userId };
    return req;
  } catch {
    return new Response('Invalid API Key', { status: 403 });
  }
}
