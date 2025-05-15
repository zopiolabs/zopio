/**
 * SyncOps provider implementation
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

export interface SyncOpsProviderConfig {
  apiUrl: string;
  apiKey: string;
  projectId: string;
  resourceMapping?: Record<string, string>; // Maps resource names to SyncOps resources
}

/**
 * Create a SyncOps provider
 */
export function createSyncOpsProvider(config: SyncOpsProviderConfig): CrudProvider {
  const { 
    apiUrl, 
    apiKey,
    projectId,
    resourceMapping = {}
  } = config;

  // Helper to get SyncOps resource from resource name
  const getSyncOpsResource = (resource: string): string => {
    return resourceMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const syncOpsResource = getSyncOpsResource(resource);
    const baseUrl = `${apiUrl}/api/v1/projects/${projectId}/${syncOpsResource}`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  };

  // Default headers
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add pagination params
        if (pagination) {
          url.searchParams.append('page', String(pagination.page));
          url.searchParams.append('per_page', String(pagination.perPage));
        }
        
        // Add sort params
        if (sort) {
          url.searchParams.append('sort_by', sort.field);
          url.searchParams.append('sort_order', sort.order);
        }
        
        // Add filter params
        if (filter) {
          for (const [key, value] of Object.entries(filter as Record<string, unknown>)) {
            if (value !== undefined && value !== null) {
              url.searchParams.append(`filter[${key}]`, String(value));
            }
          }
        }
        
        // Fetch data
        const response = await fetch(url.toString(), { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // SyncOps returns data in a specific format
        const data = result.data || [];
        const total = result.meta?.total || data.length;
        
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
        
        const result = await response.json();
        
        // SyncOps returns data in a specific format
        const data = result.data;
        
        if (!data) {
          throw new Error(`Record with id ${id} not found in ${resource}`);
        }
        
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
          body: JSON.stringify({ data: variables })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // SyncOps returns data in a specific format
        const data = result.data;
        
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
          body: JSON.stringify({ data: variables })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // SyncOps returns data in a specific format
        const data = result.data;
        
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
