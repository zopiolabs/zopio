import type { LogProvider, LogLevel } from '../types';

export const createMockLogProvider = (): LogProvider => {
  const logs: { level: LogLevel; key: string; context?: Record<string, any> }[] = [];

  return {
    log(level, key, context) {
      logs.push({ level, key, context });
    },
    getLogs() {
      return logs;
    },
    clear() {
      logs.length = 0;
    }
  };
};