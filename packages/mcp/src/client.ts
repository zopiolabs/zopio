/**
 * SPDX-License-Identifier: MIT
 */

/**
 * MCP Client implementation
 */
import type {
  ListResourcesResponse,
  MCPClientConfig,
  MCPErrorResponse,
  ReadResourceResponse,
  Resource,
} from './types.js';

/**
 * MCP Client class for interacting with MCP servers
 */
export class MCPClient {
  private config: MCPClientConfig;

  /**
   * Creates a new MCP client instance
   *
   * @param config Client configuration
   */
  constructor(config: MCPClientConfig) {
    this.config = config;
  }

  /**
   * Lists available resources from the server
   *
   * @param cursor Optional pagination cursor
   * @returns Promise resolving to list of available resources
   */
  async listResources(cursor?: string): Promise<ListResourcesResponse> {
    const url = new URL('/resources', this.config.serverUrl);
    if (cursor) {
      url.searchParams.set('cursor', cursor);
    }

    const response = await this.fetchWithHeaders(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to list resources: ${JSON.stringify(data)}`);
    }

    return data as ListResourcesResponse;
  }

  /**
   * Reads a resource from the server
   *
   * @param type Resource type
   * @param id Resource id
   * @returns Promise resolving to the resource
   */
  async readResource(type: string, id: string): Promise<Resource> {
    const url = new URL(`/resources/${type}/${id}`, this.config.serverUrl);

    const response = await this.fetchWithHeaders(url.toString());
    const data = await response.json();

    if (!response.ok) {
      const errorData = data as MCPErrorResponse;
      throw new Error(`Failed to read resource: ${errorData.error.message}`);
    }

    const responseData = data as ReadResourceResponse;
    return responseData.data;
  }

  /**
   * Performs a fetch request with the configured headers
   *
   * @param url URL to fetch
   * @param options Additional fetch options
   * @returns Promise resolving to the fetch response
   */
  private async fetchWithHeaders(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...options.headers,
    };

    return await fetch(url, {
      ...options,
      headers,
    });
  }
}
