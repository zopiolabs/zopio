import type { TokenPayload } from './types';
import { decodeBase64, now } from './utils';

export function verifyToken<T extends TokenPayload = TokenPayload>(token: string): T {
  const data = decodeBase64<T>(token);
  if (data.exp && now() > data.exp) throw new Error('Token expired');
  return data;
}