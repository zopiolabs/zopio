import type { LogProvider } from './types';

let currentProvider: LogProvider;

export const setLogProvider = (provider: LogProvider) => {
  currentProvider = provider;
};

export const getLogProvider = (): LogProvider => currentProvider;