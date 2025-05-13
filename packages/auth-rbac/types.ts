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
 * Clerk user structure with publicMetadata
 */
export interface ClerkUser {
  id: string;
  publicMetadata?: {
    roles?: string[];
    organizationId?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}