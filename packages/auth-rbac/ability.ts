import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import type { AppAbility, SubjectType, Actions } from './types';
import { defineRulesFor } from './defineAbility';

export function createAbilityFor(user: any): AppAbility {
  const { can, cannot, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

  defineRulesFor(user, can, cannot);

  return createMongoAbility(rules);
}