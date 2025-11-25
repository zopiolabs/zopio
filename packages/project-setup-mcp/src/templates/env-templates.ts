/**
 * SPDX-License-Identifier: MIT
 */

import type { ProjectProfile, SelectedApps } from '../schemas/profile.js';

/**
 * Environment variable definition
 */
interface EnvVar {
  key: string;
  value: string;
  comment?: string;
  isClient?: boolean;
}

/**
 * Group environment variables by category
 */
interface EnvVarGroup {
  category: string;
  vars: EnvVar[];
}

/**
 * Get database environment variables
 */
function getDatabaseEnvVars(): EnvVarGroup {
  return {
    category: 'Database (Neon/Prisma)',
    vars: [
      {
        key: 'DATABASE_URL',
        value: '',
        comment: 'Neon PostgreSQL connection string',
      },
    ],
  };
}

/**
 * Get authentication environment variables
 */
function getAuthEnvVars(): EnvVarGroup {
  return {
    category: 'Authentication (Clerk)',
    vars: [
      { key: 'CLERK_SECRET_KEY', value: '', comment: 'Clerk secret key' },
      {
        key: 'CLERK_WEBHOOK_SECRET',
        value: '',
        comment: 'Clerk webhook secret (optional)',
      },
      {
        key: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        value: '',
        comment: 'Clerk publishable key',
        isClient: true,
      },
      {
        key: 'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
        value: '/sign-in',
        comment: 'Sign in URL path',
        isClient: true,
      },
      {
        key: 'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
        value: '/sign-up',
        comment: 'Sign up URL path',
        isClient: true,
      },
      {
        key: 'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
        value: '/',
        comment: 'Redirect after sign in',
        isClient: true,
      },
      {
        key: 'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL',
        value: '/',
        comment: 'Redirect after sign up',
        isClient: true,
      },
    ],
  };
}

/**
 * Get observability environment variables
 */
function getObservabilityEnvVars(): EnvVarGroup {
  return {
    category: 'Observability (Sentry/Logtail)',
    vars: [
      { key: 'SENTRY_ORG', value: '', comment: 'Sentry organization slug' },
      { key: 'SENTRY_PROJECT', value: '', comment: 'Sentry project slug' },
      { key: 'SENTRY_AUTH_TOKEN', value: '', comment: 'Sentry auth token' },
      {
        key: 'NEXT_PUBLIC_SENTRY_DSN',
        value: '',
        comment: 'Sentry DSN',
        isClient: true,
      },
      {
        key: 'BETTERSTACK_API_KEY',
        value: '',
        comment: 'BetterStack/Logtail API key',
      },
      { key: 'BETTERSTACK_URL', value: '', comment: 'BetterStack/Logtail URL' },
    ],
  };
}

/**
 * Get analytics environment variables
 */
function getAnalyticsEnvVars(profile: ProjectProfile): EnvVarGroup {
  const vars: EnvVar[] = [];
  const { analytics } = profile.crossCuttingConcerns;

  if (analytics.posthog) {
    vars.push({
      key: 'NEXT_PUBLIC_POSTHOG_KEY',
      value: '',
      comment: 'PostHog project API key',
      isClient: true,
    });
    vars.push({
      key: 'NEXT_PUBLIC_POSTHOG_HOST',
      value: 'https://app.posthog.com',
      comment: 'PostHog host URL',
      isClient: true,
    });
  }

  if (analytics.googleAnalytics) {
    vars.push({
      key: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
      value: '',
      comment: 'Google Analytics measurement ID',
      isClient: true,
    });
  }

  return {
    category: 'Analytics',
    vars,
  };
}

/**
 * Get storage environment variables
 */
function getStorageEnvVars(): EnvVarGroup {
  return {
    category: 'Storage (Vercel Blob)',
    vars: [
      {
        key: 'BLOB_READ_WRITE_TOKEN',
        value: '',
        comment: 'Vercel Blob read/write token',
      },
    ],
  };
}

/**
 * Get rate limiting environment variables
 */
function getRateLimitEnvVars(): EnvVarGroup {
  return {
    category: 'Rate Limiting (Upstash Redis)',
    vars: [
      {
        key: 'UPSTASH_REDIS_REST_URL',
        value: '',
        comment: 'Upstash Redis REST URL',
      },
      {
        key: 'UPSTASH_REDIS_REST_TOKEN',
        value: '',
        comment: 'Upstash Redis REST token',
      },
    ],
  };
}

/**
 * Get app URL environment variables
 */
function getAppUrlEnvVars(apps: SelectedApps): EnvVarGroup {
  const vars: EnvVar[] = [];

  if (apps.app) {
    vars.push({
      key: 'NEXT_PUBLIC_APP_URL',
      value: 'http://localhost:3000',
      comment: 'Main app URL',
      isClient: true,
    });
  }

  if (apps.api) {
    vars.push({
      key: 'VERCEL_PROJECT_PRODUCTION_URL',
      value: 'http://localhost:3002',
      comment: 'API production URL',
    });
  }

  if (apps.web) {
    vars.push({
      key: 'NEXT_PUBLIC_WEB_URL',
      value: 'http://localhost:3001',
      comment: 'Marketing site URL',
      isClient: true,
    });
  }

  if (apps.docs) {
    vars.push({
      key: 'NEXT_PUBLIC_DOCS_URL',
      value: 'http://localhost:3004',
      comment: 'Documentation site URL',
      isClient: true,
    });
  }

  return {
    category: 'App URLs',
    vars,
  };
}

/**
 * Format environment variables into .env file content
 */
function formatEnvFile(groups: EnvVarGroup[]): string {
  const serverVars: string[] = ['# Server'];
  const clientVars: string[] = ['# Client'];

  for (const group of groups) {
    if (group.vars.length === 0) {
      continue;
    }

    const serverGroupVars: string[] = [];
    const clientGroupVars: string[] = [];

    for (const v of group.vars) {
      const line = v.comment
        ? `${v.key}="${v.value}"`
        : `${v.key}="${v.value}"`;

      if (v.isClient) {
        clientGroupVars.push(line);
      } else {
        serverGroupVars.push(line);
      }
    }

    if (serverGroupVars.length > 0) {
      serverVars.push(`# ${group.category}`);
      serverVars.push(...serverGroupVars);
      serverVars.push('');
    }

    if (clientGroupVars.length > 0) {
      clientVars.push(`# ${group.category}`);
      clientVars.push(...clientGroupVars);
      clientVars.push('');
    }
  }

  return [...serverVars, '', ...clientVars].join('\n');
}

/**
 * Generate .env.example content for a specific app
 */
export function generateEnvTemplate(
  profile: ProjectProfile,
  appName: 'app' | 'api' | 'web' | 'docs' | 'database'
): string {
  const groups: EnvVarGroup[] = [];
  const { crossCuttingConcerns, selectedApps } = profile;

  // Database (always for app, api, and database package)
  if (['app', 'api', 'database'].includes(appName)) {
    groups.push(getDatabaseEnvVars());
  }

  // Auth (for app and api)
  if (crossCuttingConcerns.auth.enabled && ['app', 'api'].includes(appName)) {
    groups.push(getAuthEnvVars());
  }

  // Observability (for app and api)
  if (
    crossCuttingConcerns.observability.enabled &&
    ['app', 'api'].includes(appName)
  ) {
    groups.push(getObservabilityEnvVars());
  }

  // Analytics (for app and web)
  if (
    crossCuttingConcerns.analytics.enabled &&
    ['app', 'web'].includes(appName)
  ) {
    groups.push(getAnalyticsEnvVars(profile));
  }

  // Storage (for app and api)
  if (
    crossCuttingConcerns.storage.enabled &&
    ['app', 'api'].includes(appName)
  ) {
    groups.push(getStorageEnvVars());
  }

  // Rate limiting (for api)
  if (crossCuttingConcerns.rateLimit.enabled && appName === 'api') {
    groups.push(getRateLimitEnvVars());
  }

  // App URLs
  if (['app', 'api', 'web'].includes(appName)) {
    groups.push(getAppUrlEnvVars(selectedApps));
  }

  return formatEnvFile(groups);
}

/**
 * Get list of env vars that should be added for a profile
 */
export function getRequiredEnvVars(profile: ProjectProfile): string[] {
  const vars: string[] = ['DATABASE_URL'];
  const { crossCuttingConcerns } = profile;

  if (crossCuttingConcerns.auth.enabled) {
    vars.push('CLERK_SECRET_KEY', 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }

  if (crossCuttingConcerns.observability.enabled) {
    vars.push('NEXT_PUBLIC_SENTRY_DSN');
  }

  if (crossCuttingConcerns.analytics.posthog) {
    vars.push('NEXT_PUBLIC_POSTHOG_KEY', 'NEXT_PUBLIC_POSTHOG_HOST');
  }

  if (crossCuttingConcerns.storage.enabled) {
    vars.push('BLOB_READ_WRITE_TOKEN');
  }

  if (crossCuttingConcerns.rateLimit.enabled) {
    vars.push('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN');
  }

  return vars;
}
