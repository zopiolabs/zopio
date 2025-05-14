// Define a minimal NextRequest interface to avoid dependency on next/server
interface NextRequest {
  headers: {
    get(name: string): string | null;
  };
}

import { hashKey, findKeyInDB } from '../utils';

/**
 * Extracts user identity from an API key in headers.
 */
export function fromApiKey(req: NextRequest) {
  const rawKey = req.headers.get('x-api-key');
  if (!rawKey) {
    return null;
  }
  
  const hashedKey = hashKey(rawKey);
  const keyRecord = findKeyInDB(hashedKey);
  
  if (!keyRecord || keyRecord.revoked) {
    return null;
  }
  
  return {
    userId: keyRecord.userId,
    scopes: keyRecord.scopes,
    keyId: hashedKey
  };
}
