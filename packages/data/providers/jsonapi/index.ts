/**
 * JSON:API data provider implementation
 * 
 * This provider integrates with JSON:API compliant endpoints
 * (https://jsonapi.org/) for RESTful API operations.
 */

import type {
  CrudProvider,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  DeleteParams,
  DeleteResult
} from '@repo/data-base';
import { jsonapi } from "../../adapters/index.js";

export interface JsonApiProviderConfig {
  /**
   * Base URL of the JSON:API endpoint
   */
  apiUrl: string;
  
  /**
   * Optional headers to include in all requests
   */
  headers?: Record<string, string>;
  
  /**
   * Optional mapping of resource names to endpoint paths
   * @example { posts: 'blog-posts' }
   */
  resources?: Record<string, string>;
}

/**
 * Create a JSON:API data provider
 */
export function createJsonApiProvider(config: JsonApiProviderConfig): CrudProvider {
  const { apiUrl, headers = {}, resources = {} } = config;
  
  // Helper function to get the endpoint path for a resource
  const getResourcePath = (resource: string): string => {
    return resources[resource] || resource;
  };
  
  // Helper function to build the URL for a resource
  const buildUrl = ({ resource, id }: { resource: string; id?: string | number }): string => {
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const resourcePath = getResourcePath(resource);
    
    if (id) {
      return `${baseUrl}/${resourcePath}/${id}`;
    }
    
    return `${baseUrl}/${resourcePath}`;
  };
  
  // Helper function to get request headers with JSON:API content type
  const getHeaders = (includeContentType = false): Record<string, string> => {
    const requestHeaders: Record<string, string> = { ...headers };
    
    if (includeContentType) {
      requestHeaders["Content-Type"] = 'application/vnd.api+json';
    }
    
    requestHeaders.Accept = 'application/vnd.api+json';
    
    return requestHeaders;
  };
  
  // Helper function to add filter parameters to URL
  const addFilterParameters = (url: URL, filter: Record<string, unknown>): void => {
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(`filter[${key}]`, String(value));
      }
    }
  };
  
  // Helper function to process response
  const processResponse = async (response: Response): Promise<unknown> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const raw = await response.json();
    return jsonapi.normalizeJsonApi(raw);
  };
  
  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL
        const url = new URL(buildUrl({ resource }));
        
        // Add pagination if supported by the API
        if (pagination) {
          url.searchParams.append('page[number]', String(pagination.page));
          url.searchParams.append('page[size]', String(pagination.perPage));
        }
        
        // Add sorting if supported by the API
        if (sort) {
          const direction = sort.order.toLowerCase() === 'asc' ? '' : '-';
          url.searchParams.append('sort', `${direction}${sort.field}`);
        }
        
        // Add filtering if supported by the API
        if (filter) {
          // Extract this to reduce complexity
          addFilterParameters(url, filter);
        }
        
        // Fetch data
        const response = await fetch(url.toString(), { 
          headers: getHeaders()
        });
        
        // Process response
        const data = await processResponse(response) as unknown[];
        
        return { 
          data,
          total: data.length
        };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        if (!id) {
          throw new Error('ID is required for getOne operation');
        }
        
        // Fetch data
        const response = await fetch(buildUrl({ resource, id }), { 
          headers: getHeaders()
        });
        
        // Process response
        const data = await processResponse(response) as unknown[];
        
        // JSON:API returns an array, but we need the first item
        return { data: data[0] || {} };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        // Create data
        const response = await fetch(buildUrl({ resource }), {
          method: 'POST',
          headers: getHeaders(true),
          body: JSON.stringify({ data: variables })
        });
        
        // Process response
        const data = await processResponse(response) as unknown[];
        
        // JSON:API returns an array, but we need the first item
        return { data: data[0] || {} };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        if (!id) {
          throw new Error('ID is required for update operation');
        }
        
        // Update data
        const response = await fetch(buildUrl({ resource, id }), {
          method: 'PATCH',
          headers: getHeaders(true),
          body: JSON.stringify({ data: { id, ...variables } })
        });
        
        // Process response
        const data = await processResponse(response) as unknown[];
        
        // JSON:API returns an array, but we need the first item
        return { data: data[0] || {} };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    
    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        if (!id) {
          throw new Error('ID is required for delete operation');
        }
        
        // Delete data
        const response = await fetch(buildUrl({ resource, id }), {
          method: 'DELETE',
          headers: getHeaders()
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }
        
        // Return empty data object for successful deletion
        return { data: { id } };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}