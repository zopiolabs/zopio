/**
 * SPDX-License-Identifier: MIT
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getUserContext } from '../adapters/clerk';
import { rules } from '../config/rules';
import { evaluateAccess } from '../engine/evaluate';

/**
 * Middleware for handling authorization based on RBAC rules
 */
export function withAuthorization(options: {
  resource: string;
  action: string;
  field?: string;
}) {
  return async (req: NextRequest) => {
    try {
      // Get the user context from the request
      const context = await getUserContext(req);

      // Evaluate access permissions
      const result = evaluateAccess({
        rules,
        context,
        action: options.action,
        resource: options.resource,
        field: options.field,
      });

      // If access is denied, return a 403 response
      if (!result.can) {
        return NextResponse.json(
          { error: result.reason || 'Access denied' },
          { status: 403 }
        );
      }

      // Access granted, continue to the next middleware/handler
      return NextResponse.next();
    } catch (err: unknown) {
      // Handle authentication errors
      const errorMessage = err instanceof Error ? err.message : 'Unauthorized';

      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
  };
}
