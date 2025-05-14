import { hashKey, revokeKeyInDB } from './utils';

/**
 * Marks the API key as revoked in the database.
 */
export function revokeKey(rawKey: string): void {
  const hashedKey = hashKey(rawKey);
  revokeKeyInDB(hashedKey);
}
