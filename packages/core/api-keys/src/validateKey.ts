import { hashKey, findKeyInDB } from './utils';

/**
 * Validates an incoming API key string by checking against stored hashed values.
 */
export function validateKey(rawKey: string): boolean {
  const hashedKey = hashKey(rawKey);
  const keyRecord = findKeyInDB(hashedKey);
  return !!keyRecord && !keyRecord.revoked;
}
