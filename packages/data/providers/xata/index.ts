/**
 * Xata provider implementation
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

export interface XataProviderConfig {
  apiKey: string;
  databaseURL: string;
  branch?: string;
  tableMapping?: Record<string, string>; // Maps resource names to table names
}

/**
 * Create a Xata provider
 */
export function createXataProvider(config: XataProviderConfig): CrudProvider {
  const { 
    apiKey, 
    databaseURL,
    branch = 'main',
    tableMapping = {}
  } = config;

  // Helper to get table name from resource name
  const getTableName = (resource: string): string => {
    return tableMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const tableName = getTableName(resource);
    const baseUrl = `${databaseURL}/tables/${tableName}`;
    return id ? `${baseUrl}/data/${id}` : `${baseUrl}/query`;
  };

  // Default headers
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'X-Xata-Branch': branch
  };

  // Helper function to build filter object for Xata
  const buildFilterObject = (filter?: Record<string, unknown>): Record<string, unknown> | null => {
    if (!filter || Object.keys(filter).length === 0) {
      return null;
    }
    
    const filterObj: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null) {
        filterObj[key] = { $eq: value };
      }
    }
    
    return Object.keys(filterObj).length > 0 ? filterObj : null;
  };

  // Helper function to build sort object for Xata
  const buildSortObject = (sort?: { field: string; order: string }): Record<string, string> | null => {
    if (!sort) {
      return null;
    }
    
    return {
      [sort.field]: sort.order === 'asc' ? 'asc' : 'desc'
    };
  };

  // Helper function to build pagination object for Xata
  const buildPaginationObject = (pagination?: { page: number; perPage: number }): Record<string, number> | null => {
    if (!pagination) {
      return null;
    }
    
    return {
      size: pagination.perPage,
      offset: (pagination.page - 1) * pagination.perPage
    };
  };

  // Helper function to process response and extract data and total
  const processResponse = async (response: Response, resource: string): Promise<GetListResult> => {
    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Xata returns data in a specific format
    const data = result.records || [];
    const total = result.meta?.page?.totalRecords || data.length;
    
    return { data, total };
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build request body
        const body: Record<string, unknown> = {};
        
        // Add parameters
        const filterObj = buildFilterObject(filter);
        if (filterObj) {
          body.filter = filterObj;
        }
        
        const sortObj = buildSortObject(sort);
        if (sortObj) {
          body.sort = sortObj;
        }
        
        const pageObj = buildPaginationObject(pagination);
        if (pageObj) {
          body.page = pageObj;
        }
        
        // Fetch data
        const response = await fetch(buildUrl(resource), {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        });
        
        // Process response
        return await processResponse(response, resource);
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        // Fetch data
        const response = await fetch(buildUrl(resource, id), {
          headers
        });
        
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
        const response = await fetch(buildUrl(resource).replace('/query', '/data'), {
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
