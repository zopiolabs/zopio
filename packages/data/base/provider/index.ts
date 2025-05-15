/**
 * Provider selection utilities for the Zopio framework
 * Migrated from the old data-provider module
 */

import type { CrudProvider, CreateParams, UpdateParams, DeleteParams } from '../types/index.js';
import type { CreateDataProviderOptions, ProviderRegistry } from './types.js';

// Export provider types
export * from './types.js';

/**
 * Provider registry for dynamic provider loading
 * This will be populated by provider packages
 */
export const providerRegistry: ProviderRegistry = {};

/**
 * Register a provider factory
 */
export function registerProvider(
  type: string,
  factory: (config?: Record<string, unknown>) => CrudProvider
): void {
  providerRegistry[type] = factory;
}

/**
 * Create a data provider based on type and configuration
 * This is a placeholder that will be replaced by the actual implementation
 * in the providers package
 */
export function createDataProvider(options: CreateDataProviderOptions): CrudProvider {
  const { type, config = {} } = options;
  
  // Check if provider is registered
  if (providerRegistry[type]) {
    return providerRegistry[type](config);
  }
  
  // Fallback error
  throw new Error(`Provider type "${type}" is not registered. Make sure to import the provider package.`);
}

/**
 * Create a mock provider for testing
 */
export function createMockProvider(_config: Record<string, unknown> = {}): CrudProvider {
  // Simple mock implementation
  return {
    async getList<RecordType = unknown>() {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return { data: [] as RecordType[], total: 0 };
    },
    async getOne<RecordType = unknown>() {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return { data: {} as unknown as RecordType };
    },
    async create<RecordType = unknown>(params: CreateParams<RecordType | unknown>) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return { data: params.variables as RecordType };
    },
    async update<RecordType = unknown>(params: UpdateParams<RecordType | unknown>) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      const result = { id: params.id, ...params.variables } as unknown;
      return { data: result as RecordType };
    },
    async deleteOne<RecordType = unknown>(params: DeleteParams) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return { data: { id: params.id } as unknown as RecordType };
    }
  };
}

// Register the mock provider
registerProvider('mock', createMockProvider);
