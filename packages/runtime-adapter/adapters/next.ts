import type { RuntimeAdapter, RequestContext } from '../types.js';

/**
 * Safe wrapper for accessing Next.js headers and cookies
 * This prevents runtime errors when used outside of Next.js
 */
const safeNextAccess = {
  getCookie: (key: string): string | undefined => {
    try {
      // Dynamic import to avoid build-time errors
      // Only works in Next.js server components/API routes
      // Using require instead of import for runtime compatibility
      // We need to use require dynamically to avoid build-time errors
      // when this code is used in non-Next.js environments
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { cookies } = require('next/headers') as { cookies: () => { get: (name: string) => { value: string } | undefined } };
      return cookies().get(key)?.value;
    } catch {
      return undefined;
    }
  },
  
  getHeader: (key: string): string | undefined => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { headers } = require('next/headers') as { headers: () => { get: (name: string) => string | null } };
      return headers().get(key) || undefined;
    } catch {
      return undefined;
    }
  },
  
  getHeaders: (): Record<string, string> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { headers } = require('next/headers') as { headers: () => { forEach: (callback: (value: string, key: string) => void) => void } };
      const headersList = headers();
      const result: Record<string, string> = {};
      
      // Convert headers to a plain object
      headersList.forEach((value: string, key: string) => {
        result[key] = value;
      });
      
      return result;
    } catch {
      return {};
    }
  }
};

/**
 * Runtime adapter for Next.js applications
 * 
 * This adapter provides methods to access request data like cookies, headers,
 * IP addresses, and other context information from a Next.js environment.
 * 
 * @example
 * ```ts
 * import { NextRuntimeAdapter } from '@repo/runtime-adapter';
 * 
 * // In a Next.js server component or API route
 * const sessionId = NextRuntimeAdapter.getCookie('sessionId');
 * ```
 */
export const NextRuntimeAdapter: RuntimeAdapter = {
  /**
   * Gets a cookie value by key using Next.js cookies() API
   * @param key The cookie name to retrieve
   * @returns The cookie value or undefined if not found
   */
  getCookie: (key: string): string | undefined => {
    if (!key) {
      return undefined;
    }
    return safeNextAccess.getCookie(key);
  },
  
  /**
   * Gets a header value by key using Next.js headers() API
   * @param key The header name to retrieve
   * @returns The header value or undefined if not found
   */
  getHeader: (key: string): string | undefined => {
    if (!key) {
      return undefined;
    }
    return safeNextAccess.getHeader(key);
  },
  
  /**
   * Gets the client IP address from the x-forwarded-for header
   * @returns The IP address or '127.0.0.1' if not available
   */
  getIp: (): string => {
    const forwardedFor = safeNextAccess.getHeader('x-forwarded-for');
    if (forwardedFor) {
      // Get the first IP in the list (client IP)
      return forwardedFor.split(',')[0].trim();
    }
    return '127.0.0.1';
  },
  
  /**
   * Gets the request context information from Next.js headers
   * @returns Object containing request context data
   */
  getRequestContext: (): RequestContext => {
    const headers = safeNextAccess.getHeaders();
    return {
      method: headers['x-method'] || 'GET',
      url: headers['x-url'] || '',
      headers
    };
  },
};