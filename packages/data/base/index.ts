/**
 * @repo/data-base
 * 
 * Core data utilities and interfaces for Zopio framework that provides a standardized
 * foundation for data operations across all providers and UI components.
 *
 * This package serves as the foundation for the Zopio data layer, defining the core
 * interfaces and utilities that all data providers implement.
 */

/**
 * Core Types
 * 
 * These exports define the fundamental data types and interfaces used across
 * the Zopio data layer, including the CrudProvider interface and operation
 * parameters/results.
 */
export * from './types/index.js';

/**
 * Provider Utilities
 * 
 * These exports provide utilities for creating and registering data providers.
 */
import * as providerExports from './provider/index.js';
export const {
  createDataProvider,
  createMockProvider,
  registerProvider,
  providerRegistry
} = providerExports;

/**
 * CRUD Operation Handlers
 * 
 * These exports provide default implementations for CRUD operations
 * that can be extended by specific providers.
 */
export * from './handlers/index.js';

/**
 * Schema Utilities
 * 
 * These exports provide utilities for defining and validating data schemas.
 */
export * from './schema/index.js';

/**
 * Mutation Utilities
 * 
 * These exports provide utilities for data mutations and transformations.
 */
export * from './mutation/index.js';

/**
 * General Utilities
 * 
 * These exports provide general-purpose utilities for working with data.
 */
export * from './utils/index.js';
