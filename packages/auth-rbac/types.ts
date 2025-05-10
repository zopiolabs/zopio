import { MongoAbility, AbilityTuple, ExtractSubjectType, Subject } from '@casl/ability';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects =
  | 'Dashboard'
  | 'Profile'
  | 'User'
  | 'Public'
  | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;
export type SubjectType = ExtractSubjectType<Subject>;