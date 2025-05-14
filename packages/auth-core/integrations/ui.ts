/**
 * @repo/auth-core/integrations/ui
 * 
 * Integration between auth-core and UI components for authentication
 */

import type { ReactNode } from 'react';
import { useCan, useHasRole, useHasPermission, usePolicy } from './hooks';

type GuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type RoleGuardProps = GuardProps & {
  role: string | string[];
};

type PermissionGuardProps = GuardProps & {
  permission: string | string[];
};

type AbilityGuardProps = GuardProps & {
  action: string;
  subject: string;
};

type PolicyGuardProps = GuardProps & {
  action: string;
  resource: string;
  context?: Record<string, unknown>;
};

/**
 * Component that renders children only if the user has a specific role
 */
export function RoleGuard({ role, children, fallback = null }: RoleGuardProps) {
  const { hasRole, isLoaded } = useHasRole(role);

  if (!isLoaded) {
    return null;
  }

  return hasRole ? children : fallback;
}

/**
 * Component that renders children only if the user has a specific permission
 */
export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission, isLoaded } = useHasPermission(permission);

  if (!isLoaded) {
    return null;
  }

  return hasPermission ? children : fallback;
}

/**
 * Component that renders children only if the user can perform an action on a subject using RBAC
 */
export function AbilityGuard({ action, subject, children, fallback = null }: AbilityGuardProps) {
  const { can, isLoaded } = useCan(action, subject);

  if (!isLoaded) {
    return null;
  }

  return can ? children : fallback;
}

/**
 * Component that renders children only if the user can perform an action on a resource using policy-based authorization
 */
export function PolicyGuard({ action, resource, context, children, fallback = null }: PolicyGuardProps) {
  const { can, isLoaded } = usePolicy(action, resource, context);

  if (!isLoaded) {
    return null;
  }

  return can ? children : fallback;
}
