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
 * Odoo Input Flattener
 *
 * Prepares data for Odoo API create/update operations.
 */

/**
 * Flattens an object for Odoo API input by converting objects with IDs to just IDs
 *
 * @param data - The data to flatten for Odoo API input
 * @returns A flattened object suitable for Odoo API operations
 */
export const flattenOdooInput = (
  data: Record<string, any>
): Record<string, any> => {
  const flattened: Record<string, any> = {};
  for (const key in data) {
    const value = data[key];
    if (value && typeof value === 'object' && 'id' in value) {
      flattened[key] = value.id;
    } else {
      flattened[key] = value;
    }
  }
  return flattened;
};
