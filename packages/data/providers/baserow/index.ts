/**
 * Baserow provider implementation
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

export interface BaserowProviderConfig {
  apiUrl: string;
  token: string;
  databaseId: string;
  tableMapping?: Record<string, string>; // Maps resource names to table IDs
}

/**
 * Create a Baserow provider
 */
export function createBaserowProvider(config: BaserowProviderConfig): CrudProvider {
  const { 
    apiUrl, 
    token, 
    tableMapping = {}
  } = config;

  // Helper to get table ID from resource name
  const getTableId = (resource: string): string => {
    return tableMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const tableId = getTableId(resource);
    const baseUrl = `${apiUrl}/api/database/rows/table/${tableId}/`;
    return id ? `${baseUrl}${id}/` : baseUrl;
  };

  // Default headers
  const headers = {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };

  // Helper function to add pagination parameters to URL
  const addPaginationParams = (
    url: URL,
    pagination?: { page: number; perPage: number }
  ): void => {
    if (pagination) {
      url.searchParams.append('page', String(pagination.page));
      url.searchParams.append('size', String(pagination.perPage));
    }
  };

  // Helper function to add sort parameters to URL
  const addSortParams = (
    url: URL,
    sort?: { field: string; order: string }
  ): void => {
    if (sort) {
      const sortParam = sort.order === 'asc' ? sort.field : `-${sort.field}`;
      url.searchParams.append('order_by', sortParam);
    }
  };

  // Helper function to add filter parameters to URL
  const addFilterParams = (
    url: URL,
    filter?: Record<string, unknown>
  ): void => {
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(`filter__${key}__contains`, String(value));
        }
      }
    }
  };

  // Helper function to fetch and process response
  const fetchAndProcessData = async (url: URL, resource: string): Promise<GetListResult> => {
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return { 
      data: result.results, 
      total: result.count 
    };
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add parameters
        addPaginationParams(url, pagination);
        addSortParams(url, sort);
        addFilterParams(url, filter);
        
        // Fetch and process data
        return await fetchAndProcessData(url, resource);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch data
        const response = await fetch(buildUrl(resource, id), { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        // Create data
        const response = await fetch(buildUrl(resource), {
          method: 'POST',
          headers,
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Update data
        const response = await fetch(buildUrl(resource, id), {
          method: 'PATCH',
          headers,
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        // Get the record before deleting
        const { data } = await this.getOne({ resource, id });
        
        // Delete data
        const response = await fetch(buildUrl(resource, id), {
          method: 'DELETE',
          headers
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
        }
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}
