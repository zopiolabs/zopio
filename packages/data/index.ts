/**
 * @repo/data
 * 
 * Main entry point for the Zopio data packages. This package provides a comprehensive
 * solution for data operations, with a standardized interface across different data sources.
 * 
 * The package is organized into three main subpackages:
 * - base: Core types, utilities, and base interfaces
 * - providers: Data providers that implement the CrudProvider interface
 * - ui: React components and hooks for working with data
 */

/**
 * Base Package
 * 
 * Core types, utilities, and base interfaces for data operations.
 * Includes the CrudProvider interface, operation parameters/results,
 * and utilities for creating and registering data providers.
 */
export * as base from './base/index.js';

/**
 * Providers Package
 * 
 * Data providers that implement the CrudProvider interface.
 * Includes providers for various data sources like Supabase, Firebase,
 * REST APIs, and more.
 */
export * as providers from './providers/index.js';

/**
 * UI Package
 * 
 * React components and hooks for working with data.
 * Includes components for displaying data, hooks for data fetching,
 * and utilities for form handling.
 */
export * as ui from './ui/index.js';
