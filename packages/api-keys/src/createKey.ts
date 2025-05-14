import { randomBytes } from 'crypto';
import { hashKey, saveKeyToDB, findKeyInDB } from './utils';

/**
 * Generates a new API key, stores a hashed version in the database, and returns the raw key.
 */
export async function createKey(userId: string, scopes: string[] = []) {
  const prefix = 'zpk';
  const rawKey = `${prefix}_${randomBytes(24).toString('hex')}`;
  const hashedKey = await hashKey(rawKey);

  await saveKeyToDB({
    hashedKey,
    userId,
    scopes,
  });

  return rawKey;
}
