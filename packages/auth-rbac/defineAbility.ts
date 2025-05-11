import type { Actions, Subjects } from './types';
import type { Role } from './roles';
import { getAbilitiesForRole } from './roles';

export function defineRulesFor(
  user: { role?: Role; id?: string; [key: string]: unknown },
  can: (action: Actions, subject: Subjects, conditions?: string | undefined) => void,
  cannot: (action: Actions, subject: Subjects, conditions?: string | undefined) => void
) {
  if (!user || !user.role) {
    return;
  }

  const rawAbilities = getAbilitiesForRole(user.role as Role);

  for (const rule of rawAbilities) {
    const conditions = substitute('conditions' in rule ? rule.conditions : undefined, user);
    if ('inverted' in rule && rule.inverted) {
      cannot(rule.action, rule.subject, conditions);
    } else {
      can(rule.action, rule.subject, conditions);
    }
  }
}

function substitute(conditions: Record<string, unknown> | undefined, user: { [key: string]: unknown }): string | undefined {
  if (!conditions) {
    return undefined;
  }
  const replaced = JSON.stringify(conditions).replace(/\$\{user\.([^}]+)\}/g, (_, key) => {
    const value = user[key];
    return typeof value === 'string' ? value : (value?.toString() || '');
  });
  return JSON.parse(replaced);
}