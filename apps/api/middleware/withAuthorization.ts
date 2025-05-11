import { createAbilityFor } from '@repo/auth-rbac/ability';
import type { Actions, Subjects } from '@repo/auth-rbac/types';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function withAuthorization(
  handler: (req: NextRequest) => Response | Promise<Response>,
  action: Actions,
  subject: Subjects
) {
  return (req: NextRequest) => {
    const user = req.headers.get('x-user') ? JSON.parse(req.headers.get('x-user') as string) : null;
    const ability = createAbilityFor(user);

    if (!ability.can(action, subject)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return handler(req);
  };
}