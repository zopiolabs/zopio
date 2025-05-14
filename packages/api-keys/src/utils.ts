import { createHash } from 'crypto';

/**
 * Hashes an API key string using SHA-256.
 */
export async function hashKey(rawKey: string): Promise<string> {
  return createHash('sha256').update(rawKey).digest('hex');
}

/**
 * Simulated DB insert operation.
 */
export async function saveKeyToDB(data: { hashedKey: string; userId: string; scopes: string[] }) {
  // Replace with actual DB logic using Prisma or equivalent ORM
  console.log('Saving key to DB:', data);
}

/**
 * Simulated DB fetch operation.
 */
export async function findKeyInDB(hashedKey: string) {
  // Replace with actual DB lookup
  return { hashedKey, userId: '123', revoked: false };
}

/**
 * Simulated DB revoke operation.
 */
export async function revokeKeyInDB(hashedKey: string) {
  // Replace with actual DB update logic
  console.log('Revoking key in DB:', hashedKey);
}
