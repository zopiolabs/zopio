import { init } from '@sentry/nextjs';
// Use relative path without extension
import { keys } from './keys';

// Initialize Sentry
export const initializeSentry = () => {
  try {
    const dsn = keys().NEXT_PUBLIC_SENTRY_DSN;
    const opts = { dsn };

    if (process.env.NEXT_RUNTIME === 'nodejs') {
      init(opts);
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      init(opts);
    }

    return true;
  } catch (error) {
    // Gracefully handle missing environment variables
    // Using a conditional to avoid issues in environments where process.env is not available
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      // biome-ignore lint/suspicious/noConsole: Acceptable during development
      console.warn('Sentry initialization skipped:', error instanceof Error ? error.message : 'Unknown error');
    }
    return false;
  }
};

// Standard Next.js instrumentation export
export async function register() {
  // Use Promise.resolve to provide an await target
  await Promise.resolve(initializeSentry());
}
