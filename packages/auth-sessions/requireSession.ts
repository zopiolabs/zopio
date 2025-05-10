import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from './getServerUser';

export async function requireSession(req: NextRequest) {
  const user = await getServerUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return user;
}