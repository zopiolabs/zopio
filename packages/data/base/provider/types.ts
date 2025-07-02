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
