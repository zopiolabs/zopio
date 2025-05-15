/**
 * @repo/data-base
 * 
 * Core data utilities and interfaces for Zopio framework that provides a standardized
 * foundation for data operations across all providers and UI components.
 */

// Export core types
export * from './types/index.js';

// Export CRUD handlers
export * from './handlers/index.js';

// Export utilities
export * from './utils/index.js';

// Export schema utilities
export * from './schema/index.js';

// Export mutation utilities
export * from './mutation/index.js';

// Export provider selection utilities
// Use named exports to avoid ambiguity
import * as providerExports from './provider/index.js';
export const {
  createDataProvider,
  createMockProvider,
  registerProvider,
  providerRegistry
} = providerExports;
