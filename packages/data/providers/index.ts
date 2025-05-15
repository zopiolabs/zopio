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
      // @ts-expect-error Config type is handled internally by the provider
      return createRestProvider(config);
    case 'mock':
      return createMockProvider();
    case 'graphql':
      // @ts-expect-error Config type is handled internally by the provider
      return createGraphQLProvider(config);
    case 'firebase':
      // @ts-expect-error Config type is handled internally by the provider
      return createFirebaseProvider(config);
    case 'supabase':
      // @ts-expect-error Config type is handled internally by the provider
      return createSupabaseProvider(config);
    case 'local':
      return createLocalProvider(config);
    case 'drizzle':
      // @ts-expect-error Config type is handled internally by the provider
      return createDrizzleProvider(config);
    case 'kysely':
      // @ts-expect-error Config type is handled internally by the provider
      return createKyselyProvider(config);
    case 'prisma':
      // @ts-expect-error Config type is handled internally by the provider
      return createPrismaProvider(config);
    case 'zopio':
      // @ts-expect-error Config type is handled internally by the provider
      return createZopioProvider(config);
    case 'airtable':
      // @ts-expect-error Config type is handled internally by the provider
      return createAirtableProvider(config);
    case 'baserow':
      // @ts-expect-error Config type is handled internally by the provider
      return createBaserowProvider(config);
    case 'formbricks':
      // @ts-expect-error Config type is handled internally by the provider
      return createFormbricksProvider(config);
    case 'github':
      // @ts-expect-error Config type is handled internally by the provider
      return createGithubProvider(config);
    case 'google-sheets':
      // @ts-expect-error Config type is handled internally by the provider
      return createGoogleSheetsProvider(config);
    case 'killbill':
      // @ts-expect-error Config type is handled internally by the provider
      return createKillbillProvider(config);
    case 'medusa':
      // @ts-expect-error Config type is handled internally by the provider
      return createMedusaProvider(config);
    case 'n8n':
      // @ts-expect-error Config type is handled internally by the provider
      return createN8nProvider(config);
    case 'neon':
      // @ts-expect-error Config type is handled internally by the provider
      return createNeonProvider(config);
    case 'nocodb':
      // @ts-expect-error Config type is handled internally by the provider
      return createNocodbProvider(config);
    case 'notion':
      // @ts-expect-error Config type is handled internally by the provider
      return createNotionProvider(config);
    case 'odoo':
      // @ts-expect-error Config type is handled internally by the provider
      return createOdooProvider(config);
    case 'sap':
      // @ts-expect-error Config type is handled internally by the provider
      return createSAPProvider(config);
    case 'shopify':
      // @ts-expect-error Config type is handled internally by the provider
      return createShopifyProvider(config);
    case 'stripe':
      // @ts-expect-error Config type is handled internally by the provider
      return createStripeProvider(config);
    case 'syncops':
      // @ts-expect-error Config type is handled internally by the provider
      return createSyncOpsProvider(config);
    case 'temporal':
      // @ts-expect-error Config type is handled internally by the provider
      return createTemporalProvider(config);
    case 'xata':
      // @ts-expect-error Config type is handled internally by the provider
      return createXataProvider(config);
    default:
      throw new Error(`Unsupported data provider type: ${type}`);
  }
}
