/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Utility functions for MCP
 */
import type { Resource, ResourceIdentifier } from './types.js';

/**
 * Generates a unique ID for a resource
 *
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export function generateResourceId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${prefix}${timestamp}${randomPart}`;
}

/**
 * Extracts a resource identifier from a resource
 *
 * @param resource The resource to extract from
 * @returns A resource identifier
 */
export function getResourceIdentifier(resource: Resource): ResourceIdentifier {
  return {
    id: resource.id,
    type: resource.type,
  };
}

/**
 * Checks if two resource identifiers refer to the same resource
 *
 * @param a First resource identifier
 * @param b Second resource identifier
 * @returns True if they refer to the same resource
 */
export function isSameResource(
  a: ResourceIdentifier,
  b: ResourceIdentifier
): boolean {
  return a.id === b.id && a.type === b.type;
}

/**
 * Serializes a resource to JSON
 *
 * @param resource The resource to serialize
 * @returns JSON string representation
 */
export function serializeResource(resource: Resource): string {
  return JSON.stringify(resource);
}

/**
 * Deserializes a resource from JSON
 *
 * @param json JSON string representation
 * @returns The deserialized resource
 */
export function deserializeResource(json: string): Resource {
  return JSON.parse(json) as Resource;
}
