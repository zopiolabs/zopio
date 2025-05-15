/**
 * @repo/data-providers
 * 
 * Unified data providers for Zopio framework that implement the CRUD interface
 * for various backends and services.
 */

import type { CreateDataProviderOptions, CrudProvider } from '@repo/data-base';

// Import provider implementations
import { createRestProvider } from './rest/index.js';
import { createMockProvider } from './mock/index.js';
import { createGraphQLProvider } from './graphql/index.js';
import { createFirebaseProvider } from './firebase/index.js';
import { createSupabaseProvider } from './supabase/index.js';
import { createLocalProvider } from './local/index.js';
import { createDrizzleProvider } from './drizzle/index.js';
import { createKyselyProvider } from './kysely/index.js';
import { createPrismaProvider } from './prisma/index.js';
import { createZopioProvider } from './zopio/index.js';
import { createAirtableProvider } from './airtable/index.js';
import { createBaserowProvider } from './baserow/index.js';
import { createFormbricksProvider } from './formbricks/index.js';
import { createGithubProvider } from './github/index.js';
import { createGoogleSheetsProvider } from './google-sheets/index.js';
import { createKillbillProvider } from './killbill/index.js';
import { createMedusaProvider } from './medusa/index.js';
import { createN8nProvider } from './n8n/index.js';
import { createNeonProvider } from './neon/index.js';
import { createNocodbProvider } from './nocodb/index.js';
import { createNotionProvider } from './notion/index.js';
import { createOdooProvider } from './odoo/index.js';
import { createSAPProvider } from './sap/index.js';
import { createShopifyProvider } from './shopify/index.js';
import { createStripeProvider } from './stripe/index.js';
import { createSyncOpsProvider } from './syncops/index.js';
import { createTemporalProvider } from './temporal/index.js';
import { createXataProvider } from './xata/index.js';

// Export individual providers for direct use
export * from './rest/index.js';
export * from './mock/index.js';
export * from './graphql/index.js';
export * from './firebase/index.js';
export * from './supabase/index.js';
export * from './local/index.js';
export * from './drizzle/index.js';
export * from './kysely/index.js';
export * from './prisma/index.js';
export * from './zopio/index.js';
export * from './airtable/index.js';
export * from './baserow/index.js';
export * from './formbricks/index.js';
export * from './github/index.js';
export * from './google-sheets/index.js';
export * from './killbill/index.js';
export * from './medusa/index.js';
export * from './n8n/index.js';
export * from './neon/index.js';
export * from './nocodb/index.js';
export * from './notion/index.js';
export * from './odoo/index.js';
export * from './sap/index.js';
export * from './shopify/index.js';
export * from './stripe/index.js';
export * from './syncops/index.js';
export * from './temporal/index.js';
export * from './xata/index.js';

/**
 * Factory function to create a data provider based on type
 */
export function createDataProvider(options: CreateDataProviderOptions): CrudProvider {
  const { type, config = {} } = options;

  switch (type) {
    case 'rest':
      // Type assertion for provider-specific config
      return createRestProvider(config as any);
    case 'mock':
      return createMockProvider();
    case 'graphql':
      // Type assertion for provider-specific config
      return createGraphQLProvider(config as any);
    case 'firebase':
      // Type assertion for provider-specific config
      return createFirebaseProvider(config as any);
    case 'supabase':
      // Type assertion for provider-specific config
      return createSupabaseProvider(config as any);
    case 'local':
      return createLocalProvider(config);
    case 'drizzle':
      // Type assertion for provider-specific config
      return createDrizzleProvider(config as any);
    case 'kysely':
      // Type assertion for provider-specific config
      return createKyselyProvider(config as any);
    case 'prisma':
      // Type assertion for provider-specific config
      return createPrismaProvider(config as any);
    case 'zopio':
      // Type assertion for provider-specific config
      return createZopioProvider(config as any);
    case 'airtable':
      // Type assertion for provider-specific config
      return createAirtableProvider(config as any);
    case 'baserow':
      // Type assertion for provider-specific config
      return createBaserowProvider(config as any);
    case 'formbricks':
      // Type assertion for provider-specific config
      return createFormbricksProvider(config as any);
    case 'github':
      // Type assertion for provider-specific config
      return createGithubProvider(config as any);
    case 'google-sheets':
      // Type assertion for provider-specific config
      return createGoogleSheetsProvider(config as any);
    case 'killbill':
      // Type assertion for provider-specific config
      return createKillbillProvider(config as any);
    case 'medusa':
      // Type assertion for provider-specific config
      return createMedusaProvider(config as any);
    case 'n8n':
      // Type assertion for provider-specific config
      return createN8nProvider(config as any);
    case 'neon':
      // Type assertion for provider-specific config
      return createNeonProvider(config as any);
    case 'nocodb':
      // Type assertion for provider-specific config
      return createNocodbProvider(config as any);
    case 'notion':
      // Type assertion for provider-specific config
      return createNotionProvider(config as any);
    case 'odoo':
      // Type assertion for provider-specific config
      return createOdooProvider(config as any);
    case 'sap':
      // Type assertion for provider-specific config
      return createSAPProvider(config as any);
    case 'shopify':
      // Type assertion for provider-specific config
      return createShopifyProvider(config as any);
    case 'stripe':
      // Type assertion for provider-specific config
      return createStripeProvider(config as any);
    case 'syncops':
      // Type assertion for provider-specific config
      return createSyncOpsProvider(config as any);
    case 'temporal':
      // Type assertion for provider-specific config
      return createTemporalProvider(config as any);
    case 'xata':
      // Type assertion for provider-specific config
      return createXataProvider(config as any);
    default:
      throw new Error(`Unsupported data provider type: ${type}`);
  }
}
