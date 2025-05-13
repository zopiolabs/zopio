/**
 * Standard payload for tokens
 */
export interface TokenPayload {
  /** Identifies the purpose of the token (e.g., 'reset-password', 'invite', etc.) */
  purpose: string;
  /** Unix timestamp (seconds) when the token was issued */
  iat?: number;
  /** Unix timestamp (seconds) when the token expires */
  exp?: number;
  /** Additional custom properties */
  [key: string]: unknown;
}

/**
 * Options for token creation
 */
export interface TokenOptions {
  /** Token expiration time in seconds from now */
  expiresIn?: number;
  /** Whether to include standard JWT claims (iat, exp) */
  includeStandardClaims?: boolean;
}