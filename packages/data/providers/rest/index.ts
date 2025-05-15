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
export function createRestProvider(options: RestProviderOptions | string = {}): CrudProvider {
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

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      const url = new URL(`${apiUrl}/${resource}`, window.location.origin);
      
      // Add pagination params
      if (pagination) {
        url.searchParams.append('page', String(pagination.page));
        url.searchParams.append('per_page', String(pagination.perPage));
      }
      
      // Add sort params
      if (sort) {
        url.searchParams.append('sort', sort.field);
        url.searchParams.append('order', sort.order);
      }
      
      // Add filter params
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }
      
      const response = await httpClient(url.toString(), {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        data: data.data || [],
        total: data.total || data.data?.length || 0
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
