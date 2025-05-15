/**
 * REST data provider implementation
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

export interface RestProviderOptions {
  apiUrl: string;
  httpClient?: typeof fetch;
  headers?: HeadersInit;
}

/**
 * Create a REST data provider
 */
export function createRestProvider(options: RestProviderOptions | string = '' as string): CrudProvider {
  // Allow passing just the apiUrl as a string
  const config = typeof options === 'string' 
    ? { apiUrl: options } 
    : options;
    
  const {
    apiUrl = '/api',
    httpClient = fetch,
    headers = {
      'Content-Type': 'application/json'
    }
  } = config;

  // Helper function to add pagination parameters to URL
  const addPaginationParams = (url: URL, pagination?: { page: number; perPage: number }): void => {
    if (pagination) {
      url.searchParams.append('_page', String(pagination.page));
      url.searchParams.append('_limit', String(pagination.perPage));
    }
  };

  // Helper function to add sort parameters to URL
  const addSortParams = (url: URL, sort?: { field: string; order: string }): void => {
    if (sort) {
      url.searchParams.append('_sort', sort.field);
      url.searchParams.append('_order', sort.order);
    }
  };

  // Helper function to add filter parameters to URL
  const addFilterParams = (url: URL, filter?: Record<string, unknown>): void => {
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }
  };

  // Helper function to extract total count from response
  const extractTotalCount = (response: Response, data: unknown): number => {
    const totalHeader = response.headers.get('X-Total-Count');
    if (totalHeader) {
      return Number.parseInt(totalHeader, 10);
    }
    return Array.isArray(data) ? data.length : 0;
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      // Build URL with query parameters
      const url = new URL(`${apiUrl}/${resource}`, window.location.origin);
      
      // Add parameters
      addPaginationParams(url, pagination);
      addSortParams(url, sort);
      addFilterParams(url, filter);
      
      const response = await httpClient(url.toString(), {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching ${resource}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const total = extractTotalCount(response, data);
      
      return { 
        data: Array.isArray(data) ? data : [], 
        total 
      };
    },
    
    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      const response = await httpClient(`${apiUrl}/${resource}/${id}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return { data: data.data || data };
    },
    
    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      const response = await httpClient(`${apiUrl}/${resource}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(variables)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create ${resource}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return { data: data.data || data };
    },
    
    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      const response = await httpClient(`${apiUrl}/${resource}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(variables)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return { data: data.data || data };
    },
    
    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      const response = await httpClient(`${apiUrl}/${resource}/${id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return { data: data.data || data };
    }
  };
}
