/**
 * Common Adapter Utilities
 * 
 * Shared utility functions for data adapters.
 */

import { GenericRecord } from './types';

/**
 * Safely accesses a nested property in an object using a path string
 * 
 * @param obj - The object to access
 * @param path - The dot-notation path to the property (e.g., 'user.profile.name')
 * @param defaultValue - The default value to return if the path doesn't exist
 * @returns The value at the path or the default value
 */
export const getNestedProperty = (obj: GenericRecord, path: string, defaultValue: any = undefined): any => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
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
