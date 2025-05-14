import { hashKey, findKeyInDB } from '../utils';

// Define a minimal NextRequest interface to avoid dependency on next/server
interface NextRequest {
  headers: {
    get(name: string): string | null;
  };
}

// This is a placeholder for the actual rate limit function
// In a real implementation, this would be imported from a rate-limiting package
type RateLimitResult = { allowed: boolean; remaining?: number; reset?: number };
function useRateLimit(key: string, options: { limit: number; windowInSeconds: number }): RateLimitResult {
  // Placeholder implementation
  // We acknowledge the key parameter but don't need to use it in this simplified version
  
  return { 
    allowed: true, 
    remaining: options.limit - 1, 
    reset: Date.now() + options.windowInSeconds * 1000 
  };
}

/**
 * Applies rate limiting based on the API key.
 */
export async function useApiKeyRateLimit(req: NextRequest): Promise<RateLimitResult> {
  const rawKey = req.headers.get('x-api-key');
  if (!rawKey) {
    return { allowed: false };
  }

  const hashedKey = await hashKey(rawKey);
  const keyRecord = await findKeyInDB(hashedKey);
  
  if (!keyRecord || keyRecord.revoked) {
    return { allowed: false };
  }

  // Apply rate limiting based on the API key
  return useRateLimit(`apikey:${hashedKey}`, {
    limit: 1000,
    windowInSeconds: 86400, // 24 hours
  });
}
