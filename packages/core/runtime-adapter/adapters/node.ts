import type { IncomingMessage } from 'node:http';
import type { RuntimeAdapter, RequestContext } from '../types.js';
import { logger } from '../utils/logger.js';

/**
 * Helper function to parse cookies from a cookie header string
 * @param cookieHeader The raw cookie header string
 * @returns Object with cookie key-value pairs
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  // Split the cookie header by semicolons and process each cookie
  const cookiePairs = cookieHeader.split(';');
  
  for (const pair of cookiePairs) {
    const parts = pair.trim().split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      // Join remaining parts in case the value contains '='
      const value = parts.slice(1).join('=').trim();
      if (key && value) {
        cookies[key] = value;
      }
    }
  }
  
  return cookies;
}

/**
 * Creates a RuntimeAdapter for Node.js HTTP server environments
 * 
 * This adapter provides methods to access request data like cookies, headers,
 * IP addresses, and other context information from a Node.js HTTP server environment.
 * 
 * @param req The incoming HTTP request object from Node.js http module
 * @returns A fully configured RuntimeAdapter instance for Node.js
 * @throws {Error} If req is null or undefined
 * @example
 * ```ts
 * import { createNodeRuntimeAdapter } from '@repo/runtime-adapter';
 * import { IncomingMessage } from 'http';
 * 
 * export default function handler(req: IncomingMessage, res: any) {
 *   const adapter = createNodeRuntimeAdapter(req);
 *   const sessionId = adapter.getCookie('sessionId');
 *   // Use adapter methods...
 * }
 * ```
 */
export const createNodeRuntimeAdapter = (req: IncomingMessage): RuntimeAdapter => {
  if (!req) {
    throw new Error('Request object is required for Node runtime adapter');
  }

  return {
    /**
     * Gets a cookie value by key from the request
     * @param key The cookie name to retrieve
     * @returns The cookie value or undefined if not found
     */
    getCookie: (key: string): string | undefined => {
      if (!key) {
        return undefined;
      }
      
      // Parse cookies from the Cookie header
      const cookieHeader = req.headers.cookie || '';
      
      // Early return if no cookies are present
      if (!cookieHeader) {
        return undefined;
      }
      
      // Extract the specific cookie we're looking for instead of parsing all cookies
      // This reduces complexity and improves performance
      const cookies = parseCookies(cookieHeader);
      return cookies[key];
    },

    /**
     * Gets a header value by key from the request
     * @param key The header name to retrieve (case-insensitive)
     * @returns The header value or undefined if not found
     */
    getHeader: (key: string): string | undefined => {
      if (!key) {
        return undefined;
      }
      
      const headerValue = req.headers[key.toLowerCase()];
      if (Array.isArray(headerValue)) {
        return headerValue[0];
      }
      return headerValue as string | undefined;
    },

    /**
     * Gets the client IP address from the request
     * Checks x-forwarded-for header first, then falls back to socket remote address
     * @returns The IP address or '127.0.0.1' if not available
     */
    getIp: (): string => {
      try {
        // Simplify the IP extraction logic to reduce complexity
        const forwardedFor = req.headers['x-forwarded-for'];
        
        // Handle string case
        if (typeof forwardedFor === 'string' && forwardedFor) {
          // Get the first IP in the list (client IP)
          return forwardedFor.split(',')[0].trim();
        }
        
        // Handle array case
        if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
          return forwardedFor[0].split(',')[0].trim();
        }
        
        // Fall back to socket remote address
        return req.socket?.remoteAddress || '127.0.0.1';
      } catch (error) {
        // Log the error using our logger utility
        logger.error('Error getting IP address in Node adapter:', error);
        return '127.0.0.1';
      }
    },

    /**
     * Gets the request context information
     * @returns Object containing request context data
     */
    getRequestContext: (): RequestContext => ({ 
      method: req.method,
      url: req.url,
      httpVersion: req.httpVersion,
      headers: req.headers as Record<string, unknown>,
      remoteAddress: req.socket?.remoteAddress
    })
  };
};