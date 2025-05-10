export function getTokenFromHeader(req: Request): string | null {
  const auth = req.headers.get('authorization') || '';
  const [, token] = auth.split(' ');
  return token || null;
}