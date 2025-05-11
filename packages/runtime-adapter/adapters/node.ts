import type { IncomingMessage } from 'http';
import type { RuntimeAdapter } from '../types';

export const createNodeRuntimeAdapter = (req: IncomingMessage): RuntimeAdapter => {
  return {
    getCookie: () => undefined, // cookie-parser entegrasyonu gerekebilir
    getHeader: (key) => req.headers[key.toLowerCase()] as string | undefined,
    getIp: () => req.socket.remoteAddress || '127.0.0.1',
    getRequestContext: () => ({ method: req.method }),
  };
};