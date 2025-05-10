import { NextRequest } from 'next/server'

export async function getServerUser(req: NextRequest) {
  const userHeader = req.headers.get('x-user');
  if (!userHeader) return null;

  try {
    const user = JSON.parse(userHeader);
    return user;
  } catch (err) {
    return null;
  }
}