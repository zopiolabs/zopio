/**
 * SPDX-License-Identifier: MIT
 */

import { evaluateAccess } from '@repo/auth-runner';

interface Record {
  [key: string]: unknown;
}

interface UserContext {
  userId: string;
  role: string;
  tenantId: string;
}

type Params = {
  resource: string;
  action: string;
  field?: string;
  record?: Record;
  context: UserContext;
};

type AccessResult = {
  can: boolean;
  reason?: string;
  loading: boolean;
};

/**
 * Hook for checking access permissions based on RBAC rules
 *
 * This is designed to be used with React's useState and useEffect hooks.
 * The implementation uses the evaluateAccess function from auth-runner.
 *
 * @param params Access parameters including resource, action, and context
 * @returns Access result with can, reason, and loading state
 */
export function useAccess(params: Params): AccessResult {
  // This function is meant to be used with React hooks
  // The actual implementation depends on the React runtime
  // This is just a placeholder that returns a static result
  // In a real React environment, this would use useState and useEffect

  // Synchronously evaluate access for server-side rendering or non-React environments
  try {
    const result = evaluateAccess(params);
    return {
      can: result.can,
      reason: result.reason,
      loading: false,
    };
  } catch (error) {
    return {
      can: false,
      reason: error instanceof Error ? error.message : 'Unknown error',
      loading: false,
    };
  }
}
