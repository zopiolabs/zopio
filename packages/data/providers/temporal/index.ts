/**
 * Temporal provider implementation
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

export interface TemporalProviderConfig {
  apiUrl: string;
  namespace?: string;
  resourceMapping?: Record<string, string>; // Maps resource names to Temporal resources
}

/**
 * Create a Temporal provider
 */
export function createTemporalProvider(config: TemporalProviderConfig): CrudProvider {
  const { 
    apiUrl, 
    namespace = 'default',
    resourceMapping = {
      workflows: 'workflows',
      activities: 'activities',
      tasks: 'tasks',
      namespaces: 'namespaces',
      schedules: 'schedules'
    }
  } = config;

  // Helper to get Temporal resource from resource name
  const getTemporalResource = (resource: string): string => {
    return resourceMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const temporalResource = getTemporalResource(resource);
    const baseUrl = `${apiUrl}/api/v1/${namespace}/${temporalResource}`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  };

  // Default headers
  const headers = {
    'Content-Type': 'application/json'
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        // Build URL with query parameters
        const url = new URL(buildUrl(resource));
        
        // Add pagination params
        if (pagination) {
          url.searchParams.append('pageSize', String(pagination.perPage));
          
          if (pagination.page > 1) {
            // Temporal uses token-based pagination
            // This is a simplified approach - in a real implementation,
            // you would need to store and use the nextPageToken from previous responses
            url.searchParams.append('nextPageToken', `page_${pagination.page}`);
          }
        }
        
        // Add filter params
        if (filter) {
          // Temporal uses a specific query format
          const query: Record<string, unknown> = {};
          
          for (const [key, value] of Object.entries(filter as Record<string, unknown>)) {
            if (value !== undefined && value !== null) {
              query[key] = value;
            }
          }
          
          if (Object.keys(query).length > 0) {
            url.searchParams.append('query', JSON.stringify(query));
          }
        }
        
        // Fetch data
        const response = await fetch(url.toString(), { headers });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Temporal returns data in a specific format
        // e.g. { executions: [...], nextPageToken: "..." }
        const temporalResource = getTemporalResource(resource);
        const data = result[temporalResource] || result.items || [];
        
        // Temporal doesn't provide a total count, so we estimate it
        const total = result.nextPageToken ? data.length * 2 : data.length;
        
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
          method: 'PUT',
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
