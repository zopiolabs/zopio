import { NextRuntimeAdapter } from './adapters/next';
import type { RuntimeAdapter } from './types';

let current: RuntimeAdapter = NextRuntimeAdapter;

export const setRuntimeAdapter = (adapter: RuntimeAdapter) => {
  current = adapter;
};

export const getRuntimeAdapter = (): RuntimeAdapter => current;