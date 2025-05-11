export interface TokenPayload {
  purpose: string;
  [key: string]: any;
}

export interface TokenOptions {
  expiresIn?: number; // seconds
}