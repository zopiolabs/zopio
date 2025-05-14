/**
 * Request context information provided by the runtime adapter
 */
export interface RequestContext {
  /** HTTP method of the request */
  method?: string;
  /** Request URL */
  url?: string;
  /** HTTP version */
  httpVersion?: string;
  /** Additional runtime-specific context data */
  [key: string]: unknown;
}

/**
 * Runtime adapter interface for abstracting platform-specific request handling
 */
export interface RuntimeAdapter {
  /**
   * Gets a cookie value by key
   * @param key The cookie name
   * @returns The cookie value or undefined if not found
   */
  getCookie: (key: string) => string | undefined;
  
  /**
   * Gets a header value by key
   * @param key The header name
   * @returns The header value or undefined if not found
   */
  getHeader: (key: string) => string | undefined;
  
  /**
   * Gets the client IP address
   * @returns The IP address or undefined if not available
   */
  getIp: () => string | undefined;
  
  /**
   * Gets the request context information
   * @returns Object containing request context data
   */
  getRequestContext: () => RequestContext;
}