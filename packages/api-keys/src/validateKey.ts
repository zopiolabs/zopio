import { hashKey, findKeyInDB } from './utils';

/**
 * Validates an incoming API key string by checking against stored hashed values.
 */
export async function validateKey(rawKey: string): Promise<boolean> {
  const hashedKey = await hashKey(rawKey);
  const keyRecord = await findKeyInDB(hashedKey);
  return !!keyRecord && !keyRecord.revoked;
}
