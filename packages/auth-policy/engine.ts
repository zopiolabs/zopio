import type { PolicyContext, PolicyRegistry } from './types';
import { canInstallPlugin } from './rules/plugin';

const registry: PolicyRegistry = {
  'plugin.install': canInstallPlugin,
};

export async function can(input: PolicyContext): Promise<boolean> {
  const rule = registry[input.action];
  if (!rule) return false;
  return await rule(input);
}