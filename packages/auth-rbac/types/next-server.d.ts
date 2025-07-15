/**
 * SPDX-License-Identifier: MIT
 */

declare module 'next/server' {
  export interface NextRequest extends Request {
    cookies: {
      get: (name: string) => { name: string; value: string } | undefined;
      getAll: () => Array<{ name: string; value: string }>;
      set: (
        name: string,
        value: string,
        options?: {
          expires?: Date;
          path?: string;
          domain?: string;
          secure?: boolean;
          httpOnly?: boolean;
          sameSite?: 'strict' | 'lax' | 'none';
        }
      ) => void;
      delete: (name: string) => void;
    };
    nextUrl: URL;
    ip?: string;
    geo?: {
      city?: string;
      country?: string;
      region?: string;
    };
  }

  export class NextResponse extends Response {
    static json(
      body: Record<string, unknown>,
      init?: ResponseInit
    ): NextResponse;
    static redirect(url: string | URL, init?: ResponseInit): NextResponse;
    static rewrite(url: string | URL, init?: ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }
}
