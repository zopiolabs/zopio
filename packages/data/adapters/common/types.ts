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
 * Common Adapter Types
 *
 * Type definitions shared across data adapters.
 */

/**
 * Generic record type with string keys and any values
 */
export type GenericRecord = Record<string, any>;

/**
 * Relation object with ID and name
 */
export interface RelationObject {
  id: number | string;
  name: string;
}

/**
 * Filter operator types for query building
 */
export type FilterOperator =
  | '$eq' // Equal to
  | '$ne' // Not equal to
  | '$gt' // Greater than
  | '$gte' // Greater than or equal to
  | '$lt' // Less than
  | '$lte' // Less than or equal to
  | '$in' // In array
  | '$nin' // Not in array
  | '$contains' // Contains substring
  | '$exists'; // Field exists
