/**
 * NocoDB provider implementation
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

export interface NocoDBProviderConfig {
  apiUrl: string;
  apiKey: string;
  projectId?: string;
  tableMapping?: Record<string, string>; // Maps resource names to table names
}

/**
 * Create a NocoDB provider
 */
export function createNocodbProvider(config: NocoDBProviderConfig): CrudProvider {
  const { 
    apiUrl, 
    apiKey,
    projectId,
    tableMapping = {}
  } = config;

  // Helper to get table name from resource name
  const getTableName = (resource: string): string => {
    return tableMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const tableName = getTableName(resource);
    const baseUrl = `${apiUrl}/api/v1/${projectId ? `${projectId}/` : ''}${tableName}`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  };

  // Default headers
  const headers = {
    'xc-auth': apiKey,
    'Content-Type': 'application/json'
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add pagination params
        if (pagination) {
          url.searchParams.append('limit', String(pagination.perPage));
          url.searchParams.append('offset', String((pagination.page - 1) * pagination.perPage));
        }
        
        // Add sort params
        if (sort) {
          url.searchParams.append('sort', `${sort.field}${sort.order === 'desc' ? ',-' : ','}`);
        }
        
        // Add filter params
        if (filter) {
          // NocoDB uses a specific filter format
          const filterObj: Record<string, any> = {};
          
          for (const [key, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              filterObj[key] = {
                eq: value
              };
            }
          }
          
          if (Object.keys(filterObj).length > 0) {
            url.searchParams.append('where', JSON.stringify(filterObj));
          }
        }
        
        // Fetch data
        const response = await fetch(url.toString(), { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Get total count from headers if available
        const totalCount = response.headers.get('x-total-count');
        const total = totalCount ? parseInt(totalCount, 10) : (Array.isArray(result) ? result.length : 0);
        
        // NocoDB returns an array of records
        const data = Array.isArray(result) ? result : result.list || [];
        
        return { data, total };
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
