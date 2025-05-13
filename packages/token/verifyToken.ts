import type { TokenPayload } from './types';
import { decodeBase64, now } from './utils';

/**
 * Verification error types
 */
export const TokenVerificationErrorType = {
  INVALID_FORMAT: 'invalid_format',
  EXPIRED: 'expired',
  INVALID_PURPOSE: 'invalid_purpose',
  DECODE_ERROR: 'decode_error'
} as const;

/**
 * Type for verification error types
 */
export type TokenVerificationErrorType = typeof TokenVerificationErrorType[keyof typeof TokenVerificationErrorType];

/**
 * Custom error class for token verification failures
 */
export class TokenVerificationError extends Error {
  type: TokenVerificationErrorType;
  
  constructor(message: string, type: TokenVerificationErrorType) {
    super(message);
    this.name = 'TokenVerificationError';
    this.type = type;
  }
}

/**
 * Verifies a token and returns its payload
 * 
 * @param token - The token string to verify
 * @param expectedPurpose - Optional purpose to validate against
 * @returns The decoded token payload
 * @throws {TokenVerificationError} If the token is invalid or expired
 * 
 * @example
 * ```ts
 * try {
 *   const payload = verifyToken(token, 'reset-password');
 *   // Token is valid, use payload
 * } catch (error) {
 *   if (error instanceof TokenVerificationError) {
 *     if (error.type === TokenVerificationErrorType.EXPIRED) {
 *       // Handle expired token
 *     }
 *   }
 * }
 * ```
 */
export function verifyToken<T extends TokenPayload = TokenPayload>(
  token: string,
  expectedPurpose?: string
): T {
  if (!token || typeof token !== 'string') {
    throw new TokenVerificationError(
      'Invalid token format',
      TokenVerificationErrorType.INVALID_FORMAT
    );
  }
  
  let data: T;
  
  try {
    data = decodeBase64<T>(token);
  } catch (error) {
    throw new TokenVerificationError(
      `Failed to decode token: ${error instanceof Error ? error.message : String(error)}`,
      TokenVerificationErrorType.DECODE_ERROR
    );
  }
  
  // Check if token has expired
  if (data.exp && now() > data.exp) {
    throw new TokenVerificationError(
      'Token has expired',
      TokenVerificationErrorType.EXPIRED
    );
  }
  
  // Validate purpose if expected purpose is provided
  if (expectedPurpose && data.purpose !== expectedPurpose) {
    throw new TokenVerificationError(
      `Invalid token purpose: expected '${expectedPurpose}', got '${data.purpose}'`,
      TokenVerificationErrorType.INVALID_PURPOSE
    );
  }
  
  return data;
}