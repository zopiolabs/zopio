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
 * Common Adapter Utilities
 *
 * Shared utility functions for data adapters.
 */

import type { GenericRecord } from './types.js';

/**
 * Safely accesses a nested property in an object using a path string
 *
 * @param obj - The object to access
 * @param path - The dot-notation path to the property (e.g., 'user.profile.name')
 * @param defaultValue - The default value to return if the path doesn't exist
 * @returns The value at the path or the default value
 */
export const getNestedProperty = (
  obj: GenericRecord,
  path: string,
  defaultValue: any = undefined
): any => {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      return defaultValue;
    }
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
};

/**
 * Removes undefined values from an object
 *
 * @param obj - The object to clean
 * @returns A new object without undefined values
 */
export const removeUndefined = (obj: GenericRecord): GenericRecord => {
  const result: GenericRecord = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result;
};
