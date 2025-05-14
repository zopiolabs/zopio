/**
 * Simple logger utility for runtime-adapter package
 * Provides a consistent logging interface that can be replaced with a more robust solution
 * 
 * NOTE: This is a simple implementation that intentionally uses console methods.
 * In a real-world application, this would be replaced with a proper logging library.
 * The eslint-disable comments are used to acknowledge this intentional usage.
 */

/**
 * Log levels supported by the logger
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger interface for consistent logging across the package
 */
export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

/**
 * Default logger implementation
 * In production, only shows warn and error logs
 * In development, shows all logs
 */
export const createLogger = (namespace: string): Logger => {
  const isProd = process.env.NODE_ENV === 'production';
  
  const shouldLog = (level: LogLevel): boolean => {
    if (isProd) {
      // In production, only show warnings and errors
      return level === 'warn' || level === 'error';
    }
    // In development, show all logs
    return true;
  };
  
  const formatMessage = (level: LogLevel, message: string): string => {
    return `[${namespace}] [${level.toUpperCase()}] ${message}`;
  };
  
  return {
    debug(message: string, ...args: unknown[]): void {
      if (shouldLog('debug')) {
        // We're intentionally using console here as a simple implementation
        // In a production app, this would be replaced with a proper logger
        // eslint-disable-next-line no-console
        console.debug(formatMessage('debug', message), ...args);
      }
    },
    
    info(message: string, ...args: unknown[]): void {
      if (shouldLog('info')) {
        // We're intentionally using console here as a simple implementation
        // In a production app, this would be replaced with a proper logger
        // eslint-disable-next-line no-console
        console.info(formatMessage('info', message), ...args);
      }
    },
    
    warn(message: string, ...args: unknown[]): void {
      if (shouldLog('warn')) {
        // We're intentionally using console here as a simple implementation
        // In a production app, this would be replaced with a proper logger
        // eslint-disable-next-line no-console
        console.warn(formatMessage('warn', message), ...args);
      }
    },
    
    error(message: string, ...args: unknown[]): void {
      if (shouldLog('error')) {
        // We're intentionally using console here as a simple implementation
        // In a production app, this would be replaced with a proper logger
        // eslint-disable-next-line no-console
        console.error(formatMessage('error', message), ...args);
      }
    }
  };
};

/**
 * Default logger instance for the runtime-adapter package
 */
export const logger = createLogger('runtime-adapter');
