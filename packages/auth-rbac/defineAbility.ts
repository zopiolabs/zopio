import type { Actions, SubjectType } from './types';
import { getAbilitiesForRole } from './roles';

export function defineRulesFor(
  user: any,
  can: (action: Actions, subject: SubjectType | SubjectType[], conditions?: any) => void,
  cannot: (action: Actions, subject: SubjectType | SubjectType[], conditions?: any) => void
) {
  if (!user || !user.role) return;

  const rawAbilities = getAbilitiesForRole(user.role);

  for (const rule of rawAbilities) {
    const conditions = substitute(rule.conditions, user);
    if (rule.inverted) {
      cannot(rule.action, rule.subject, conditions);
    } else {
      can(rule.action, rule.subject, conditions);
    }
  }
}

function substitute(conditions: any, user: any) {
  if (!conditions) return undefined;
  const replaced = JSON.stringify(conditions).replace(/\$\{user\.([^}]+)\}/g, (_, key) => user[key] || '');
  return JSON.parse(replaced);
}