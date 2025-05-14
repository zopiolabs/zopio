import { randomBytes } from 'node:crypto';
import { hashKey, saveKeyToDB } from './utils';

/**
 * Generates a new API key, stores a hashed version in the database, and returns the raw key.
 */
export function createKey(userId: string, scopes: string[] = []): string {
  const prefix = 'zpk';
  const rawKey = `${prefix}_${randomBytes(24).toString('hex')}`;
  const hashedKey = hashKey(rawKey);

  saveKeyToDB({
    hashedKey,
    userId,
    scopes,
  });

  return rawKey;
}
