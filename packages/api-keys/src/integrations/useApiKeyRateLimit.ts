import { validateKey } from '../validateKey';
import { useRateLimit } from '@core/rate-limit';
import { NextRequest } from 'next/server';

/**
 * Applies rate limiting based on the API key.
 */
export async function useApiKeyRateLimit(req: NextRequest) {
  const rawKey = req.headers.get('x-api-key');
  if (!rawKey) return { allowed: false };

  const key = await validateKey(rawKey);
  if (!key) return { allowed: false };

  return await useRateLimit(`apikey:${key.hashedKey}`, {
    limit: 1000,
    windowInSeconds: 86400,
  });
}
