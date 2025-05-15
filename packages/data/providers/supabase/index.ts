/**
 * Supabase provider implementation
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

// Define regex pattern at the top level scope to avoid performance issues
const CONTENT_RANGE_PATTERN = /\d+-\d+\/(\d+)/;

export interface SupabaseProviderConfig {
  url: string;
  apiKey: string;
  tableMapping?: Record<string, string>; // Maps resource names to table names
}

/**
 * Create a Supabase provider
 */
export function createSupabaseProvider(config: SupabaseProviderConfig): CrudProvider {
  const { 
    url, 
    apiKey,
    tableMapping = {}
  } = config;

  // Helper to get table name from resource name
  const getTableName = (resource: string): string => {
    return tableMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string): string => {
    const tableName = getTableName(resource);
    return `${url}/rest/v1/${tableName}`;
  };

  // Default headers
  const headers = {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  // Helper function to add pagination parameters to request headers
  const addPaginationParams = (
    pagination?: { page: number; perPage: number }
  ): void => {
    if (pagination) {
      const { page, perPage } = pagination;
      const start = (page - 1) * perPage;
      const end = start + perPage - 1;
      
      // Supabase uses Range header for pagination
      // Use type assertion to avoid TypeScript error
      (headers as Record<string, string>).Range = `${start}-${end}`;
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
          url.searchParams.append(key, `eq.${value}`);
        }
      }
    }
  };

  // Helper function to add sort parameters to URL
  const addSortParams = (
    url: URL,
    sort?: { field: string; order: string }
  ): void => {
    if (sort) {
      url.searchParams.append('order', `${sort.field}.${sort.order}`);
    }
  };

  // Helper function to process response and extract total count
  const processResponse = async (response: Response): Promise<{ data: unknown[]; total: number }> => {
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Get total count from Content-Range header
    let total = data.length;
    const contentRange = response.headers.get('Content-Range');
    
    if (contentRange) {
      const matches = contentRange.match(CONTENT_RANGE_PATTERN);
      if (matches) {
        total = Number.parseInt(matches[1], 10);
      }
    }
    
    return { data, total };
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add parameters
        if (pagination) {
          addPaginationParams(pagination);
        }
        addFilterParams(url, filter);
        addSortParams(url, sort);
        
        // Fetch data and process response
        const response = await fetch(url.toString(), { headers });
        return await processResponse(response);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Build URL
        const url = new URL(buildUrl(resource));
        url.searchParams.append('id', `eq.${id}`);
        
        // Fetch data
        const response = await fetch(url.toString(), { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
        }
        
        const results = await response.json();
        
        if (!results || results.length === 0) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        return { data: results[0] };
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
        
        const results = await response.json();
        
        return { data: Array.isArray(results) ? results[0] : results };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        // Build URL
        const url = new URL(buildUrl(resource));
        url.searchParams.append('id', `eq.${id}`);
        
        // Update data
        const response = await fetch(url.toString(), {
          method: 'PATCH',
          headers,
          body: JSON.stringify(variables)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        const results = await response.json();
        
        if (!results || results.length === 0) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
        return { data: results[0] };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        // Get the record before deleting
        const { data } = await this.getOne({ resource, id });
        
        // Build URL
        const url = new URL(buildUrl(resource));
        url.searchParams.append('id', `eq.${id}`);
        
        // Delete data
        const response = await fetch(url.toString(), {
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
