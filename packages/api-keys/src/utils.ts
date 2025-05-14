import { createHash } from 'node:crypto';

/**
 * API Key record type
 */
export interface ApiKeyRecord {
  hashedKey: string;
  userId: string;
  scopes: string[];
  revoked: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
}

/**
 * Hashes an API key string using SHA-256.
 */
export function hashKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex');
}

// In-memory store for development/testing
const keyStore: Record<string, ApiKeyRecord> = {};

/**
 * Saves a new API key to the database.
 */
export function saveKeyToDB(data: { hashedKey: string; userId: string; scopes: string[] }): ApiKeyRecord {
  // In a real implementation, this would use Prisma to insert into the database
  const record: ApiKeyRecord = {
    ...data,
    revoked: false,
    createdAt: new Date(),
  };
  
  keyStore[data.hashedKey] = record;
  return record;
}

/**
 * Finds an API key in the database by its hashed value.
 */
export function findKeyInDB(hashedKey: string): ApiKeyRecord | null {
  // In a real implementation, this would use Prisma to query the database
  return keyStore[hashedKey] || null;
}

/**
 * Marks an API key as revoked in the database.
 */
export function revokeKeyInDB(hashedKey: string): void {
  // In a real implementation, this would use Prisma to update the database
  const record = keyStore[hashedKey];
  if (record) {
    record.revoked = true;
  }
}
