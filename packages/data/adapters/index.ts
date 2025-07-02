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
 * @repo/adapters
 *
 * A unified interface for data format adapters in the Zopio framework.
 * This module exports all available adapters with consistent interfaces.
 */

export * as jsonapi from './jsonapi/index.js';
export * as odoo from './odoo/index.js';
export * from './common/index.js';
