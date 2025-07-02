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
 * Odoo Case Conversion Utilities
 *
 * Converts between snake_case (Odoo standard) and camelCase (JavaScript standard).
 */

/**
 * Converts an object with snake_case keys to camelCase keys
 *
 * @param obj - The object with snake_case keys
 * @returns A new object with the same values but camelCase keys
 */
export const snakeToCamel = (obj: any): any => {
  const result: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
};

/**
 * Converts an object with camelCase keys to snake_case keys
 *
 * @param obj - The object with camelCase keys
 * @returns A new object with the same values but snake_case keys
 */
export const camelToSnake = (obj: any): any => {
  const result: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );
    result[snakeKey] = obj[key];
  }
  return result;
};
