import type { LogProvider } from '../types';

export const createNoopLogProvider = (): LogProvider => ({
  log: () => {},
});