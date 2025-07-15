// SPDX-License-Identifier: MIT
import { type JWTVerifyResult, jwtVerify } from 'jose';

interface JWTPayload {
  sub?: string;
  [key: string]: unknown;
}

/**
 * Verifies a Clerk session token and returns the user ID if valid
 * @param token The Clerk session token to verify
 * @returns The user ID associated with the token
 * @throws Error if the token is invalid or verification fails
 */
export async function verifyClerkToken(token: string): Promise<string> {
  try {
    // Get the JWT verification key from environment variable
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error('CLERK_SECRET_KEY is not defined');
    }

    // Use jose to verify the JWT token
    const secret = new TextEncoder().encode(process.env.CLERK_SECRET_KEY);
    const { payload } = (await jwtVerify(token, secret)) as JWTVerifyResult & {
      payload: JWTPayload;
    };

    if (!payload.sub) {
      throw new Error('Invalid token: No user ID found');
    }

    return payload.sub;
  } catch (_error) {
    // Avoid using console in production code
    throw new Error('Invalid or expired token');
  }
}
