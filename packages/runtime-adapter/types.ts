export interface RuntimeAdapter {
  getCookie: (key: string) => string | undefined;
  getHeader: (key: string) => string | undefined;
  getIp: () => string | undefined;
  getRequestContext: () => Record<string, any>;
}