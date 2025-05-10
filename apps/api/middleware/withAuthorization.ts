import { createAbilityFor } from '@repo/auth-rbac/ability';
import { NextRequest, NextResponse } from 'next/server';

export function withAuthorization(handler: Function, action: string, subject: string) {
  return async (req: NextRequest) => {
    const user = req.headers.get('x-user') ? JSON.parse(req.headers.get('x-user') as string) : null;
    const ability = createAbilityFor(user);

    if (!ability.can(action, subject)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return handler(req);
  };
}