import jwt from 'jsonwebtoken';

const SECRET = process.env.AUTH_TOKENS_SECRET || 'development-secret';

export function signToken(payload: object, options: jwt.SignOptions = {}) {
  return jwt.sign(payload, SECRET, {
    expiresIn: '1h',
    ...options,
  });
}