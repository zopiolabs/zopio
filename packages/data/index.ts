/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
/**
 * @repo/data
 *
 * Main entry point for the Zopio data packages. This package provides a comprehensive
 * solution for data operations, with a standardized interface across different data sources.
 *
 * The package is organized into two main subpackages:
 * - base: Core types, utilities, and base interfaces
 * - providers: Data providers that implement the CrudProvider interface
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
