export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogProvider {
  log: (level: LogLevel, key: string, context?: Record<string, any>) => void;
}