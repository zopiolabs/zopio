import { NextRuntimeAdapter } from './adapters/next.js';
import type { RuntimeAdapter } from './types.js';

let current: RuntimeAdapter = NextRuntimeAdapter;

export const setRuntimeAdapter = (adapter: RuntimeAdapter) => {
  current = adapter;
};

export const getRuntimeAdapter = (): RuntimeAdapter => current;