/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Core types for the Model Context Protocol (MCP)
 */
import type { z } from 'zod';

/**
 * Base resource interface that all MCP resources must implement
 */
export interface Resource {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, Relationship>;
}

/**
 * Relationship between resources
 */
export interface Relationship {
  data: ResourceIdentifier | ResourceIdentifier[] | null;
}

/**
 * Resource identifier used in relationships
 */
export interface ResourceIdentifier {
  id: string;
  type: string;
}

/**
 * MCP server configuration
 */
export interface MCPServerConfig {
  name: string;
  description?: string;
  resources: Record<string, ResourceDefinition>;
}

/**
 * Definition of a resource type
 */
export interface ResourceDefinition {
  schema: z.ZodType;
  description?: string;
  examples?: unknown[];
}

/**
 * MCP client configuration
 */
export interface MCPClientConfig {
  serverUrl: string;
  headers?: Record<string, string>;
}

/**
 * Response from an MCP server listing available resources
 */
export interface ListResourcesResponse {
  resources: Array<{
    type: string;
    description?: string;
  }>;
  pagination?: {
    cursor?: string;
  };
}

/**
 * Response from an MCP server when reading a resource
 */
export interface ReadResourceResponse {
  data: Resource;
}

/**
 * Error response from an MCP server
 */
export interface MCPErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
