import jwt from 'jsonwebtoken';

const SECRET = process.env.AUTH_TOKENS_SECRET || 'development-secret';

export function verifyToken(token: string): any | null {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}