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
 * JSON:API Flattener
 *
 * Flattens JSON:API entities into simple objects for easier consumption.
 */

import type { GenericRecord } from '../common/types.js';

/**
 * JSON:API resource object interface
 */
interface JsonApiResource {
  id: string;
  type: string;
  attributes?: GenericRecord;
  relationships?: Record<string, { data: unknown }>;
}

/**
 * Flattens a JSON:API entity into a simple object
 *
 * @param data - The JSON:API entity to flatten
 * @returns A flattened object with ID and attributes
 */
export const flattenJsonApi = (data: JsonApiResource): GenericRecord => {
  const result: GenericRecord = { id: data.id, ...(data.attributes || {}) };

  if (data.relationships) {
    for (const key in data.relationships) {
      if (Object.prototype.hasOwnProperty.call(data.relationships, key)) {
        result[key] = data.relationships[key].data;
      }
    }
  }

  return result;
};
