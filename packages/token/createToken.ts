import type { TokenPayload, TokenOptions } from './types';
import { encodeBase64, now } from './utils';

export function createToken(payload: TokenPayload, options?: TokenOptions): string {
  const tokenData = {
    ...payload,
    iat: now(),
    exp: options?.expiresIn ? now() + options.expiresIn : undefined
  };
  return encodeBase64(tokenData);
}