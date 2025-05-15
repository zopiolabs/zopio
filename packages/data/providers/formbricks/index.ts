/**
 * Formbricks provider implementation
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

export interface FormbricksProviderConfig {
  apiUrl: string;
  apiKey: string;
  environmentId: string;
  resourceMapping?: Record<string, string>; // Maps resource names to Formbricks resources
}

/**
 * Create a Formbricks provider
 */
export function createFormbricksProvider(config: FormbricksProviderConfig): CrudProvider {
  const { 
    apiUrl, 
    apiKey, 
    environmentId,
    resourceMapping = {}
  } = config;

  // Helper to get Formbricks resource from resource name
  const getFormbricksResource = (resource: string): string => {
    return resourceMapping[resource] || resource;
  };

  // Helper to build URLs
  const buildUrl = (resource: string, id?: string | number): string => {
    const formbricksResource = getFormbricksResource(resource);
    const baseUrl = `${apiUrl}/api/v1/management/${formbricksResource}`;
    
    // Add environment ID if needed
    const urlWithEnv = formbricksResource === 'surveys' || formbricksResource === 'responses' 
      ? `${baseUrl}?environmentId=${environmentId}` 
      : baseUrl;
    
    return id ? `${urlWithEnv}/${id}` : urlWithEnv;
  };

  // Default headers
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  // Extracted helpers for getList
  function buildFormbricksListUrl(resource: string, pagination?: { page: number; perPage: number }, filter?: Record<string, unknown>): string {
    const url = new URL(buildUrl(resource));
    if (pagination) {
      url.searchParams.append('limit', String(pagination.perPage));
      url.searchParams.append('offset', String((pagination.page - 1) * pagination.perPage));
    }
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }
    return url.toString();
  }
  async function processFormbricksListResponse(response: Response): Promise<GetListResult> {
    if (!response.ok) {
      throw new Error(`Failed to fetch resource: ${response.statusText}`);
    }
    const result = await response.json();
    const data = Array.isArray(result) ? result : result.data;
    const total = Array.isArray(result) ? result.length : (result.meta?.total || data.length);
    return { data, total };
  }

  return {
    async getList({ resource, pagination, filter }: GetListParams): Promise<GetListResult> {
      try {
        const url = buildFormbricksListUrl(resource, pagination, filter);
        const response = await fetch(url, { headers });
        return await processFormbricksListResponse(response);
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
          body: JSON.stringify({
            ...(variables as Record<string, unknown>),
            environmentId
          })
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
