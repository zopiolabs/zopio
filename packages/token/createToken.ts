import type { TokenPayload, TokenOptions } from './types';
import { encodeBase64, now } from './utils';

/**
 * Creates a token with the given payload and options
 * 
 * @param payload - The data to include in the token
 * @param options - Options for token creation
 * @returns A base64url encoded token string
 * 
 * @example
 * ```ts
 * const token = createToken({ purpose: 'reset-password', userId: '123' }, { expiresIn: 3600 });
 * ```
 */
export function createToken(payload: TokenPayload, options?: TokenOptions): string {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Token payload must be an object');
  }
  
  if (!payload.purpose || typeof payload.purpose !== 'string') {
    throw new Error('Token payload must include a purpose string');
  }
  
  const includeStandardClaims = options?.includeStandardClaims !== false;
  
  // Create token data with standard claims if requested
  const tokenData: TokenPayload = { ...payload };
  
  if (includeStandardClaims) {
    // Add issued at timestamp
    tokenData.iat = now();
    
    // Add expiration timestamp if requested
    if (options?.expiresIn) {
      if (typeof options.expiresIn !== 'number' || options.expiresIn <= 0) {
        throw new Error('Token expiration time must be a positive number');
      }
      
      tokenData.exp = now() + options.expiresIn;
    }
  }
  
  return encodeBase64(tokenData);
}