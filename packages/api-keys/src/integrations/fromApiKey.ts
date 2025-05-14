import { NextRequest } from 'next/server';
import { validateKey } from '../validateKey';

/**
 * Extracts user identity from an API key in headers.
 */
export async function fromApiKey(req: NextRequest) {
  const rawKey = req.headers.get('x-api-key');
  if (!rawKey) return null;
  return await validateKey(rawKey);
}
