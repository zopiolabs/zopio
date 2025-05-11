import type { PolicyContext } from './types';

export async function allowAll(_: PolicyContext): Promise<boolean> {
  return true;
}

export async function denyAll(_: PolicyContext): Promise<boolean> {
  return false;
}