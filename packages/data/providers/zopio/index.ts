/**
 * Zopio client provider implementation
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

export interface ZopioClientConfig {
  baseUrl: string;
  headers?: HeadersInit;
}

/**
 * Create a Zopio client provider
 */
export function createZopioProvider(config: ZopioClientConfig): CrudProvider {
  const { baseUrl, headers = {} } = config;

  const buildUrl = (resource: string, id?: string | number) =>
    `${baseUrl}/${resource}${id ? `/${id}` : ""}`;

  // Helper function to add pagination parameters to URL
  const addPaginationParams = (url: URL, pagination?: { page: number; perPage: number }): void => {
    if (pagination) {
      url.searchParams.append('page', String(pagination.page));
      url.searchParams.append('per_page', String(pagination.perPage));
    }
  };

  // Helper function to add sort parameters to URL
  const addSortParams = (url: URL, sort?: { field: string; order: string }): void => {
    if (sort) {
      url.searchParams.append('sort', sort.field);
      url.searchParams.append('order', sort.order);
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

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      // Build URL with query parameters
      const url = new URL(buildUrl(resource), window.location.origin);
      
      // Add parameters
      addPaginationParams(url, pagination);
      addSortParams(url, sort);
      addFilterParams(url, filter);
      
      const res = await fetch(url.toString(), { headers });
      
      if (!res.ok) {
        throw new Error(`Error fetching ${resource}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      return {
        data: data.data || [],
        total: data.total || data.data?.length || 0
      };
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      const res = await fetch(buildUrl(resource, id), { headers });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch ${resource}/${id}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      return { data: data.data || data };
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      const res = await fetch(buildUrl(resource), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(variables)
      });
      
      if (!res.ok) {
        throw new Error(`Failed to create ${resource}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      return { data: data.data || data };
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      const res = await fetch(buildUrl(resource, id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(variables)
      });
      
      if (!res.ok) {
        throw new Error(`Failed to update ${resource}/${id}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      return { data: data.data || data };
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      const res = await fetch(buildUrl(resource, id), {
        method: 'DELETE',
        headers
      });
      
      if (!res.ok) {
        throw new Error(`Failed to delete ${resource}/${id}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      return { data: data.data || data };
    }
  };
}
