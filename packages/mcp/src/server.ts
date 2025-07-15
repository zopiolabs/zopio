/**
 * SPDX-License-Identifier: MIT
 */

import { validateResource } from './protocol.js';
/**
 * MCP Server implementation
 */
import type {
  ListResourcesResponse,
  MCPErrorResponse,
  MCPServerConfig,
  ReadResourceResponse,
  Resource,
  ResourceDefinition,
} from './types.js';

/**
 * MCP Server class for handling resource requests
 */
export class MCPServer {
  private config: MCPServerConfig;
  private resources: Map<string, Map<string, Resource>> = new Map();

  /**
   * Creates a new MCP server instance
   *
   * @param config Server configuration
   */
  constructor(config: MCPServerConfig) {
    this.config = config;

    // Initialize resource maps
    for (const type of Object.keys(config.resources)) {
      this.resources.set(type, new Map());
    }
  }

  /**
   * Lists available resources on this server
   *
   * @param cursor Optional pagination cursor
   * @param limit Optional limit on number of resources to return
   * @returns List of available resources
   */
  listResources(cursor?: string, limit = 50): ListResourcesResponse {
    const resourceTypes = Object.entries(this.config.resources);
    const startIndex = cursor ? Number.parseInt(cursor, 10) : 0;
    const endIndex = Math.min(startIndex + limit, resourceTypes.length);

    const resources = resourceTypes
      .slice(startIndex, endIndex)
      .map(([type, definition]) => ({
        type,
        description: (definition as ResourceDefinition).description,
      }));

    return {
      resources,
      pagination:
        endIndex < resourceTypes.length
          ? { cursor: endIndex.toString() }
          : undefined,
    };
  }

  /**
   * Registers a resource with the server
   *
   * @param resource The resource to register
   * @returns The registered resource
   * @throws If the resource type is not defined or validation fails
   */
  registerResource<T extends Resource>(resource: T): T {
    const { type, id } = resource;

    // Check if resource type is defined
    const definition = this.config.resources[type];
    if (!definition) {
      throw new Error(`Resource type '${type}' is not defined`);
    }

    // Validate resource against schema
    // Since validation doesn't change the structure, just ensures it's valid,
    // we can safely cast back to the original generic type
    const validatedResource = validateResource(resource, definition) as T;

    // Store resource
    const typeMap = this.resources.get(type);
    if (typeMap) {
      typeMap.set(id, validatedResource);
    } else {
      this.resources.set(type, new Map([[id, validatedResource]]));
    }

    return validatedResource;
  }

  /**
   * Retrieves a resource by type and id
   *
   * @param type Resource type
   * @param id Resource id
   * @returns The resource or null if not found
   */
  getResource(type: string, id: string): Resource | null {
    const typeMap = this.resources.get(type);
    if (!typeMap) {
      return null;
    }

    return typeMap.get(id) || null;
  }

  /**
   * Handles a request to read a resource
   *
   * @param type Resource type
   * @param id Resource id
   * @returns Response with the resource or an error
   */
  handleReadResource(
    type: string,
    id: string
  ): ReadResourceResponse | MCPErrorResponse {
    const resource = this.getResource(type, id);

    if (!resource) {
      return {
        error: {
          code: 'resource_not_found',
          message: `Resource of type '${type}' with id '${id}' not found`,
        },
      };
    }

    return { data: resource };
  }

  /**
   * Creates a resource definition with schema validation
   *
   * @param schema Zod schema for validating the resource
   * @param options Additional options for the resource definition
   * @returns A resource definition
   */
  static createResourceDefinition(
    schema: import('zod').ZodType,
    options: Omit<ResourceDefinition, 'schema'> = {}
  ): ResourceDefinition {
    return {
      schema: schema,
      ...options,
    };
  }
}
