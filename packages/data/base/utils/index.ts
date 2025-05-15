/**
 * Utility functions for data operations
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
} from '../types/index.js';

/**
 * Helper function to build URL with pagination parameters
 */
function buildUrlWithParams(apiUrl: string, resource: string, pagination?: { page: number; perPage: number }, sort?: { field: string; order: 'asc' | 'desc' }, filter?: Record<string, unknown>): URL {
  const url = new URL(`${apiUrl}/${resource}`, window.location.origin);
  
  // Add pagination params if provided
  if (pagination) {
    url.searchParams.append('page', String(pagination.page));
    url.searchParams.append('per_page', String(pagination.perPage));
  }
  
  // Add sort params if provided
  if (sort) {
    url.searchParams.append('sort', sort.field);
    url.searchParams.append('order', sort.order);
  }
  
  // Add filter params if provided
  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    }
  }
  
  return url;
}

/**
 * Helper function to fetch data from an API endpoint
 */
async function fetchFromApi(url: URL, resource: string): Promise<unknown> {
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Create a fetch-based data provider with sensible defaults
 */
export function createFetchDataProvider(apiUrl = '/api'): CrudProvider {
  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult<unknown>> {
      // Build URL with parameters using helper function
      const url = buildUrlWithParams(apiUrl, resource, pagination, sort, filter);
      
      // Fetch data using helper function
      const data = await fetchFromApi(url, resource) as Record<string, unknown>;
      
      // Return formatted result
      return {
        data: Array.isArray(data.data) ? data.data : [] as unknown[],
        total: typeof data.total === 'number' ? data.total : (Array.isArray(data.data) ? data.data.length : 0)
      };
    },
    
    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult<unknown>> {
      const response = await fetch(`${apiUrl}/${resource}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return { data: data as unknown };
    },
    
    async create({ resource, variables }: CreateParams<unknown>): Promise<CreateResult<unknown>> {
      const response = await fetch(`${apiUrl}/${resource}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(variables)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create ${resource}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return { data: data as unknown };
    },
    
    async update({ resource, id, variables }: UpdateParams<unknown>): Promise<UpdateResult<unknown>> {
      const response = await fetch(`${apiUrl}/${resource}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(variables)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return { data: data as unknown };
    },
    
    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult<unknown>> {
      const response = await fetch(`${apiUrl}/${resource}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return { data: data as unknown };
    }
  };
}

// Default instance with standard configuration
export const dataProvider = createFetchDataProvider();
