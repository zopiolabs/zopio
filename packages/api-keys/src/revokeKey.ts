import { revokeKeyInDB } from './utils';

/**
 * Marks the API key as revoked in the database.
 */
export async function revokeKey(rawKey: string): Promise<void> {
  const hashedKey = await hashKey(rawKey);
  await revokeKeyInDB(hashedKey);
}
