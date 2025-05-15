/**
 * Provider types for the Zopio framework
 */

import type { CrudProvider } from '../types/index.js';

/**
 * Available provider types in the system
 */
export type ProviderType =
  | 'rest'
  | 'graphql'
  | 'firebase'
  | 'supabase'
  | 'mock'
  | 'local'
  | 'airtable'
  | 'medusa'
  | 'drizzle'
  | 'kysely'
  | 'xata'
  | 'neon'
  | 'odoo'
  | 'sap'
  | 'zopio'
  | 'prisma'
  | 'syncops'
  | 'github'
  | 'notion'
  | 'baserow'
  | 'nocodb'
  | 'google-sheets'
  | 'n8n'
  | 'temporal'
  | 'killbill'
  | 'stripe'
  | 'formbricks'
  | 'shopify'
  | 'custom';

/**
 * Configuration options for creating a data provider
 */
export interface CreateDataProviderOptions {
  type: ProviderType;
  config?: Record<string, unknown>;
}

/**
 * Provider factory function type
 */
export type ProviderFactory = (
  config?: Record<string, unknown>
) => CrudProvider;

/**
 * Provider registry for dynamic provider loading
 */
export interface ProviderRegistry {
  [key: string]: ProviderFactory;
}
