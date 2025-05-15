/**
 * Provider types for the Zopio framework
 */

import type { CrudProvider, ProviderType } from '../types/index.js';

// ProviderType is imported from '../types/index.js'

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
