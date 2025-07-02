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
 * Odoo Domain Builder
 *
 * Builds Odoo domain filters from simple query objects.
 */

/**
 * Builds an Odoo domain filter array from a simple filter object
 *
 * @param filter - The filter object with field names and values
 * @returns An Odoo domain array suitable for search operations
 */
export const buildOdooDomain = (filter: Record<string, any>): any[] => {
  const domain: any[] = [];
  for (const key in filter) {
    const value = filter[key];
    if (typeof value === 'object' && '$contains' in value) {
      domain.push([key, 'ilike', value['$contains']]);
    } else {
      domain.push([key, '=', value]);
    }
  }
  return domain;
};
