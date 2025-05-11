import { cookies, headers } from 'next/headers';
import type { RuntimeAdapter } from '../types';

export const NextRuntimeAdapter: RuntimeAdapter = {
  getCookie: (key) => cookies().get(key)?.value,
  getHeader: (key) => headers().get(key) || undefined,
  getIp: () => headers().get('x-forwarded-for') || '127.0.0.1',
  getRequestContext: () => ({ method: headers().get('x-method') || 'GET' }),
};