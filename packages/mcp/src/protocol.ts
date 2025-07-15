/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Core protocol implementation for MCP
 */
import { z } from 'zod';
import type { Relationship, Resource, ResourceDefinition } from './types.js';

/**
 * Base schema for all MCP resources
 */
export const resourceSchema = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.record(z.string(), z.unknown()).optional(),
  relationships: z
    .record(
      z.string(),
      z.object({
        data: z.union([
          z.object({ id: z.string(), type: z.string() }),
          z.array(z.object({ id: z.string(), type: z.string() })),
          z.null(),
        ]),
      })
    )
    .optional(),
});

/**
 * Validates a resource against its schema definition
 *
 * @param resource The resource to validate
 * @param definition The resource definition containing the schema
 * @returns The validated resource or throws an error
 */
export function validateResource<T extends Resource>(
  resource: unknown,
  definition: ResourceDefinition
): T {
  return definition.schema.parse(resource) as T;
}

/**
 * Creates a new resource with the given type, id, and data
 *
 * @param type The resource type
 * @param id The resource id
 * @param data Additional resource data
 * @returns A new resource
 */
export function createResource<T extends Record<string, unknown>>(
  type: string,
  id: string,
  data: T
): Resource {
  const { attributes, relationships, ...rest } = data;

  return {
    id,
    type,
    ...(attributes
      ? { attributes: attributes as Record<string, unknown> }
      : {}),
    ...(relationships
      ? { relationships: relationships as Record<string, Relationship> }
      : {}),
    ...rest,
  };
}

/**
 * Creates a relationship object for a resource
 *
 * @param id The related resource id
 * @param type The related resource type
 * @returns A relationship object
 */
export function createRelationship(id: string, type: string) {
  return {
    data: { id, type },
  };
}

/**
 * Creates a to-many relationship object for resources
 *
 * @param items Array of related resource identifiers
 * @returns A to-many relationship object
 */
export function createToManyRelationship(
  items: Array<{ id: string; type: string }>
) {
  return {
    data: items,
  };
}
