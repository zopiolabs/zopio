import type { MongoAbility, ExtractSubjectType, Subject } from '@casl/ability';

/**
 * Possible actions that can be performed on subjects
 */
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

/**
 * Subjects that can have permissions applied to them
 * Add new subjects here as needed
 */
export type Subjects =
  | 'Dashboard'
  | 'Profile'
  | 'User'
  | 'Plugin'
  | 'FeatureFlag'
  | 'Organization'
  | 'Public'
  | 'all';

/**
 * The application's ability type for CASL
 */
export type AppAbility = MongoAbility<[Actions, Subjects]>;

/**
 * Helper type for subject type extraction
 */
export type SubjectType = ExtractSubjectType<Subject>;

/**
 * User with role information for RBAC
 */
export interface UserWithRole {
  id: string;
  role: string;
  [key: string]: unknown;
}

/**
 * Permission rule structure
 */
export interface PermissionRule {
  action: Actions | string;
  subject: Subjects | string;
  conditions?: Record<string, unknown>;
  inverted?: boolean;
}

/**
 * Role definition with permissions
 */
export interface RoleDefinition {
  name: string;
  permissions: PermissionRule[];
  inherits?: string[];
}