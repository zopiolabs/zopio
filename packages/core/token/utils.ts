/**
 * Encodes an object to a base64url string
 * @param obj The object to encode
 * @returns A base64url encoded string
 */
function encodeBase64<T extends Record<string, unknown>>(obj: T): string {
  try {
    return Buffer.from(JSON.stringify(obj)).toString('base64url');
  } catch (error) {
    throw new Error(`Failed to encode token: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Decodes a base64url string to an object
 * @param b64 The base64url string to decode
 * @returns The decoded object
 */
function decodeBase64<T extends Record<string, unknown>>(b64: string): T {
  if (!b64 || typeof b64 !== 'string') {
    throw new Error('Invalid token format');
  }
  
  try {
    const decoded = JSON.parse(Buffer.from(b64, 'base64url').toString());
    
    if (!decoded || typeof decoded !== 'object') {
      throw new Error('Invalid token payload');
    }
    
    return decoded as T;
  } catch (error) {
    throw new Error(`Failed to decode token: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets the current Unix timestamp in seconds
 * @returns The current Unix timestamp in seconds
 */
function now(): number {
  return Math.floor(Date.now() / 1000);
}

export { encodeBase64, decodeBase64, now };