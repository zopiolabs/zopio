/**
 * @repo/auth-core/integrations/hooks
 * 
 * Integration between auth-core and React hooks for authentication
 */

import { useEffect, useState } from 'react';
import type { AuthUser } from '..';
import { createAuthUser } from '..';
import { createAbilityForAuthUser } from './rbac';
import { canWithPolicy } from './policy';

// Stub implementation of the useUser hook from @repo/auth/client
function useUser() {
  // In a real implementation, this would use Clerk's useUser hook
  return {
    user: null,
    isLoaded: true
  };
}

/**
 * Hook to get the current AuthUser
 * 
 * @returns AuthUser object and loading state
 */
export function useAuthUser() {
  const { user, isLoaded } = useUser();
  const [authUser, setAuthUser] = useState<AuthUser>({
    id: '',
    roles: [],
    permissions: [],
    metadata: {}
  });

  useEffect(() => {
    if (isLoaded && user) {
      setAuthUser(createAuthUser(user));
    }
  }, [user, isLoaded]);

  return {
    user: authUser,
    isLoaded
  };
}

/**
 * Hook to check if the current user has a specific role
 * 
 * @param role - Role or array of roles to check
 * @returns Boolean indicating if the user has the role and loading state
 */
export function useHasRole(role: string | string[]) {
  const { user, isLoaded } = useAuthUser();
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (Array.isArray(role)) {
        setHasRole(role.some(r => user.roles.includes(r)));
      } else {
        setHasRole(user.roles.includes(role));
      }
    }
  }, [user, isLoaded, role]);

  return {
    hasRole,
    isLoaded
  };
}

/**
 * Hook to check if the current user has a specific permission
 * 
 * @param permission - Permission or array of permissions to check
 * @returns Boolean indicating if the user has the permission and loading state
 */
export function useHasPermission(permission: string | string[]) {
  const { user, isLoaded } = useAuthUser();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (Array.isArray(permission)) {
        setHasPermission(permission.some(p => user.permissions.includes(p)));
      } else {
        setHasPermission(user.permissions.includes(permission));
      }
    }
  }, [user, isLoaded, permission]);

  return {
    hasPermission,
    isLoaded
  };
}

/**
 * Hook to check if the current user can perform an action on a subject using RBAC
 * 
 * @param action - Action to check (e.g., 'read', 'update')
 * @param subject - Subject to check (e.g., 'Profile', 'Dashboard')
 * @returns Boolean indicating if the user can perform the action and loading state
 */
export function useCan(action: string, subject: string) {
  const { user, isLoaded } = useAuthUser();
  const [can, setCan] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const ability = createAbilityForAuthUser(user);
      setCan(ability.can(action, subject));
    }
  }, [user, isLoaded, action, subject]);

  return {
    can,
    isLoaded
  };
}

/**
 * Hook to check if the current user can perform an action on a resource using policy-based authorization
 * 
 * @param action - Policy action to check
 * @param resource - Resource to check access for
 * @param context - Additional context for the policy check
 * @returns Boolean indicating if the user can perform the action and loading state
 */
export function usePolicy(action: string, resource: string, context?: Record<string, unknown>) {
  const { user, isLoaded } = useAuthUser();
  const [can, setCan] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Avoid creating unnecessary closures in the cleanup function
    const controller = { isMounted: true };
    
    // Split the policy checking logic into smaller functions
    function handlePolicyResult(result: boolean) {
      if (controller.isMounted) {
        setCan(result);
        setLoading(false);
      }
    }
    
    function handlePolicyError() {
      if (controller.isMounted) {
        setCan(false);
        setLoading(false);
      }
    }
    
    async function checkPolicy() {
      if (!isLoaded) {
        return;
      }
      
      try {
        const result = await canWithPolicy(user, action, resource, context);
        handlePolicyResult(result);
      } catch (error) {
        handlePolicyError();
      }
    }
    
    // Execute the policy check
    void checkPolicy();
    
    return () => {
      controller.isMounted = false;
    };
  }, [user, isLoaded, action, resource, context]);

  return {
    can,
    isLoaded: isLoaded && !loading
  };
}
